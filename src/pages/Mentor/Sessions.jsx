import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, BookOpen, User, Mail, Phone, MapPin, Sparkles, TrendingUp, Check, X, Link, ExternalLink, Plus } from 'lucide-react';

const MentorSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [sessionLinks, setSessionLinks] = useState({});
  const mentorId = 1; // Keep as 1 until we get from URL

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/v1/academic/mentor/${mentorId}/sessions`);
      if (!response.ok) throw new Error('Failed to fetch sessions');
      const data = await response.json();
      setSessions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSessionStatus = async (sessionId, status, sessionLink = '') => {
    try {
      setActionLoading(prev => ({ ...prev, [sessionId]: status }));
      
      let url = `http://localhost:8080/api/v1/academic/session/${sessionId}/status?status=${status}`;
      if (sessionLink) {
        url += `&sessionLink=${encodeURIComponent(sessionLink)}`;
      }
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error(`Failed to ${status} session`);
      
      const updatedSession = await response.json();
      
      // Update the session in the local state
      setSessions(prev => prev.map(session => 
        session.session_id === sessionId ? updatedSession : session
      ));
      
      // Clear the session link input for this session
      setSessionLinks(prev => ({ ...prev, [sessionId]: '' }));
      
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [sessionId]: null }));
    }
  };

  const handleAcceptWithLink = (sessionId) => {
    const link = sessionLinks[sessionId];
    if (!link || !link.trim()) {
      alert('Please enter a session link before accepting');
      return;
    }
    updateSessionStatus(sessionId, 'accept', link.trim());
  };

  const handleSessionLinkChange = (sessionId, value) => {
    setSessionLinks(prev => ({ ...prev, [sessionId]: value }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <Check className="w-4 h-4 mr-1" />
            Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <X className="w-4 h-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#9414d1] to-[#03b2ed] rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-medium text-slate-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-lg font-medium text-red-600">Error: {error}</p>
          <button 
            onClick={fetchSessions}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#280120] via-[#450063] to-[#9414d1]">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#03b2ed]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#fd59ca]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full px-6 py-3 mb-6">
              <Sparkles className="w-5 h-5 text-[#fd59ca]" />
              <span className="text-white font-semibold">My Sessions</span>
            </div>

            <h1 className="text-5xl font-black text-white mb-4 leading-tight">
              Session
              <span className="block bg-gradient-to-r from-[#03b2ed] via-[#fd59ca] to-[#03b2ed] bg-clip-text text-transparent">
                Management
              </span>
            </h1>
            
            <p className="text-lg text-white/80 font-medium max-w-2xl mx-auto">
              Manage and track all your mentoring sessions in one place
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#9414d1] to-[#03b2ed] rounded-xl flex items-center justify-center text-white mx-auto mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">{sessions.length}</h3>
            <p className="text-slate-600 font-medium">Total Sessions</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#03b2ed] to-[#fd59ca] rounded-xl flex items-center justify-center text-white mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">{new Set(sessions.map(s => s.student?.student_id)).size}</h3>
            <p className="text-slate-600 font-medium">Students</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#fd59ca] to-[#9414d1] rounded-xl flex items-center justify-center text-white mx-auto mb-3">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">{new Set(sessions.map(s => s.class_room?.class_room_id)).size}</h3>
            <p className="text-slate-600 font-medium">Classrooms</p>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Sessions Found</h3>
            <p className="text-slate-600">You don't have any sessions assigned yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {sessions.map((session) => (
              <div key={session.session_id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#9414d1] to-[#03b2ed] rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{session.topic}</h3>
                          <p className="text-sm text-[#9414d1] font-medium">Session #{session.session_id}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="flex items-center space-x-2 text-slate-600 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">{formatDate(session.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600 mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">{formatTime(session.start_time)}</span>
                      </div>
                      {getStatusBadge(session.status)}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-6">
                    {/* Classroom Info */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                        <div className="w-6 h-6 bg-[#03b2ed]/20 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-[#03b2ed]" />
                        </div>
                        <span>Classroom Details</span>
                      </h4>
                      <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                        <p className="font-medium text-slate-900">{session.class_room?.title}</p>
                        <div className="flex items-center space-x-2 text-slate-600">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">{session.class_room?.enrolled_student_count} enrolled students</span>
                        </div>
                        <p className="text-xs text-slate-500">Classroom ID: {session.class_room?.class_room_id}</p>
                      </div>
                    </div>

                    {/* Student Info */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                        <div className="w-6 h-6 bg-[#fd59ca]/20 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-[#fd59ca]" />
                        </div>
                        <span>Student Details</span>
                      </h4>
                      <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#fd59ca] to-[#9414d1] rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {session.student?.first_name} {session.student?.last_name}
                            </p>
                            <p className="text-sm text-slate-500">Age: {session.student?.age}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2 text-slate-600">
                            <Mail className="w-4 h-4" />
                            <span>{session.student?.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-600">
                            <Phone className="w-4 h-4" />
                            <span>{session.student?.phone_number}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-600">
                            <MapPin className="w-4 h-4" />
                            <span>{session.student?.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="border-t border-slate-200 pt-6">
                    {session.status === 'accepted' && session.session_link ? (
                    <div className="flex justify-center">
                      <a
                        href={session.session_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#9414d1] to-[#03b2ed] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#7a1099] hover:to-[#0299cc] transition-all duration-200 transform hover:scale-105"
                      >
                        <ExternalLink className="w-5 h-5" />
                        <span>Join Session</span>
                      </a>
                    </div>
                    ) : session.status === 'rejected' ? (
                      // Show rejected message
                      <div className="text-center">
                        <p className="text-red-600 font-medium">Session Rejected</p>
                      </div>
                    ) : (
                      // Show accept/reject options for pending sessions
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Link className="w-5 h-5 text-slate-600" />
                          <input
                            type="url"
                            placeholder="Enter session link (e.g., Zoom, Meet, etc.)"
                            value={sessionLinks[session.session_id] || ''}
                            onChange={(e) => handleSessionLinkChange(session.session_id, e.target.value)}
                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-transparent outline-none"
                          />
                        </div>
                        
                        <div className="flex justify-center space-x-4">
                          <button
                            onClick={() => handleAcceptWithLink(session.session_id)}
                            disabled={actionLoading[session.session_id] === 'accept'}
                            className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading[session.session_id] === 'accept' ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Check className="w-5 h-5" />
                            )}
                            <span>Accept Session</span>
                          </button>
                          
                          <button
                            onClick={() => updateSessionStatus(session.session_id, 'reject')}
                            disabled={actionLoading[session.session_id] === 'reject'}
                            className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading[session.session_id] === 'reject' ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <X className="w-5 h-5" />
                            )}
                            <span>Reject Session</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorSessions;