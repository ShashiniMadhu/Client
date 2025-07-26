import React, { useState } from 'react';
import { Calendar, Users, Star, Clock, ChevronRight, ChevronLeft, X, User, Briefcase, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClassCard = ({ classData }) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();

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
      // Pass session data to checkout page
      navigate('/student/checkout', {
        state: {
          mentorName: classData.mentorName,
          sessionDate: `${currentMonth.getMonth() + 1}/${selectedDate}/${currentMonth.getFullYear()}`,
          sessionTime: selectedTime
        }
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden max-w-md">
        {/* Header with course name and logo */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-900 leading-tight mb-2">
                {classData.courseName}
              </h2>
            </div>
            {classData.logo && (
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <img src={classData.logo} alt="Course logo" className="w-12 h-12 rounded-lg" />
              </div>
            )}
          </div>

          {/* Positive reviews */}
          <div className="flex items-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center">
                <span className="text-xs">👍</span>
              </div>
              <span className="text-sm font-medium text-slate-700">{classData.positiveReviews}% positive reviews</span>
            </div>
          </div>

          {/* Mentor info */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-600" />
              </div>
              <span className="text-sm font-semibold text-slate-900">{classData.mentorName}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-slate-600" />
              </div>
              <span className="text-sm text-slate-600">{classData.mentorPosition}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                <Calendar className="w-4 h-4 text-slate-600" />
              </div>
              <span className="text-sm text-slate-600">{classData.mentorExperience}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              {classData.description}
              {classData.description.length > 150 && (
                <button className="text-orange-500 text-sm font-medium ml-1 hover:text-orange-600">
                  See more
                </button>
              )}
            </p>
          </div>
        </div>

        {/* Highlights section */}
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Highlights</h3>
          
          <div className="space-y-3 mb-6">
            {classData.highlights.map((highlight, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                    {highlight.icon}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{highlight.text}</span>
                </div>
                {highlight.value && (
                  <span className="text-sm font-semibold text-slate-900">{highlight.value}</span>
                )}
              </div>
            ))}
          </div>

          {/* Schedule button */}
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Schedule a session
          </button>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Schedule this session</h2>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Date Picker */}
                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Choose a date</h3>
                  
                  {/* Calendar Navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => navigateMonth(-1)}
                      className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <span className="font-medium text-slate-900">{formatMonth(currentMonth)}</span>
                    <button 
                      onClick={() => navigateMonth(1)}
                      className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-slate-500">
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
                        className={`h-10 flex items-center justify-center text-sm rounded-lg transition-colors ${
                          day === selectedDate 
                            ? 'bg-slate-900 text-white' 
                            : day 
                              ? 'hover:bg-slate-100 text-slate-700' 
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
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Choose a time</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                          selectedTime === time
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-slate-200">
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  className="px-6 py-2.5 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSchedule}
                  disabled={!selectedDate || !selectedTime}
                  className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 disabled:bg-slate-200 disabled:text-slate-400 text-slate-900 font-medium rounded-lg transition-all"
                >
                  Save
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