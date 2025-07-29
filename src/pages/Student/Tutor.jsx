import React, { useState, useEffect } from 'react';
import { Calendar, Users, Star, Clock, ChevronRight, ChevronLeft, X, User, Briefcase, Award, DollarSign, BookOpen, AlertCircle, Loader } from 'lucide-react';

// ClassCard Component
const ClassCard = ({ classData, onSchedule }) => {
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
        classRoomId: classData.class_room_id, // Add this
        mentorId: classData.mentor.mentor_id, // Add this
        sessionDate: formattedDate, // Use properly formatted date
        sessionTime: selectedTime,
        sessionFee: classData.mentor.session_fee,
        topic: classData.title // Use class title as default topic
      });
    }
  }
};

  return (
    <>
      <div className="bg-white rounded-3xl border border-purple-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden max-w-md group hover:border-purple-200">
        {/* Gradient Header Bar */}
        <div className="h-2 bg-gradient-to-r from-[#280120] via-[#450063] to-[#9414d1]"></div>
        
        {/* Header with course name and mentor avatar */}
        <div className="p-8 pb-4">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#280120] leading-tight mb-3 group-hover:text-[#450063] transition-colors duration-300">
                {classData.title}
              </h2>
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
                  {classData.mentor.title} {classData.mentor.first_name} {classData.mentor.last_name}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#03b2ed] to-[#450063] rounded-full flex items-center justify-center shadow-md">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-base text-gray-700 font-medium">{classData.mentor.profession}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#9414d1] to-[#280120] rounded-full flex items-center justify-center shadow-md">
                <Award className="w-5 h-5 text-white" />
              </div>
              <span className="text-base text-gray-700 font-medium">{classData.mentor.qualification}</span>
            </div>
          </div>

          {/* Bio/Description */}
          <div className="mb-8">
            <p className="text-base text-gray-700 leading-relaxed bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-2xl border border-purple-100">
              Expert in {classData.mentor.subject} with extensive experience in teaching and mentoring students. 
              Specialized in delivering high-quality education with personalized attention to help students achieve their academic goals.
            </p>
          </div>
        </div>

        {/* Highlights section */}
        <div className="px-8 pb-8">
          <h3 className="text-xl font-bold text-[#280120] mb-6">Course Highlights</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#03b2ed] to-[#9414d1] rounded-xl flex items-center justify-center shadow-sm">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-semibold text-gray-800">Enrolled Students</span>
              </div>
              <span className="text-lg font-bold text-[#280120]">{classData.enrolled_student_count}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#fd59ca] to-[#9414d1] rounded-xl flex items-center justify-center shadow-sm">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-semibold text-gray-800">Session Fee</span>
              </div>
              <span className="text-lg font-bold text-[#280120]">LKR {classData.mentor.session_fee}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#9414d1] to-[#280120] rounded-xl flex items-center justify-center shadow-sm">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-semibold text-gray-800">Subject Focus</span>
              </div>
              <span className="text-lg font-bold text-[#280120]">{classData.mentor.subject}</span>
            </div>
          </div>

          {/* Schedule button */}
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="w-full bg-gradient-to-r from-[#280120] via-[#450063] to-[#9414d1] hover:from-[#9414d1] hover:via-[#450063] hover:to-[#280120] text-white font-bold py-5 px-8 rounded-2xl transition-all duration-500 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-offset-2 transform hover:scale-[1.02] group"
          >
            <div className="flex items-center justify-center space-x-3">
              <Calendar className="w-6 h-6 group-hover:rotate-6 transition-transform duration-300" />
              <span className="text-lg">Schedule a Session</span>
            </div>
          </button>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-purple-100">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#280120] via-[#450063] to-[#9414d1] p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Schedule Your Session</h2>
                  <p className="text-purple-100">with {classData.mentor.title} {classData.mentor.first_name} {classData.mentor.last_name}</p>
                </div>
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-full flex items-center justify-center transition-all duration-300 border border-white/30"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-10">
                {/* Date Picker */}
                <div>
                  <h3 className="text-xl font-bold text-[#280120] mb-6 flex items-center space-x-3">
                    <Calendar className="w-6 h-6 text-[#9414d1]" />
                    <span>Choose a Date</span>
                  </h3>
                  
                  {/* Calendar Navigation */}
                  <div className="flex items-center justify-between mb-6">
                    <button 
                      onClick={() => navigateMonth(-1)}
                      className="w-10 h-10 bg-gradient-to-br from-[#9414d1] to-[#280120] hover:from-[#280120] hover:to-[#9414d1] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <span className="font-bold text-[#280120] text-lg">{formatMonth(currentMonth)}</span>
                    <button 
                      onClick={() => navigateMonth(1)}
                      className="w-10 h-10 bg-gradient-to-br from-[#9414d1] to-[#280120] hover:from-[#280120] hover:to-[#9414d1] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2 mb-3">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="h-10 flex items-center justify-center text-sm font-bold text-[#280120]">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2">
                    {getDaysInMonth(currentMonth).map((day, index) => (
                      <button
                        key={index}
                        onClick={() => handleDateSelect(day)}
                        disabled={!day}
                        className={`h-12 flex items-center justify-center text-sm rounded-xl transition-all duration-300 font-semibold ${
                          day === selectedDate 
                            ? 'bg-gradient-to-br from-[#9414d1] to-[#280120] text-white shadow-lg transform scale-105' 
                            : day 
                              ? 'hover:bg-gradient-to-br hover:from-purple-100 hover:to-blue-100 text-[#280120] hover:shadow-md border border-purple-100' 
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
                  <h3 className="text-xl font-bold text-[#280120] mb-6 flex items-center space-x-3">
                    <Clock className="w-6 h-6 text-[#9414d1]" />
                    <span>Choose a Time</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-4 px-6 rounded-xl text-base font-bold transition-all duration-300 ${
                          selectedTime === time
                            ? 'bg-gradient-to-br from-[#9414d1] to-[#280120] text-white shadow-lg transform scale-105'
                            : 'bg-gradient-to-br from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 text-[#280120] border border-purple-200 hover:shadow-md'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-4 mt-10 pt-8 border-t border-purple-100">
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  className="px-8 py-3 text-gray-600 hover:text-[#280120] font-bold transition-colors duration-300 hover:bg-gray-50 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSchedule}
                  disabled={!selectedDate || !selectedTime}
                  className="px-8 py-3 bg-gradient-to-r from-[#fd59ca] to-[#03b2ed] hover:from-[#03b2ed] hover:to-[#fd59ca] disabled:from-gray-200 disabled:to-gray-300 disabled:text-gray-400 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-105 disabled:transform-none"
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

// Main Tutoe Page Component
const TutoePage = () => {
  const STUDENT_ID = 1;

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('title');

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
    // Create session payload
    const sessionPayload = {
      student_id: STUDENT_ID,
      class_room_id: sessionData.classRoomId,
      mentor_id: sessionData.mentorId,
      topic: sessionData.title || "General Session", // You might want to add topic input
      date: sessionData.sessionDate, // Need to format this properly
      start_time: sessionData.sessionTime + ":00" // Convert "10:00" to "10:00:00"
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
    
    // Show success message
    alert(`Session successfully scheduled! Session ID: ${createdSession.session_id}`);
    
  } catch (error) {
    console.error('Error creating session:', error);
    alert('Failed to schedule session. Please try again.');
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#280120] via-[#450063] to-[#9414d1] overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-[#fd59ca] to-[#03b2ed] bg-clip-text text-transparent">
                Learning Journey
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-12 leading-relaxed max-w-3xl mx-auto">
              Connect with expert mentors and unlock your potential through personalized education. 
              Join thousands of students who have already transformed their academic success.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-gradient-to-r from-[#fd59ca] to-[#03b2ed] hover:from-[#03b2ed] hover:to-[#fd59ca] text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105">
                Explore Classes
              </button>
              <button className="bg-white/10 backdrop-blur-lg border border-white/20 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:bg-white/20">
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
            <h2 className="text-4xl md:text-5xl font-bold text-[#280120] mb-6">
              Available Classes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our range of expert-led classes designed to help you excel in your studies
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
                    placeholder="Search classes, mentors, or subjects..."
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
                  <option value="title">Sort by Title</option>
                  <option value="mentor">Sort by Mentor</option>
                  <option value="fee">Sort by Fee</option>
                  <option value="students">Sort by Students</option>
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
              Showing {sortedClasses.length} of {classes.length} classes
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Loading classes...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-red-800 mb-4">Unable to Load Classes</h3>
                <p className="text-red-600 mb-6">
                  We encountered an error while fetching the classes: {error}
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
                  />
                </div>
              ))}
            </div>
          )}

          {/* No Classes State */}
          {!loading && !error && classes.length === 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Classes Available</h3>
                <p className="text-gray-600 mb-6">
                  There are currently no classes available. Please check back later or contact us for more information.
                </p>
                <button className="bg-gradient-to-r from-[#fd59ca] to-[#03b2ed] hover:from-[#03b2ed] hover:to-[#fd59ca] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300">
                  Contact Us
                </button>
              </div>
            </div>
          )}

          {/* No Search Results */}
          {!loading && !error && classes.length > 0 && sortedClasses.length === 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
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

export default TutoePage;