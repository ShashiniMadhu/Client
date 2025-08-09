import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import {
  Users,
  BookOpen,
  User,
  GraduationCap,
  Calendar,
  Shield,
  Menu,
  X,
  ChevronDown,
  LogOut
} from 'lucide-react';
import logo from '../../assets/logo.png';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useClerk();
  const { user } = useUser();

  // Navigation items - using relative paths for admin routes
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Calendar },
    { name: 'Sessions', href: '/admin/sessions', icon: Calendar },
    { name: 'Classes', href: '/admin/classes', icon: BookOpen },
    { name: 'Mentors', href: '/admin/mentors', icon: User },
    { name: 'Students', href: '/admin/students', icon: GraduationCap },
  ];

  // Function to check if current route is active
  const isActiveRoute = (href) => {
    if (href === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname === href;
  };

  // User info
  const adminName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Admin';
  const adminEmail = user?.primaryEmailAddress?.emailAddress;

  // Navigation handler
  const handleNavigation = (href) => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate(href);
  };

  // Logout handler
  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    
    try {
      console.log('Admin signing out from Clerk...');
      
      if (signOut) {
        await signOut();
      }
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('userType');
      localStorage.removeItem('userData');
      localStorage.removeItem('adminSession');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('clerkUserId');
      sessionStorage.clear();
      
      setShowConfirmLogout(false);
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);
      
      navigate('/');
      
    } catch (error) {
      console.error('Error during admin logout:', error);
      
      try {
        localStorage.clear();
        sessionStorage.clear();
        setShowConfirmLogout(false);
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/');
        
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
        
      } catch (fallbackError) {
        console.error('Fallback logout failed:', fallbackError);
        window.location.href = '/';
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-6">
            <Link to="/admin" className="flex items-center space-x-6">
              <img 
                src={logo} 
                alt="SkillMentor Logo" 
                className="w-12 h-12 rounded-lg object-cover shadow-sm" 
              />
              <div className="flex flex-col leading-tight">
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#450063] via-[#fd59ca] to-[#03b2ed] bg-clip-text text-transparent tracking-tight">
                  Skill<span className="text-[#280120]">Mentor</span>
                </h1>
                <p className="text-sm font-medium italic text-[#450063]">
                  Admin Panel
                  <span className="ml-2 text-xs bg-[#450063]/10 text-[#450063] px-2 py-1 rounded-full">
                    Administrator
                  </span>
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 mx-12">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-5 py-3 font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-[#450063] bg-[#450063]/10 shadow-sm'
                      : 'text-gray-600 hover:text-[#450063] hover:bg-[#450063]/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#450063] to-[#350051] rounded-full flex items-center justify-center">
                  {user?.imageUrl ? (
                    <img 
                      src={user.imageUrl} 
                      alt="Admin" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <div className="font-medium text-gray-900 text-sm">{adminName}</div>
                  {adminEmail && (
                    <div className="text-gray-500 text-xs">{adminEmail}</div>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="font-medium text-gray-900">{adminName}</div>
                    {adminEmail && (
                      <div className="text-sm text-gray-500">{adminEmail}</div>
                    )}
                    <div className="text-xs text-[#450063] font-medium mt-1">Administrator</div>
                  </div>
                  
                  <button
                    onClick={() => handleNavigation('/admin/profile')}
                    className="w-full text-left flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-[#450063]/5 hover:text-[#450063] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  
                  <button
                    onClick={() => handleNavigation('/admin/settings')}
                    className="w-full text-left flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-[#450063]/5 hover:text-[#450063] transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  
                  <hr className="my-2 border-gray-200" />
                  
                  <button
                    onClick={() => setShowConfirmLogout(true)}
                    disabled={isLoggingOut}
                    className="w-full text-left flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button 
              onClick={() => setShowConfirmLogout(true)}
              disabled={isLoggingOut}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-white font-medium bg-[#450063] hover:bg-[#350051] disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-100">
            
            {/* Mobile User Info */}
            <div className="px-4 py-3 border-b border-gray-200 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#450063] to-[#350051] rounded-full flex items-center justify-center">
                  {user?.imageUrl ? (
                    <img 
                      src={user.imageUrl} 
                      alt="Admin" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{adminName}</div>
                  <div className="text-xs text-[#450063] font-medium">Administrator</div>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Items */}
            <div className="space-y-1 mb-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                      isActive
                        ? 'text-[#450063] bg-[#450063]/10'
                        : 'text-gray-600 hover:text-[#450063] hover:bg-[#450063]/10'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Profile Links */}
            <div className="pt-4 border-t border-gray-200 space-y-1">
              <button
                onClick={() => handleNavigation('/admin/profile')}
                className="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:text-[#450063] hover:bg-[#450063]/10 transition-all duration-200"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </button>
              
              <button
                onClick={() => handleNavigation('/admin/settings')}
                className="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:text-[#450063] hover:bg-[#450063]/10 transition-all duration-200"
              >
                <Shield className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </button>
              
              <button
                onClick={() => setShowConfirmLogout(true)}
                disabled={isLoggingOut}
                className="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sign Out Confirmation Modal */}
      {showConfirmLogout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto border border-gray-100 overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">Confirm Sign Out</h2>
                </div>
                <button
                  onClick={() => setShowConfirmLogout(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogOut className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Are you sure you want to sign out?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  You will be signed out of your admin session and redirected to the home page.
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmLogout(false)}
                  disabled={isLoggingOut}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 border border-gray-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  disabled={isLoggingOut}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoggingOut && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  )}
                  <span>{isLoggingOut ? 'Signing Out...' : 'Yes, Sign Out'}</span>
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