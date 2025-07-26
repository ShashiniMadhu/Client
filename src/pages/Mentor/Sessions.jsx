import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Check, 
  X, 
  MessageCircle, 
  Video, 
  Bell,
  Filter,
  Search,
  ChevronDown,
  Star,
  MapPin,
  Phone,
  Mail,
  BookOpen,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const MentorSessionDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);

  // Mock data for session requests and scheduled sessions
  const sessionRequests = [
    {
      id: 1,
      studentName: "Sarah Johnson",
      studentAvatar: null,
      courseName: "AWS Developer Associate Exam Prep",
      requestedDate: "2025-08-05",
      requestedTime: "14:00",
      status: "pending",
      studentEmail: "sarah.johnson@email.com",
      studentLevel: "Beginner",
      message: "Hi! I'm really excited to learn AWS and prepare for the certification. I have some basic programming experience but new to cloud technologies.",
      requestedAt: "2025-07-27T10:30:00Z",
      sessionDuration: "60 min"
    },
    {
      id: 2,
      studentName: "Michael Chen",
      studentAvatar: null,
      courseName: "AWS Developer Associate Exam Prep",
      requestedDate: "2025-08-06",
      requestedTime: "10:00",
      status: "pending",
      studentEmail: "michael.chen@email.com",
      studentLevel: "Intermediate",
      message: "Looking forward to diving deep into AWS services and best practices for the certification exam.",
      requestedAt: "2025-07-27T09:15:00Z",
      sessionDuration: "90 min"
    },
    {
      id: 3,
      studentName: "Emily Rodriguez",
      studentAvatar: null,
      courseName: "AWS Developer Associate Exam Prep",
      requestedDate: "2025-08-07",
      requestedTime: "16:00",
      status: "pending",
      studentEmail: "emily.rodriguez@email.com",
      studentLevel: "Advanced",
      message: "I've been working with AWS for a year but want to formalize my knowledge with certification.",
      requestedAt: "2025-07-27T11:45:00Z",
      sessionDuration: "60 min"
    }
  ];

  const scheduledSessions = [
    {
      id: 4,
      studentName: "David Kim",
      studentAvatar: null,
      courseName: "AWS Developer Associate Exam Prep",
      sessionDate: "2025-07-28",
      sessionTime: "15:00",
      status: "confirmed",
      studentEmail: "david.kim@email.com",
      studentLevel: "Intermediate",
      sessionDuration: "60 min",
      meetingLink: "https://zoom.us/j/123456789",
      confirmedAt: "2025-07-26T14:20:00Z"
    },
    {
      id: 5,
      studentName: "Lisa Wang",
      studentAvatar: null,
      courseName: "AWS Developer Associate Exam Prep",
      sessionDate: "2025-07-30",
      sessionTime: "11:00",
      status: "confirmed",
      studentEmail: "lisa.wang@email.com",
      studentLevel: "Beginner",
      sessionDuration: "90 min",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      confirmedAt: "2025-07-25T16:30:00Z"
    },
    {
      id: 6,
      studentName: "Alex Thompson",
      studentAvatar: null,
      courseName: "AWS Developer Associate Exam Prep",
      sessionDate: "2025-08-01",
      sessionTime: "13:00",
      status: "completed",
      studentEmail: "alex.thompson@email.com",
      studentLevel: "Advanced",
      sessionDuration: "60 min",
      completedAt: "2025-07-24T13:00:00Z",
      rating: 5,
      feedback: "Excellent session! Very thorough explanation of Lambda functions and API Gateway."
    }
  ];

  const handleAcceptRequest = (requestId) => {
    console.log('Accepting request:', requestId);
    // Here you would make an API call to accept the session request
  };

  const handleRejectRequest = (requestId) => {
    console.log('Rejecting request:', requestId);
    // Here you would make an API call to reject the session request
  };

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
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const SessionRequestCard = ({ request }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{request.studentName}</h3>
            <p className="text-sm text-slate-600">{request.studentEmail}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-sm font-medium ${getStatusColor(request.status)}`}>
          {getStatusIcon(request.status)}
          <span className="capitalize">{request.status}</span>
        </div>
      </div>

      {/* Course Info */}
      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <BookOpen className="w-5 h-5 text-slate-600" />
          <span className="font-semibold text-slate-900">{request.courseName}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-slate-700">{formatDate(request.requestedDate)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-slate-700">{formatTime(request.requestedTime)} ({request.sessionDuration})</span>
          </div>
        </div>
      </div>

      {/* Student Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">Experience Level</span>
          <span className="text-sm font-semibold text-slate-900">{request.studentLevel}</span>
        </div>
        {request.message && (
          <div>
            <span className="text-sm font-medium text-slate-600 block mb-2">Message from Student</span>
            <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3 leading-relaxed">
              "{request.message}"
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => handleAcceptRequest(request.id)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <Check className="w-4 h-4" />
          <span>Accept</span>
        </button>
        <button
          onClick={() => handleRejectRequest(request.id)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Reject</span>
        </button>
        <button className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
          <MessageCircle className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    </div>
  );

  const ScheduledSessionCard = ({ session }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{session.studentName}</h3>
            <p className="text-sm text-slate-600">{session.studentEmail}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-sm font-medium ${getStatusColor(session.status)}`}>
          {getStatusIcon(session.status)}
          <span className="capitalize">{session.status}</span>
        </div>
      </div>

      {/* Session Info */}
      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <BookOpen className="w-5 h-5 text-slate-600" />
          <span className="font-semibold text-slate-900">{session.courseName}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-slate-700">{formatDate(session.sessionDate)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-slate-700">{formatTime(session.sessionTime)} ({session.sessionDuration})</span>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">Experience Level</span>
          <span className="text-sm font-semibold text-slate-900">{session.studentLevel}</span>
        </div>
        
        {session.meetingLink && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">Meeting Link</span>
            <a 
              href={session.meetingLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
            >
              <Video className="w-4 h-4" />
              <span>Join Call</span>
            </a>
          </div>
        )}

        {session.rating && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">Rating</span>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < session.rating ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                />
              ))}
            </div>
          </div>
        )}

        {session.feedback && (
          <div>
            <span className="text-sm font-medium text-slate-600 block mb-2">Student Feedback</span>
            <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3 leading-relaxed">
              "{session.feedback}"
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        {session.status === 'confirmed' && (
          <>
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2">
              <Video className="w-4 h-4" />
              <span>Start Session</span>
            </button>
            <button className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
              <MessageCircle className="w-5 h-5 text-slate-600" />
            </button>
          </>
        )}
        
        {session.status === 'completed' && (
          <div className="w-full text-center py-3 px-4 bg-slate-50 rounded-xl">
            <span className="text-sm text-slate-600 font-medium">Session Completed</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs and Controls */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
          {/* Tabs */}
          <div className="flex bg-white rounded-2xl p-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'pending'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending Requests ({sessionRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'scheduled'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Scheduled Sessions ({scheduledSessions.length})
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl pl-12 pr-6 py-3 w-80 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center space-x-2 bg-white border-2 border-gray-200 hover:border-purple-500 px-6 py-3 rounded-xl transition-all duration-300"
              >
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Filter</span>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${filterOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-6">
          {activeTab === 'pending' && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {sessionRequests.map((request) => (
                <SessionRequestCard key={request.id} request={request} />
              ))}
            </div>
          )}

          {activeTab === 'scheduled' && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {scheduledSessions.map((session) => (
                <ScheduledSessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {((activeTab === 'pending' && sessionRequests.length === 0) || 
          (activeTab === 'scheduled' && scheduledSessions.length === 0)) && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {activeTab === 'pending' ? 'No pending requests' : 'No scheduled sessions'}
            </h3>
            <p className="text-gray-600">
              {activeTab === 'pending' 
                ? 'New session requests will appear here' 
                : 'Your upcoming sessions will be displayed here'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorSessionDashboard;