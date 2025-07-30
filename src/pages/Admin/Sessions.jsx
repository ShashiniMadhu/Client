import React, { useState, useEffect } from 'react';
import { Calendar, Search, Clock, User, GraduationCap, BookOpen, Eye, Edit, Trash2, Plus, ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AllSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/academic/session');
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      session.mentor?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.mentor?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.student?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.student?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.class_room?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.topic?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9414d1]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#280120] via-[#450063] to-[#9414d1] rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#03b2ed] to-[#fd59ca] rounded-2xl flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">All Sessions</h1>
                <p className="text-white/80">Manage and view all mentoring sessions</p>
              </div>
            </div>
            
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search sessions by mentor, student, classroom, or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9414d1] focus:border-transparent outline-none transition-all duration-300"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9414d1] focus:border-transparent outline-none transition-all duration-300"
            >
              <option value="all">All Status</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSessions.map((session) => (
            <div key={session.session_id} className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Session #{session.session_id}
                    </h3>
                    <p className="text-white/80 text-sm">{session.topic || 'General Session'}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(session.status)} bg-white/90`}>
                    {getStatusIcon(session.status)}
                    <span className="capitalize">{session.status || 'Pending'}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {/* Classroom */}
                  <div className="flex items-center space-x-3 text-slate-600">
                    <BookOpen className="w-4 h-4 text-[#9414d1]" />
                    <div>
                      <span className="text-sm font-semibold">{session.class_room?.title}</span>
                      <p className="text-xs text-slate-400">
                        {session.class_room?.enrolled_student_count} students enrolled
                      </p>
                    </div>
                  </div>
                  
                  {/* Mentor */}
                  <div className="flex items-center space-x-3 text-slate-600">
                    <User className="w-4 h-4 text-[#03b2ed]" />
                    <div>
                      <span className="text-sm font-semibold">
                        {session.mentor?.title} {session.mentor?.first_name} {session.mentor?.last_name}
                      </span>
                      <p className="text-xs text-slate-400">{session.mentor?.subject}</p>
                    </div>
                  </div>
                  
                  {/* Student */}
                  <div className="flex items-center space-x-3 text-slate-600">
                    <GraduationCap className="w-4 h-4 text-[#fd59ca]" />
                    <div>
                      <span className="text-sm font-semibold">
                        {session.student?.first_name} {session.student?.last_name}
                      </span>
                      <p className="text-xs text-slate-400">{session.student?.email}</p>
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Date:
                      </span>
                      <span className="font-semibold text-slate-700">{session.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Time:
                      </span>
                      <span className="font-semibold text-slate-700">{session.start_time}</span>
                    </div>
                  </div>

                  {/* Session Link */}
                  {session.session_link && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600">Session Link:</span>
                        <a
                          href={session.session_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#03b2ed] hover:text-[#fd59ca] transition-colors flex items-center space-x-1 text-sm"
                        >
                          <span>Join</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 mt-6">
                  <button 
                    onClick={() => setSelectedSession(session)}
                    className="flex-1 bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] text-white py-2 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-24 h-24 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-500 mb-2">No sessions found</h3>
            <p className="text-slate-400">Try adjusting your search criteria or filters</p>
          </div>
        )}

        {/* Session Detail Modal */}
        {selectedSession && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Session Details</h2>
                  <button
                    onClick={() => setSelectedSession(null)}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-slate-500">Session ID</label>
                    <p className="text-lg text-slate-800">#{selectedSession.session_id}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-500">Status</label>
                    <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedSession.status)}`}>
                      {getStatusIcon(selectedSession.status)}
                      <span className="capitalize">{selectedSession.status || 'Pending'}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-500">Date</label>
                    <p className="text-slate-800">{selectedSession.date}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-500">Start Time</label>
                    <p className="text-slate-800">{selectedSession.start_time}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-500">Topic</label>
                  <p className="text-slate-800">{selectedSession.topic || 'General Session'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-slate-500">Classroom</label>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="font-semibold text-slate-800">{selectedSession.class_room?.title}</p>
                    <p className="text-sm text-slate-600">
                      {selectedSession.class_room?.enrolled_student_count} students enrolled
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-500">Mentor</label>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="font-semibold text-slate-800">
                      {selectedSession.mentor?.title} {selectedSession.mentor?.first_name} {selectedSession.mentor?.last_name}
                    </p>
                    <p className="text-sm text-slate-600">{selectedSession.mentor?.email}</p>
                    <p className="text-sm text-slate-600">Subject: {selectedSession.mentor?.subject}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-500">Student</label>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="font-semibold text-slate-800">
                      {selectedSession.student?.first_name} {selectedSession.student?.last_name}
                    </p>
                    <p className="text-sm text-slate-600">{selectedSession.student?.email}</p>
                    <p className="text-sm text-slate-600">Age: {selectedSession.student?.age}</p>
                  </div>
                </div>

                {selectedSession.session_link && (
                  <div>
                    <label className="text-sm font-semibold text-slate-500">Session Link</label>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                      <a
                        href={selectedSession.session_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#03b2ed] hover:text-[#fd59ca] transition-colors flex items-center space-x-2"
                      >
                        <span>{selectedSession.session_link}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSessions;