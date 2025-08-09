import React, { useState, useEffect } from 'react';
import { BookOpen, AlertCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../../hooks/useUserData';
import WarningNotification from '../Student/Notification';
import hero from '../../assets/hero.jpeg'; 
import MentorProfileModal from '../../components/MentorDetails';
import ClassCard from './ClassCard';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

const TutoePage = () => {
  const { userData, userRole, loading: userLoading, error: userError } = useUserData();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('title');
  
  // New state for mentor profile modal
  const [showMentorProfile, setShowMentorProfile] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState(null);

  // Fetch classes from API
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/api/v1/academic/classroom`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch classes: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Handle both single object and array responses
        const classesArray = Array.isArray(data) ? data : [data];
        setClasses(classesArray);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching classes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Handler for mentor profile modal
  const handleMentorProfileClick = (mentorId) => {
    setSelectedMentorId(mentorId);
    setShowMentorProfile(true);
  };

  const closeMentorProfile = () => {
    setShowMentorProfile(false);
    setSelectedMentorId(null);
  };

  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Show warning when component mounts (when user enters student portal)
    setShowWarning(true);
  }, []);

  const handleWarningClose = () => {
    setShowWarning(false);
  };

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
              Classes page is only available for students. Your current role is: {userRole}
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
  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.mentor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.mentor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.mentor.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === '' || classItem.mentor.subject === selectedSubject;
    
    return matchesSearch && matchesSubject;
  });

  // Sort logic
  const sortedClasses = [...filteredClasses].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'mentor':
        return `${a.mentor.first_name} ${a.mentor.last_name}`.localeCompare(`${b.mentor.first_name} ${b.mentor.last_name}`);
      case 'fee':
        return a.mentor.session_fee - b.mentor.session_fee;
      case 'students':
        return b.enrolled_student_count - a.enrolled_student_count;
      default:
        return 0;
    }
  });

  // Get unique subjects for filter
  const subjects = [...new Set(classes.map(c => c.mentor.subject))];

  const handleSchedule = async (sessionData) => {
    try {
      const sessionPayload = {
        student_id: userData.student_id,
        class_room_id: sessionData.classRoomId,
        mentor_id: sessionData.mentorId,
        topic: sessionData.topic || "General Session",
        date: sessionData.sessionDate,
        start_time: sessionData.sessionTime + ":00",
        status: "pending"
      };

      // Make API call to create session
      const response = await fetch(`${API_BASE_URL}/api/v1/academic/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionPayload)
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const createdSession = await response.json();
      console.log('Session created:', createdSession);
      
      // Redirect to checkout page with session data
      navigate('/student/checkout', {
        state: {
          sessionId: createdSession.session_id,
          mentorName: sessionData.mentorName,
          sessionDate: sessionData.sessionDate,
          sessionTime: sessionData.sessionTime,
          sessionFee: sessionData.sessionFee,
          topic: sessionData.topic
        }
      });
      
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to schedule session. Please try again.');
    }
  };

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
              <span className="inline-block animate-slide-in-left">Transform Your</span>
              <span className="block bg-gradient-to-r from-[#03b2ed] via-[#fd59ca] to-[#03b2ed] bg-clip-text text-transparent animate-slide-in-right animation-delay-300">
                Learning Journey
              </span>
            </h1>
            <p className="text-xl text-white/90 font-medium max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up animation-delay-600">
              Welcome back, {userData.first_name}! Connect with expert mentors and unlock your potential through personalized education. 
              Join thousands of students who have already transformed their academic success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-900">
              <button className="bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] hover:from-[#fd59ca] hover:to-[#03b2ed] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                Explore Classes
              </button>
              <button className="bg-white/20 backdrop-blur-lg border border-white/30 hover:bg-white/30 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Classes Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#450063] mb-6">
              Available Classes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our range of expert-led classes designed to help you excel in your studies
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
                    placeholder="Search classes, mentors, or subjects..."
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
                  <option value="title">Sort by Title</option>
                  <option value="mentor">Sort by Mentor</option>
                  <option value="fee">Sort by Fee</option>
                  <option value="students">Sort by Students</option>
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
              Showing {sortedClasses.length} of {classes.length} classes
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader className="w-12 h-12 text-[#450063] animate-spin mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Loading classes...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-red-800 mb-4">Unable to Load Classes</h3>
                <p className="text-red-600 mb-6">
                  We encountered an error while fetching the classes: {error}
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

          {/* Classes Grid/List */}
          {!loading && !error && sortedClasses.length > 0 && (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center' 
                : 'space-y-6'
            }`}>
              {sortedClasses.map((classData) => (
                <div key={classData.class_room_id} className={viewMode === 'list' ? 'max-w-none' : ''}>
                  <ClassCard
                    classData={classData}
                    onSchedule={handleSchedule}
                    onMentorProfileClick={handleMentorProfileClick}
                  />
                </div>
              ))}
            </div>
          )}

          {/* No Classes State */}
          {!loading && !error && classes.length === 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Classes Available</h3>
                <p className="text-gray-600 mb-6">
                  There are currently no classes available. Please check back later or contact us for more information.
                </p>
                <button className="bg-[#450063] hover:bg-[#350051] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                  Contact Us
                </button>
              </div>
            </div>
          )}

          {/* No Search Results */}
          {!loading && !error && classes.length > 0 && sortedClasses.length === 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Classes Found</h3>
                <p className="text-gray-600 mb-6">
                  No classes match your current search criteria. Try adjusting your filters or search terms.
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

      {/* Warning Notification */}
      {showWarning && (
        <WarningNotification
          message="Update your profile with valid credentials before proceeding to schedule sessions."
          duration={15000}
          onClose={handleWarningClose}
        />
      )}

      {/* Mentor Profile Modal */}
      <MentorProfileModal
        mentorId={selectedMentorId}
        isOpen={showMentorProfile}
        onClose={closeMentorProfile}
      />
    </div>
  );
};

export default TutoePage;