
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

// Mock Header Component with Login/Signup Modal
const Header = ({ userType = 'student', userName = 'SkillMentor' }) => {
  const [notifications, setNotifications] = useState(3);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  // Navigation items based on user type
  const navigationItems = {
    student: [
      { label: 'Tutors', href: '/student' },
      { label: 'About Us', href: '/student/about' },
      { label: 'Resources', href: '/student/resources' },
      { label: 'Dashboard', href: '/student/dashboard' }
    ],
    tutor: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Classes', href: '/classes' },
      { label: 'Students', href: '/students' },
      { label: 'Schedule', href: '/schedule' },
      { label: 'Analytics', href: '/analytics' }
    ],
    mentor: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Mentees', href: '/mentees' },
      { label: 'Sessions', href: '/sessions' },
      { label: 'Resources', href: '/resources' },
      { label: 'Profile', href: '/profile' }
    ]
  };

  const userTypeConfig = {
    student: {
      displayName: 'Student Portal',
      logoColor: 'bg-[#03b2ed]',
      buttonText: 'Login'
    },
    tutor: {
      displayName: 'Tutor Dashboard',
      logoColor: 'bg-[#9414d1]',
      buttonText: 'Profile'
    },
    mentor: {
      displayName: 'Mentor Hub',
      logoColor: 'bg-[#450063]',
      buttonText: 'Profile'
    }
  };

  const currentConfig = userTypeConfig[userType] || userTypeConfig.student;
  const navItems = navigationItems[userType] || navigationItems.student;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login/signup logic here
    console.log(isSignup ? 'Signup' : 'Login', formData);
    // Close modal after submission
    setShowLoginModal(false);
    // Reset form
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
  };

  const handleLoginButtonClick = () => {
    if (currentConfig.buttonText === 'Login') {
      setShowLoginModal(true);
    } else {
      // Handle profile button click for tutor/mentor
      console.log('Profile clicked');
    }
  };

  const toggleSignup = () => {
    setIsSignup(!isSignup);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
  };

  return (
    <>
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
                <p className="text-gray-500 text-sm">{currentConfig.displayName}</p>
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
              {/* Search - Only for tutors and mentors */}
              {(userType === 'tutor' || userType === 'mentor') && (
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
              
              {/* Notifications - Common for all users */}
              <button className="relative p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-[#03b2ed] transition-all duration-200">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5V3h0v14z" />
                </svg>
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#fd59ca] rounded-full text-xs text-white flex items-center justify-center font-medium">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Profile/Login Button - Common for all users */}
              <button 
                onClick={handleLoginButtonClick}
                className="flex items-center space-x-2 bg-[#9414d1] hover:bg-[#450063] text-white px-4 py-2 rounded-lg transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">{currentConfig.buttonText}</span>
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
      </header>

      {/* Login/Signup Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-[#280120]">
                {isSignup ? 'Create Account' : 'Welcome Back'}
              </h2>
              <button
                onClick={() => setShowLoginModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div onSubmit={handleSubmit} className="space-y-4">
                {/* Name field - only for signup */}
                {isSignup && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                      required={isSignup}
                    />
                  </div>
                )}

                {/* Email field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Password field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {/* Confirm Password field - only for signup */}
                {isSignup && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-transparent transition-all duration-200"
                      placeholder="Confirm your password"
                      required={isSignup}
                    />
                  </div>
                )}

                {/* Forgot Password - only for login */}
                {!isSignup && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-[#9414d1] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#9414d1] hover:bg-[#450063] text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {isSignup ? 'Create Account' : 'Sign In'}
                </button>
                </div>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500">or</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Social Login Options */}
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center space-x-3 border border-gray-300 rounded-lg py-3 px-4 hover:bg-gray-50 transition-all duration-200">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-gray-700 font-medium">Continue with Google</span>
                </button>

                <button className="w-full flex items-center justify-center space-x-3 border border-gray-300 rounded-lg py-3 px-4 hover:bg-gray-50 transition-all duration-200">
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-gray-700 font-medium">Continue with Facebook</span>
                </button>
              </div>

              {/* Toggle between Login/Signup */}
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  {isSignup ? 'Already have an account?' : "Don't have an account?"}
                  <button
                    type="button"
                    onClick={toggleSignup}
                    className="ml-2 text-[#9414d1] font-medium hover:underline"
                  >
                    {isSignup ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;