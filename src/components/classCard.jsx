import React, { useState } from 'react';
import { Calendar, Users, Star, Clock, ChevronRight, ChevronLeft, X, User, Briefcase, Award, DollarSign, BookOpen } from 'lucide-react';
// Navigation would be handled by parent component

const ClassCard = ({ classData, onSchedule }) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = null; // Placeholder for navigation

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
      // Call parent callback with session data
      if (onSchedule) {
        onSchedule({
          mentorName: `${classData.mentor.first_name} ${classData.mentor.last_name}`,
          sessionDate: `${currentMonth.getMonth() + 1}/${selectedDate}/${currentMonth.getFullYear()}`,
          sessionTime: selectedTime,
          sessionFee: classData.mentor.session_fee
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

export default ClassCard;