import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Award, Star, ArrowRight, X, GraduationCap, UserCheck } from 'lucide-react';
import Footer from '../../components/footer';

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [userRole, setUserRole] = useState(''); // 'student' or 'mentor'
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  
  const [formData, setFormData] = useState({
    // Common fields
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    password: '',
    confirmPassword: '',
    role: '',
    // Student specific
    age: '',
    // Mentor specific
    title: '',
    profession: '',
    subject: '',
    qualification: '',
    session_fee: '',
    bio:''
  });
  // Login state for error/loading
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      address: '',
      password: '',
      confirmPassword: '',
      role: '',
      age: '',
      title: '',
      profession: '',
      subject: '',
      qualification: '',
      session_fee: '',
      bio: ''
    });
  };

 
  const handleRoleSelect = (role) => {
    setUserRole(role);
    setShowRoleSelection(false);
    setFormData((prev) => ({
      ...prev,
      role: role
    }));
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (authMode === 'login') {
      setLoginError('');
      setLoginLoading(true);
      if (!formData.email || !formData.password) {
        setLoginError('Please fill in all fields');
        setLoginLoading(false);
        return;
      }
      const result = await login(formData.email, formData.password);
      if (result.success) {
        // Redirect based on role (case-insensitive)
        if (result.data.role && result.data.role.toLowerCase() === 'student') {
          navigate('/student');
        } else if (result.data.role && result.data.role.toLowerCase() === 'mentor') {
          navigate('/mentor');
        } else {
          navigate('/');
        }
        setShowAuthModal(false);
        setAuthMode('login');
        setUserRole('');
        setShowRoleSelection(false);
        resetForm();
      } else {
        setLoginError(result.error || 'Login failed.');
      }
      setLoginLoading(false);
      return;
    }

    if (authMode === 'signup' && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Prepare data based on user role
    let submitData = {};
    let endpoint = '';

    if (userRole === 'student') {
      submitData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        address: formData.address,
        age: parseInt(formData.age),
        password: formData.password,
        role: 'student'
      };
      endpoint = 'http://localhost:8080/api/v1/academic/student';
    } else if (userRole === 'mentor') {
      submitData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        address: formData.address,
        email: formData.email,
        title: formData.title,
        profession: formData.profession,
        subject: formData.subject,
        phone_number: formData.phone_number,
        qualification: formData.qualification,
        session_fee: parseFloat(formData.session_fee),
        password: formData.password,
        role: 'mentor',
        bio: formData.bio
      };
      endpoint = 'http://localhost:8080/api/v1/academic/mentor';
    }

    try {
      if (endpoint) {
        const response = await axios.post(endpoint, submitData);
        if (response.status === 201 || response.status === 200) {
          alert('Registration successful!');
        } else {
          alert('Registration failed. Please try again.');
        }
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('An error occurred during registration.');
      }
    }

    // Close modal and reset
    setShowAuthModal(false);
    setAuthMode('login');
    setUserRole('');
    setShowRoleSelection(false);
    resetForm();
  };

  // --- RETURN: Main JSX ---
  const stats = [
    { icon: <Users className="w-6 h-6" />, number: "10,000+", label: "Active Students" },
    { icon: <BookOpen className="w-6 h-6" />, number: "500+", label: "Expert Mentors" },
    { icon: <Award className="w-6 h-6" />, number: "95%", label: "Success Rate" },
    { icon: <Star className="w-6 h-6" />, number: "4.9", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#9414d1] to-[#03b2ed] rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">SM</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#280120]">SkillMentor</h1>
                <p className="text-gray-500 text-sm">Learn • Grow • Succeed</p>
              </div>
            </div>
            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setAuthMode('login');
                }}
                className="px-6 py-2 text-[#9414d1] font-medium hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setAuthMode('signup');
                  setShowRoleSelection(true);
                }}
                className="px-6 py-2 bg-gradient-to-r from-[#9414d1] to-[#03b2ed] hover:from-[#450063] hover:to-[#fd59ca] text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#280120] via-[#450063] to-[#9414d1]">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#03b2ed]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#fd59ca]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-6xl font-black text-white mb-6 leading-tight">
              Transform Your Future with
              <span className="block bg-gradient-to-r from-[#03b2ed] via-[#fd59ca] to-[#03b2ed] bg-clip-text text-transparent">
                Expert Mentorship
              </span>
            </h1>
            <p className="text-xl text-white/80 font-medium max-w-3xl mx-auto mb-12 leading-relaxed">
              Connect with industry experts and accelerate your learning journey. Whether you're a student seeking guidance or a professional wanting to share knowledge, we're here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setAuthMode('signup');
                  setShowRoleSelection(true);
                }}
                className="group bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] hover:from-[#fd59ca] hover:to-[#03b2ed] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>Get Started Today</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
              <button className="bg-white/20 backdrop-blur-lg border border-white/30 hover:bg-white/30 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-[#9414d1] to-[#03b2ed] rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">{stat.number}</h3>
              <p className="text-slate-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-[#280120] mb-4">Why Choose SkillMentor?</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Experience personalized learning with industry experts who are passionate about your success.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-2xl bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-[#03b2ed]/20 to-[#9414d1]/20 rounded-2xl flex items-center justify-center text-[#9414d1] mx-auto mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Expert Mentors</h3>
            <p className="text-slate-600 leading-relaxed">Learn from industry professionals with years of real-world experience and proven track records.</p>
          </div>
          <div className="text-center p-8 rounded-2xl bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-[#03b2ed]/20 to-[#9414d1]/20 rounded-2xl flex items-center justify-center text-[#9414d1] mx-auto mb-6">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Personalized Learning</h3>
            <p className="text-slate-600 leading-relaxed">Get customized learning paths tailored to your goals, pace, and preferred learning style.</p>
          </div>
          <div className="text-center p-8 rounded-2xl bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-[#03b2ed]/20 to-[#9414d1]/20 rounded-2xl flex items-center justify-center text-[#9414d1] mx-auto mb-6">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Proven Results</h3>
            <p className="text-slate-600 leading-relaxed">Join thousands of successful learners who have achieved their career goals through our platform.</p>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-[#280120]">
                {showRoleSelection ? 'Choose Your Role' : 
                 authMode === 'login' ? 'Welcome Back' : 
                 `Sign Up as ${userRole === 'student' ? 'Student' : 'Mentor'}`}
              </h2>
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  setAuthMode('login');
                  setUserRole('');
                  setShowRoleSelection(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-6">
              {/* Role Selection */}
              {showRoleSelection && (
                <div className="space-y-4">
                  <p className="text-gray-600 text-center mb-6">Please select how you'd like to join SkillMentor:</p>
                  <button
                    onClick={() => handleRoleSelect('student')}
                    className="w-full p-6 border border-gray-200 rounded-xl hover:border-[#03b2ed] hover:bg-blue-50/50 transition-all duration-200 text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#03b2ed] to-[#fd59ca] rounded-lg flex items-center justify-center text-white">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">I'm a Student</h3>
                        <p className="text-gray-600 text-sm">Looking to learn and grow with expert guidance</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSelect('mentor')}
                    className="w-full p-6 border border-gray-200 rounded-xl hover:border-[#9414d1] hover:bg-purple-50/50 transition-all duration-200 text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#9414d1] to-[#450063] rounded-lg flex items-center justify-center text-white">
                        <UserCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">I'm a Mentor</h3>
                        <p className="text-gray-600 text-sm">Ready to share knowledge and guide others</p>
                      </div>
                    </div>
                  </button>
                </div>
              )}
              {/* Login/Signup Form */}
              {!showRoleSelection && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {authMode === 'login' ? (
                    <>
                      {loginError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                          {loginError}
                        </div>
                      )}
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
                      <div className="text-right">
                        <button
                          type="button"
                          className="text-sm text-[#9414d1] hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div>
                        <button
                          type="submit"
                          disabled={loginLoading}
                          className="w-full bg-[#9414d1] hover:bg-[#450063] text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] mt-6 disabled:opacity-50"
                        >
                          {loginLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Common Fields */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-transparent transition-all duration-200"
                            placeholder="First name"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-transparent transition-all duration-200"
                            placeholder="Last name"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
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
                      <div>
                        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone_number"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-transparent transition-all duration-200"
                          placeholder="+1234567890"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-transparent transition-all duration-200"
                          placeholder="Enter your address"
                          required
                        />
                      </div>
                      {/* Student Specific Fields */}
                      {userRole === 'student' && (
                        <>
                          <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                              Age *
                            </label>
                            <input
                              type="number"
                              id="age"
                              name="age"
                              value={formData.age}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-transparent transition-all duration-200"
                              placeholder="Enter your age"
                              min="1"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                              Role
                            </label>
                            <input
                              type="text"
                              id="role"
                              name="role"
                              value={userRole === 'student' ? 'student' : ''}
                              readOnly
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                          </div>
                        </>
                      )}
                      {/* Mentor Specific Fields */}
                      {userRole === 'mentor' && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                              </label>
                              <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-transparent transition-all duration-200"
                                placeholder="Dr., Prof., Mr., Ms."
                                required
                              />
                            </div>
                            <div>
                              <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-2">
                                Profession *
                              </label>
                              <input
                                type="text"
                                id="profession"
                                name="profession"
                                value={formData.profession}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-transparent transition-all duration-200"
                                placeholder="Your profession"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                              Subject *
                            </label>
                            <input
                              type="text"
                              id="subject"
                              name="subject"
                              value={formData.subject}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-transparent transition-all duration-200"
                              placeholder="Subject you teach"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-2">
                              Qualification *
                            </label>
                            <input
                              type="text"
                              id="qualification"
                              name="qualification"
                              value={formData.qualification}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-transparent transition-all duration-200"
                              placeholder="Your highest qualification"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="session_fee" className="block text-sm font-medium text-gray-700 mb-2">
                              Session Fee (USD) *
                            </label>
                            <input
                              type="number"
                              id="session_fee"
                              name="session_fee"
                              value={formData.session_fee}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-transparent transition-all duration-200"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                              Role
                            </label>
                            <input
                              type="text"
                              id="role"
                              name="role"
                              value={userRole === 'mentor' ? 'mentor' : ''}
                              readOnly
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                              Bio *
                            </label>
                            <textarea
                              id="bio"
                              name="bio"
                              value={formData.bio}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-transparent transition-all duration-200"
                              placeholder="Tell us about yourself"
                              rows={4}
                              required
                            />
                          </div>

                        </>
                      )}
                      {/* Password Fields */}
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                          Password *
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-transparent transition-all duration-200"
                          placeholder="Create a password"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password *
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-transparent transition-all duration-200"
                          placeholder="Confirm your password"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#9414d1] hover:bg-[#450063] text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] mt-6"
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                  <p className="text-center text-sm text-gray-600 mt-4">
                    {authMode === 'login' ? (
                      <>
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('signup');
                            setShowRoleSelection(true);
                            setLoginError(''); // Clear login error when switching to signup
                          }}
                          className="text-[#9414d1] font-medium hover:underline"
                        >
                          Sign Up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('login');
                            setShowRoleSelection(false);
                            resetForm(); // Reset form when switching to login
                          }}
                          className="text-[#9414d1] font-medium hover:underline"
                        >
                          Login
                        </button>
                      </>
                    )}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default LandingPage;