import React, { useState, useEffect } from 'react';
import { Calendar, Users, Star, Clock, ChevronRight, ChevronLeft, X, User, Briefcase, Award, DollarSign, BookOpen, AlertCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../../hooks/useUserData';
import logo from '../../assets/logo.png';
import hero from '../../assets/hero.jpeg'; 
import MentorProfileModal from '../../components/MentorDetails';

// Professional ClassCard Component
const ClassCard = ({ classData, onSchedule, onMentorProfileClick }) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00'
  ];

  // Calendar logic
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleDateSelect = (day) => {
    if (day) {
      setSelectedDate(day);
    }
  };

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      setShowScheduleModal(false);
      setSelectedDate(null);
      setSelectedTime(null);
      
      // Format date properly (YYYY-MM-DD format)
      const formattedDate = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
      
      if (onSchedule) {
        onSchedule({
          mentorName: `${classData.mentor.first_name} ${classData.mentor.last_name}`,
          classRoomId: classData.class_room_id,
          mentorId: classData.mentor.mentor_id,
          sessionDate: formattedDate,
          sessionTime: selectedTime,
          sessionFee: classData.mentor.session_fee,
          topic: classData.title
        });
      }
    }
  };

  // Status indicator based on enrolled students
  const getStatusColor = () => {
    const count = classData.enrolled_student_count;
    if (count >= 20) return 'bg-red-100 text-red-700 border-red-200';
    if (count >= 10) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  const getStatusText = () => {
    const count = classData.enrolled_student_count;
    if (count >= 20) return 'High Demand';
    if (count >= 10) return 'Popular';
    return 'Available';
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden max-w-md group">
        {/* Status Bar */}
        <div className="h-1 bg-[#450063]"></div>
        
        {/* Header */}
        <div className="p-6">
          {/* Status Badge and Course Icon */}
          <div className="flex items-start justify-between mb-4">
            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
              {getStatusText()}
            </div>
            <div className="w-12 h-12 bg-[#450063] rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Course Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
            {classData.title}
          </h2>

          {/* Mentor Information */}
          <div className="space-y-3 mb-6">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            onClick={() => onMentorProfileClick(classData.mentor.mentor_id)}
          >
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-[#450063]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {classData.mentor.title} {classData.mentor.first_name} {classData.mentor.last_name}
              </p>
              <p className="text-xs text-gray-500">Click to view profile</p>
            </div>
          </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-[#450063]" />
              </div>
              <p className="text-sm text-gray-600">{classData.mentor.profession}</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-[#450063]" />
              </div>
              <p className="text-sm text-gray-600">{classData.mentor.qualification}</p>
            </div>
          </div>

          {/* Course Description */}
          <div className="mb-6">
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border">
              Expert instruction in {classData.mentor.subject} with personalized attention and proven teaching methodologies. 
              Join other students in achieving academic excellence.
            </p>
          </div>

          {/* Course Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-[#450063]" />
                <span className="text-xs font-medium text-gray-600">Students</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{classData.enrolled_student_count}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-4 h-4 text-[#450063]" />
                <span className="text-xs font-medium text-gray-600">Session Fee</span>
              </div>
              <p className="text-lg font-bold text-gray-900">LKR {classData.mentor.session_fee}</p>
            </div>
          </div>

          {/* Subject Tag */}
          <div className="mb-6">
            <div className="inline-flex items-center space-x-2 bg-[#450063] bg-opacity-10 text-[#450063] px-3 py-2 rounded-lg">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">{classData.mentor.subject}</span>
            </div>
          </div>

          {/* Schedule Button */}
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="w-full bg-[#450063] hover:bg-[#350051] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#450063] focus:ring-offset-2"
          >
            <div className="flex items-center justify-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Schedule Session</span>
            </div>
          </button>
        </div>
      </div>

      {/* Schedule Modal - Professional Styling */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#450063] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Schedule Your Session</h2>
                  <p className="text-purple-100 text-sm">with {classData.mentor.title} {classData.mentor.first_name} {classData.mentor.last_name}</p>
                </div>
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Date Picker */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-[#450063]" />
                    <span>Select Date</span>
                  </h3>
                  
                  {/* Calendar Navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => navigateMonth(-1)}
                      className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="font-medium text-gray-900">{formatMonth(currentMonth)}</span>
                    <button 
                      onClick={() => navigateMonth(1)}
                      className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-600">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {getDaysInMonth(currentMonth).map((day, index) => (
                      <button
                        key={index}
                        onClick={() => handleDateSelect(day)}
                        disabled={!day}
                        className={`h-8 flex items-center justify-center text-sm rounded transition-colors ${
                          day === selectedDate 
                            ? 'bg-[#450063] text-white' 
                            : day 
                              ? 'hover:bg-gray-100 text-gray-700' 
                              : ''
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Picker */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-[#450063]" />
                    <span>Select Time</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors border ${
                          selectedTime === time
                            ? 'bg-[#450063] text-white border-[#450063]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#450063] hover:text-[#450063]'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSchedule}
                  disabled={!selectedDate || !selectedTime}
                  className="px-6 py-2 bg-[#450063] hover:bg-[#350051] disabled:bg-gray-300 disabled:text-gray-500 text-white font-medium rounded-lg transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

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
        
        const response = await fetch('http://localhost:8080/api/v1/academic/classroom');
        
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
      const response = await fetch('http://localhost:8080/api/v1/academic/session', {
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