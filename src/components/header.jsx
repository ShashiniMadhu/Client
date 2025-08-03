import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import { User } from 'lucide-react';
import logo from '../assets/logo.png';

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
      taglineColor: 'text-[#450063]',
      navColor: 'text-[#450063]',
      navActiveColor: 'text-[#450063] bg-[#450063]/10',
      buttonColor: 'bg-[#450063] hover:bg-[#350051]'
    },
    mentor: {
      displayName: 'Mentor Hub',
      taglineColor: 'text-[#450063]',
      navColor: 'text-[#450063]',
      navActiveColor: 'text-[#450063] bg-[#450063]/10',
      buttonColor: 'bg-[#450063] hover:bg-[#350051]'
    },
    admin: {
      displayName: 'Admin Panel',
      taglineColor: 'text-red-600',
      navColor: 'text-red-600',
      navActiveColor: 'text-red-600 bg-red-50',
      buttonColor: 'bg-red-500 hover:bg-red-600'
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
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section - Consistent with Landing Page */}
          <div className="flex items-center space-x-4">
            <img src={logo} alt="SkillMentor Logo" className="w-12 h-12 rounded-lg object-cover shadow-sm" />
            <div className="flex flex-col leading-tight">
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#450063] via-[#fd59ca] to-[#03b2ed] bg-clip-text text-transparent tracking-tight">
                Skill<span className="text-[#280120]">Mentor</span>
              </h1>
              <p className={`text-sm font-medium italic ${currentConfig.taglineColor}`}>
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
                      ? currentConfig.navActiveColor
                      : `text-gray-600 hover:${currentConfig.navColor} hover:bg-gray-50`
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
                  className="bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#450063] focus:border-transparent transition-all duration-200 w-64"
                />
              </div>
            )}

            {/* Profile Icon */}
            <button
              onClick={() => navigate(getProfilePath())}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-200"
            >
              <User className="w-5 h-5 text-gray-700" />
            </button>

            {/* Logout Button */}
            <button 
              onClick={handleLogoutClick}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-white font-medium ${currentConfig.buttonColor}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
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
                      ? currentConfig.navActiveColor
                      : `text-gray-600 hover:${currentConfig.navColor} hover:bg-gray-50`
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto border border-gray-100 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold">Confirm Logout</h2>
                </div>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Are you sure you want to logout?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {userType === 'admin' ? 
                    'You will be signed out of your admin session and redirected to the home page.' :
                    'You will be redirected to the home page and will need to login again to access your account.'
                  }
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
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