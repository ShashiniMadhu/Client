import React, { useState, useEffect } from 'react';
import { Calendar, Users, Star, Clock, ChevronRight, ChevronLeft, X, User, Briefcase, Award, DollarSign, BookOpen, AlertCircle, Loader, Mail, Phone, MapPin } from 'lucide-react';

// SessionCard Component
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

  return (
    <div className="bg-white rounded-3xl border border-purple-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden max-w-md group hover:border-purple-200">
      {/* Gradient Header Bar */}
      <div className="h-2 bg-gradient-to-r from-[#280120] via-[#450063] to-[#9414d1]"></div>
      
      {/* Header with session info and class icon */}
      <div className="p-8 pb-4">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#280120] leading-tight mb-3 group-hover:text-[#450063] transition-colors duration-300">
              {sessionData.class_room.title}
            </h2>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-semibold text-[#9414d1] bg-purple-50 px-3 py-1 rounded-full">
                Session #{sessionData.session_id}
              </span>
            </div>
          </div>
          <div className="w-18 h-18 bg-gradient-to-br from-[#9414d1] to-[#03b2ed] rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Mentor info */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#fd59ca] to-[#9414d1] rounded-full flex items-center justify-center shadow-md">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-[#280120]">
                {sessionData.mentor.title} {sessionData.mentor.first_name} {sessionData.mentor.last_name}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#03b2ed] to-[#450063] rounded-full flex items-center justify-center shadow-md">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-base text-gray-700 font-medium">{sessionData.mentor.profession}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#9414d1] to-[#280120] rounded-full flex items-center justify-center shadow-md">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-base text-gray-700 font-medium">{sessionData.mentor.email}</span>
          </div>
        </div>
      </div>

      {/* Session details section */}
      <div className="px-8 pb-8">
        <h3 className="text-xl font-bold text-[#280120] mb-6">Session Details</h3>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#03b2ed] to-[#9414d1] rounded-xl flex items-center justify-center shadow-sm">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-semibold text-gray-800">Session Date</span>
            </div>
            <span className="text-sm font-bold text-[#280120]">{formatDate(sessionData.date)}</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#fd59ca] to-[#9414d1] rounded-xl flex items-center justify-center shadow-sm">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-semibold text-gray-800">Session Time</span>
            </div>
            <span className="text-lg font-bold text-[#280120]">{formatTime(sessionData.start_time)}</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#9414d1] to-[#280120] rounded-xl flex items-center justify-center shadow-sm">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-semibold text-gray-800">Session Fee</span>
            </div>
            <span className="text-lg font-bold text-[#280120]">LKR {sessionData.mentor.session_fee}</span>
          </div>
        </div>

        {/* Session Status */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl border border-purple-200 hover:shadow-md transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-br from-[#450063] to-[#9414d1] rounded-xl flex items-center justify-center shadow-sm">
              <Star className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-semibold text-gray-800">Status</span>
          </div>
          <span className={`text-sm font-bold ${
            sessionData.status === 'completed' ? 'text-green-600' :
            sessionData.status === 'pending' ? 'text-yellow-600' :
            sessionData.status === 'cancelled' ? 'text-red-600' :
            'text-gray-600'
          } capitalize`}>
            {sessionData.status}
          </span>
        </div>

        {/* Action buttons */}
        <a 
          href={sessionData.session_link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full bg-gradient-to-r from-[#280120] via-[#450063] to-[#9414d1] hover:from-[#9414d1] hover:via-[#450063] hover:to-[#280120] text-white font-bold py-4 px-8 rounded-2xl transition-all duration-500 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-offset-2 transform hover:scale-[1.02] group text-center"
        >
          <div className="flex items-center justify-center space-x-3">
            <Calendar className="w-5 h-5 group-hover:rotate-6 transition-transform duration-300" />
            <span className="text-base">Join Session</span>
          </div>
        </a>
      </div>
    </div>
  );
};

// Main Sessions Page Component
const SessionsPage = () => {
  const STUDENT_ID = 1;

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('date');

  // Fetch sessions from API
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:8080/api/v1/academic/${STUDENT_ID}/sessions`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch sessions: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Handle both single object and array responses
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
  }, [STUDENT_ID]);

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
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#280120] via-[#450063] to-[#9414d1] overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              My Learning
              <span className="block bg-gradient-to-r from-[#fd59ca] to-[#03b2ed] bg-clip-text text-transparent">
                Sessions
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-12 leading-relaxed max-w-3xl mx-auto">
              Track your scheduled sessions, connect with your mentors, and manage your personalized learning journey. 
              Stay organized and never miss an important session.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-gradient-to-r from-[#fd59ca] to-[#03b2ed] hover:from-[#03b2ed] hover:to-[#fd59ca] text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105">
                Schedule New Session
              </button>
              <button className="bg-white/10 backdrop-blur-lg border border-white/20 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:bg-white/20">
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
            <h2 className="text-4xl md:text-5xl font-bold text-[#280120] mb-6">
              My Scheduled Sessions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage and track all your upcoming and past learning sessions with expert mentors
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search sessions, mentors, or topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Class</option>
                  <option value="mentor">Sort by Mentor</option>
                  <option value="topic">Sort by Topic</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-white shadow-sm text-purple-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'list' 
                        ? 'bg-white shadow-sm text-purple-600' 
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
                <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Loading your sessions...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-red-800 mb-4">Unable to Load Sessions</h3>
                <p className="text-red-600 mb-6">
                  We encountered an error while fetching your sessions: {error}
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-300"
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
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Sessions Scheduled</h3>
                <p className="text-gray-600 mb-6">
                  You haven't scheduled any sessions yet. Browse available classes and book your first session with an expert mentor.
                </p>
                <button className="bg-gradient-to-r from-[#fd59ca] to-[#03b2ed] hover:from-[#03b2ed] hover:to-[#fd59ca] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300">
                  Browse Classes
                </button>
              </div>
            </div>
          )}

          {/* No Search Results */}
          {!loading && !error && sessions.length > 0 && sortedSessions.length === 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
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
                  className="bg-gradient-to-r from-[#280120] to-[#9414d1] hover:from-[#9414d1] hover:to-[#280120] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
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