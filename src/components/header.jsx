import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import { User } from 'lucide-react';

const Header = ({ userType = 'student', userName = 'SkillMentor' }) => {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user, isSignedIn } = useUser();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if current user is admin based on userType or stored data
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (userType === 'admin') {
        setIsAdmin(true);
      } else if (isSignedIn && user) {
        // Check if this Clerk user is linked to an admin account
        try {
          const email = user.primaryEmailAddress?.emailAddress;
          const response = await fetch(`http://localhost:8080/api/v1/academic/admin/by-email/${email}`);
          if (response.ok) {
            setIsAdmin(true);
          }
        } catch (error) {
          console.log('User is not an admin');
          setIsAdmin(false);
        }
      }
    };

    checkAdminStatus();
  }, [userType, isSignedIn, user]);

  // Navigation items based on user type
  const navigationItems = {
    student: [
      { label: 'Tutors', href: '/student' },
      { label: 'About Us', href: '/student/about' },
      { label: 'Resources', href: '/student/resources' },
      { label: 'Dashboard', href: '/student/dashboard' }
    ],
    mentor: [
      { label: 'Classroom', href: '/mentor' },
      { label: 'Sessions', href: '/mentor/sessions' }
    ],
    admin: [
      { label: 'Dashboard', href: '/admin' },
      { label: 'Users', href: '/admin/users' },
      { label: 'Sessions', href: '/admin/sessions' },
      { label: 'Settings', href: '/admin/settings' }
    ]
  };

  const userTypeConfig = {
    student: {
      displayName: 'Student Portal',
      logoColor: 'bg-[#03b2ed]'
    },
    mentor: {
      displayName: 'Mentor Hub',
      logoColor: 'bg-[#450063]'
    },
    admin: {
      displayName: 'Admin Panel',
      logoColor: 'bg-[#dc2626]'
    }
  };

  const currentConfig = userTypeConfig[userType] || userTypeConfig.student;
  const navItems = navigationItems[userType] || navigationItems.student;

  const handleLogout = async () => {
    try {
      // Always sign out from Clerk first (this handles both students and admins linked to Clerk)
      // The admin will have been linked to Clerk during the login process in LandingPage
      if (signOut) {
        console.log('Signing out from Clerk...');
        await signOut();
      }
      
      // Clear any additional local storage that might be used for admin sessions
      localStorage.removeItem('authToken');
      localStorage.removeItem('userType');
      localStorage.removeItem('userData');
      localStorage.removeItem('adminSession');
      sessionStorage.clear();
      
      // Navigate to home page
      navigate('/');
      setShowLogoutModal(false);
      
    } catch (error) {
      console.error('Error during logout:', error);
      
      // Fallback: Force logout by clearing everything and redirecting
      try {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/');
        setShowLogoutModal(false);
        
        // If navigation doesn't work, force page reload
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      } catch (fallbackError) {
        console.error('Fallback logout failed:', fallbackError);
        // Last resort - force page reload
        window.location.href = '/';
      }
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // Get profile navigation path based on user type
  const getProfilePath = () => {
    switch (userType) {
      case 'mentor':
        return '/mentor/profile';
      case 'admin':
        return '/admin/profile';
      case 'student':
      default:
        return '/student/profile';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 ${currentConfig.logoColor} rounded-lg flex items-center justify-center shadow-sm`}>
              <span className="text-white font-bold text-lg">SM</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#280120]">
                {userName}
              </h1>
              <p className="text-gray-500 text-sm">
                {currentConfig.displayName}
                {isAdmin && isSignedIn && user && (
                  <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                    Admin
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-[#9414d1] bg-gray-100'
                      : 'text-gray-600 hover:text-[#9414d1] hover:bg-gray-50'
                  }`
                }
                end
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Search - For tutors, mentors, and admins */}
            {(userType === 'tutor' || userType === 'mentor' || userType === 'admin') && (
              <div className="relative hidden md:block">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#03b2ed] focus:border-transparent transition-all duration-200 w-64"
                />
              </div>
            )}

            {/* Logout Button */}
            <button 
              onClick={handleLogoutClick}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-white font-medium ${
                userType === 'admin' 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-[#9414d1] hover:bg-[#450063]'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>LogOut</span>
            </button>

            {/* Profile Icon */}
            <button
              onClick={() => navigate(getProfilePath())}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-200"
            >
              <User className="w-5 h-5 text-gray-700" />
            </button>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-200">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="lg:hidden mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                    isActive
                      ? 'text-[#9414d1] bg-gray-100'
                      : 'text-gray-600 hover:text-[#9414d1] hover:bg-gray-50'
                  }`
                }
                end
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#280120]">
                Confirm Logout
              </h2>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Are you sure you want to logout?
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {userType === 'admin' ? 
                      'You will be signed out of your admin session and redirected to the home page.' :
                      'You will be redirected to the home page and will need to login again to access your account.'
                    }
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className={`flex-1 font-medium py-3 px-4 rounded-lg transition-all duration-200 text-white ${
                    userType === 'admin' 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;