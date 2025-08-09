import React, { useState } from 'react';
import { Calendar, Users, Star, Clock, ChevronRight, ChevronLeft, X, User, Briefcase, Award, DollarSign, BookOpen } from 'lucide-react';

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

export default ClassCard;