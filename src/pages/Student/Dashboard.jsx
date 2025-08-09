import React, { useState, useEffect } from 'react';
import { Calendar, Users, Star, Clock, ChevronRight, ChevronLeft, X, User, Briefcase, Award, DollarSign, BookOpen, AlertCircle, Loader, Mail, Phone, MapPin } from 'lucide-react';
import { useUserData } from '../../hooks/useUserData';
import hero from '../../assets/hero.jpeg'; // Import hero image

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

// Enhanced SessionCard Component with improved styling
const SessionCard = ({ sessionData }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusColor = () => {
    switch(sessionData.status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = () => {
    return sessionData.status.charAt(0).toUpperCase() + sessionData.status.slice(1);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden max-w-md group">
      {/* Status Bar */}
      <div className="h-1 bg-[#450063]"></div>
      
      {/* Header */}
      <div className="p-6">
        {/* Status Badge and Session Icon */}
        <div className="flex items-start justify-between mb-4">
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          <div className="w-12 h-12 bg-[#450063] rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Session Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
          {sessionData.class_room.title}
        </h2>

        {/* Mentor Information */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-[#450063]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {sessionData.mentor.title} {sessionData.mentor.first_name} {sessionData.mentor.last_name}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-[#450063]" />
            </div>
            <p className="text-sm text-gray-600">{sessionData.mentor.profession}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-[#450063]" />
            </div>
            <p className="text-sm text-gray-600">{sessionData.mentor.email}</p>
          </div>
        </div>

        {/* Session Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-[#450063]" />
              <span className="text-xs font-medium text-gray-600">Date</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{formatDate(sessionData.date)}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-[#450063]" />
              <span className="text-xs font-medium text-gray-600">Time</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{formatTime(sessionData.start_time)}</p>
          </div>
        </div>

        {/* Session Fee */}
        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-4 h-4 text-[#450063]" />
              <span className="text-xs font-medium text-gray-600">Session Fee</span>
            </div>
            <p className="text-lg font-bold text-gray-900">LKR {sessionData.mentor.session_fee}</p>
          </div>
        </div>

        {/* Subject Tag */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 bg-[#450063] bg-opacity-10 text-[#450063] px-3 py-2 rounded-lg">
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">{sessionData.mentor.subject}</span>
          </div>
        </div>

        {/* Join Session Button */}
        <a 
          href={sessionData.session_link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full bg-[#450063] hover:bg-[#350051] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#450063] focus:ring-offset-2 text-center"
        >
          <div className="flex items-center justify-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Join Session</span>
          </div>
        </a>
      </div>
    </div>
  );
};

// Main Sessions Page Component
const SessionsPage = () => {
  const { userData, userRole, loading: userLoading, error: userError } = useUserData();
  
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');

  // Fetch sessions from API
  useEffect(() => {
    const fetchSessions = async () => {
      if (userLoading) return;
      
      if (userError) {
        setError(`Authentication error: ${userError}`);
        setLoading(false);
        return;
      }
      
      if (!userData || userRole !== 'student') {
        setError('Only students can view sessions');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const studentId = userData.student_id;
        
        console.log('Fetching sessions for student ID:', studentId);
        
        const response = await fetch(`${API_BASE_URL}/api/v1/academic/${studentId}/sessions`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch sessions: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        const sessionsArray = Array.isArray(data) ? data : [data];
        setSessions(sessionsArray);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [userData, userRole, userLoading, userError]);

  // Show loading state while user data is being fetched
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#450063] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Show error if user authentication failed
  if (userError || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-red-800 mb-4">Authentication Error</h3>
            <p className="text-red-600 mb-6">
              {userError || 'Unable to load user data. Please try logging in again.'}
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show error if user is not a student
  if (userRole !== 'student') {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-yellow-800 mb-4">Access Restricted</h3>
            <p className="text-yellow-600 mb-6">
              Sessions page is only available for students. Your current role is: {userRole}
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter and search logic
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.class_room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.mentor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.mentor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.mentor.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.topic.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === '' || session.mentor.subject === selectedSubject;
    
    return matchesSearch && matchesSubject;
  });

  // Sort logic
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date) - new Date(b.date);
      case 'title':
        return a.class_room.title.localeCompare(b.class_room.title);
      case 'mentor':
        return `${a.mentor.first_name} ${a.mentor.last_name}`.localeCompare(`${b.mentor.first_name} ${b.mentor.last_name}`);
      case 'topic':
        return a.topic.localeCompare(b.topic);
      default:
        return 0;
    }
  });

  // Get unique subjects for filter
  const subjects = [...new Set(sessions.map(s => s.mentor.subject))];

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animation-delay-900 {
          animation-delay: 0.9s;
        }
      `}</style>

      {/* Hero Section with Background Image and Animations */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#280120] via-[#450063] to-[#9414d1]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src={hero} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#03b2ed]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#fd59ca]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-6xl font-black text-white mb-6 leading-tight animate-fade-in-up">
              <span className="inline-block animate-slide-in-left">My Learning</span>
              <span className="block bg-gradient-to-r from-[#03b2ed] via-[#fd59ca] to-[#03b2ed] bg-clip-text text-transparent animate-slide-in-right animation-delay-300">
                Sessions
              </span>
            </h1>
            <p className="text-xl text-white/90 font-medium max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up animation-delay-600">
              Welcome back, {userData.first_name}! Track your scheduled sessions, connect with your mentors, and manage your personalized learning journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-900">
              <button className="bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] hover:from-[#fd59ca] hover:to-[#03b2ed] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                Schedule New Session
              </button>
              <button className="bg-white/20 backdrop-blur-lg border border-white/30 hover:bg-white/30 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300">
                View Calendar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#450063] mb-6">
              My Scheduled Sessions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage and track all your upcoming and past learning sessions with expert mentors
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search sessions, mentors, or topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#450063] focus:border-transparent"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-4 items-center">
                {/* Subject Filter */}
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#450063] focus:border-transparent"
                >
                  <option value="">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#450063] focus:border-transparent"
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Class</option>
                  <option value="mentor">Sort by Mentor</option>
                  <option value="topic">Sort by Topic</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-white shadow-sm text-[#450063]' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-300 ${
                      viewMode === 'list' 
                        ? 'bg-white shadow-sm text-[#450063]' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Results Counter */}
            <div className="mt-4 text-sm text-gray-500">
              Showing {sortedSessions.length} of {sessions.length} sessions
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader className="w-12 h-12 text-[#450063] animate-spin mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Loading your sessions...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-red-800 mb-4">Unable to Load Sessions</h3>
                <p className="text-red-600 mb-6">
                  We encountered an error while fetching your sessions: {error}
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Sessions Grid/List */}
          {!loading && !error && sortedSessions.length > 0 && (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center' 
                : 'space-y-6'
            }`}>
              {sortedSessions.map((sessionData) => (
                <div key={sessionData.session_id} className={viewMode === 'list' ? 'max-w-none' : ''}>
                  <SessionCard sessionData={sessionData} />
                </div>
              ))}
            </div>
          )}

          {/* No Sessions State */}
          {!loading && !error && sessions.length === 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Sessions Scheduled</h3>
                <p className="text-gray-600 mb-6">
                  You haven't scheduled any sessions yet. Browse available classes and book your first session with an expert mentor.
                </p>
                <button className="bg-[#450063] hover:bg-[#350051] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                  Browse Classes
                </button>
              </div>
            </div>
          )}

          {/* No Search Results */}
          {!loading && !error && sessions.length > 0 && sortedSessions.length === 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Sessions Found</h3>
                <p className="text-gray-600 mb-6">
                  No sessions match your current search criteria. Try adjusting your filters or search terms.
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSubject('');
                  }}
                  className="bg-[#450063] hover:bg-[#350051] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionsPage;