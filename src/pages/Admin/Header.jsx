import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  User,
  GraduationCap,
  Calendar,
  Bell,
  Shield,
  Menu,
  X,
  ChevronDown,
  LogOut
} from 'lucide-react';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const navigate = useNavigate();

  const handleLogoutConfirm = () => {
    setShowConfirmLogout(false);
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    // Optional: Clear auth/session data here
    navigate('/');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Calendar },
    { name: 'Sessions', href: '/admin/sessions', icon: Calendar },
    { name: 'Classes', href: '/admin/classes', icon: BookOpen },
    { name: 'Mentors', href: '/admin/mentors', icon: User },
    { name: 'Students', href: '/admin/students', icon: GraduationCap },
  ];

  return (
    <header className="relative">
      {/* Main Header */}
      <div className="bg-gradient-to-r from-[#280120] via-[#450063] to-[#9414d1] shadow-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-[#03b2ed] to-[#fd59ca] rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-2xl font-black text-white">
                  Skill<span className="text-[#03b2ed]">Mentor</span>
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group flex items-center space-x-2 px-4 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  >
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">{item.name}</span>
                  </a>
                );
              })}
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#03b2ed] to-[#fd59ca] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden md:block font-medium text-white">Admin</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 z-50">
                    <a href="/profile" className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </a>
                    <a href="/settings" className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors">
                      <Shield className="w-4 h-4" />
                      <span>Settings</span>
                    </a>
                    <hr className="my-2 border-slate-200" />
                    <button
                      onClick={() => setShowConfirmLogout(true)}
                      className="w-full text-left flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/20 backdrop-blur-xl border-t border-white/10">
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </a>
                );
              })}

              {/* Mobile Profile Links */}
              <hr className="my-3 border-white/20" />
              <a
                href="/profile"
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </a>
              <a
                href="/settings"
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Shield className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </a>
              <button
                onClick={() => setShowConfirmLogout(true)}
                className="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl text-red-300 hover:text-red-200 hover:bg-red-900/20 transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Gradient Border Effect */}
      <div className="h-1 bg-gradient-to-r from-[#03b2ed] via-[#fd59ca] to-[#03b2ed]"></div>

      {/* Sign Out Confirmation Modal */}
      {showConfirmLogout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Sign Out</h2>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to sign out?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmLogout(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
