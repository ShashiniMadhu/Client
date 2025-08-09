import React, { useState, useEffect } from 'react';
import { Calendar, Search, Clock, User, GraduationCap, BookOpen, Eye, CheckCircle, XCircle, AlertCircle, Link, ExternalLink, Check, X, FileText, Image, Download, Loader, Star, DollarSign, Briefcase, Mail } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

const AllSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState({});
  const [sessionLinks, setSessionLinks] = useState({});
  const [previewSlip, setPreviewSlip] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/academic/session`);
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSessionStatus = async (sessionId, status, sessionLink = '') => {
    try {
      setActionLoading(prev => ({ ...prev, [sessionId]: status }));
      
      let url = `${API_BASE_URL}/api/v1/academic/session/${sessionId}/status?status=${status}`;
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
      
      setSessions(prev => prev.map(session => 
        session.session_id === sessionId ? updatedSession : session
      ));
      
      setSessionLinks(prev => ({ ...prev, [sessionId]: '' }));
      
    } catch (err) {
      console.error(err.message);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'payment_uploaded': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'payment_uploaded': return <FileText className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
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
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getFileType = (filename) => {
    if (!filename) return 'unknown';
    const extension = filename.toLowerCase().split('.').pop();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
      return 'image';
    } else if (extension === 'pdf') {
      return 'pdf';
    }
    return 'unknown';
  };

  const getFullFileUrl = (slipLink) => {
    if (!slipLink) return null;
    if (slipLink.startsWith('http')) return slipLink;
    if (slipLink.startsWith('/uploads')) {
      return `${API_BASE_URL}${slipLink}`;
    }
    return `${API_BASE_URL}/uploads/${slipLink}`;
  };

  const PaymentSlipPreview = ({ slipLink, sessionId }) => {
    if (!slipLink) return null;

    const fullUrl = getFullFileUrl(slipLink);
    const fileType = getFileType(slipLink);

    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4 border border-blue-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-600 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Payment Slip:
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setPreviewSlip({ url: fullUrl, type: fileType, sessionId })}
              className="text-[#450063] hover:text-[#280120] transition-colors flex items-center space-x-1 text-sm font-medium"
            >
              <Eye className="w-3 h-3" />
              <span>Preview</span>
            </button>
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#450063] hover:text-[#280120] transition-colors flex items-center space-x-1 text-sm font-medium"
            >
              <Download className="w-3 h-3" />
              <span>Download</span>
            </a>
          </div>
        </div>
        
        {fileType === 'image' && (
          <div className="relative">
            <img
              src={fullUrl}
              alt="Payment slip thumbnail"
              className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setPreviewSlip({ url: fullUrl, type: fileType, sessionId })}
              onError={(e) => {
                console.error('Image failed to load:', fullUrl);
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 rounded-lg">
              <Eye className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        )}
        
        {fileType === 'pdf' && (
          <div 
            className="flex items-center justify-center bg-red-50 border border-red-200 rounded-lg p-8 cursor-pointer hover:bg-red-100 transition-colors"
            onClick={() => setPreviewSlip({ url: fullUrl, type: fileType, sessionId })}
          >
            <div className="text-center">
              <FileText className="w-12 h-12 text-red-600 mx-auto mb-2" />
              <p className="text-red-700 font-medium">PDF Document</p>
              <p className="text-red-600 text-sm">Click to preview</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const SlipPreviewModal = () => {
    if (!previewSlip) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-[#280120] via-[#450063] to-[#9414d1] p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                Payment Slip Preview - Session #{previewSlip.sessionId}
              </h3>
              <button
                onClick={() => setPreviewSlip(null)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {previewSlip.type === 'image' ? (
              <div className="text-center">
                <img
                  src={previewSlip.url}
                  alt="Payment slip"
                  className="max-w-full max-h-[70vh] object-contain mx-auto rounded-lg shadow-lg"
                  onError={(e) => {
                    console.error('Image failed to load in modal:', previewSlip.url);
                    e.target.style.display = 'none';
                  }}
                />
                <div className="mt-4 flex justify-center space-x-4">
                  <a
                    href={previewSlip.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#450063] text-white px-4 py-2 rounded-lg hover:bg-[#280120] transition-colors flex items-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open in New Tab</span>
                  </a>
                  <a
                    href={previewSlip.url}
                    download
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ) : previewSlip.type === 'pdf' ? (
              <div className="text-center">
                <iframe
                  src={previewSlip.url}
                  className="w-full h-[70vh] rounded-lg shadow-lg"
                  title="PDF Preview"
                />
                <div className="mt-4 flex justify-center space-x-4">
                  <a
                    href={previewSlip.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#450063] text-white px-4 py-2 rounded-lg hover:bg-[#280120] transition-colors flex items-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open in New Tab</span>
                  </a>
                  <a
                    href={previewSlip.url}
                    download
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Cannot Preview File</h3>
                <p className="text-gray-500 mb-4">This file type is not supported for preview</p>
                <a
                  href={previewSlip.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#450063] text-white px-6 py-3 rounded-lg hover:bg-[#280120] transition-colors inline-flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open File</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#450063] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#450063] mb-6">
              All Sessions Overview
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage and track all mentoring sessions across the platform with comprehensive admin controls
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search sessions, mentors, students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#450063] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-4 items-center">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#450063] focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="pending">Pending</option>
                  <option value="payment_uploaded">Payment Uploaded</option>
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
              Showing {filteredSessions.length} of {sessions.length} sessions
            </div>
          </div>

          {/* Sessions Grid/List */}
          {filteredSessions.length > 0 && (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8' 
                : 'space-y-6'
            }`}>
              {filteredSessions.map((session) => (
                <div key={session.session_id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  {/* Status Bar */}
                  <div className="h-1 bg-gradient-to-r from-[#450063] to-[#9414d1]"></div>
                  
                  {/* Header */}
                  <div className="p-6">
                    {/* Status Badge and Session Icon */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}>
                        {getStatusIcon(session.status)}
                        <span className="ml-1 capitalize">{session.status === 'payment_uploaded' ? 'Payment Uploaded' : session.status || 'Pending'}</span>
                      </div>
                      <div className="w-12 h-12 bg-[#450063] rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Session Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                      Session #{session.session_id}
                    </h3>
                    <p className="text-gray-600 mb-4">{session.topic || 'General Session'}</p>

                    {/* Classroom, Mentor, Student info */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-[#450063]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{session.class_room?.title}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-[#450063]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {session.mentor?.title} {session.mentor?.first_name} {session.mentor?.last_name}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <GraduationCap className="w-4 h-4 text-[#450063]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {session.student?.first_name} {session.student?.last_name}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Session Details */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="w-4 h-4 text-[#450063]" />
                          <span className="text-xs font-medium text-gray-600">Date</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">{formatDate(session.date)}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="w-4 h-4 text-[#450063]" />
                          <span className="text-xs font-medium text-gray-600">Time</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">{formatTime(session.start_time)}</p>
                      </div>
                    </div>

                    {/* Session Link */}
                    {session.session_link && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-600">Session Link:</span>
                          <a
                            href={session.session_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#450063] hover:text-[#280120] transition-colors flex items-center space-x-1 text-sm font-medium"
                          >
                            <span>Join</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Payment Slip Preview */}
                    {session.slip_link && (
                      <PaymentSlipPreview slipLink={session.slip_link} sessionId={session.session_id} />
                    )}

                    {/* Admin Controls */}
                    <div className="space-y-4 border-t border-gray-200 pt-4">
                      {session.status === 'accepted' ? (
                        <div className="text-center">
                          <div className="bg-green-50 rounded-lg p-3 mb-3">
                            <p className="text-green-700 font-medium">✓ Session Accepted</p>
                            {session.session_link && (
                              <a href={session.session_link} target="_blank" rel="noopener noreferrer" className="text-green-600 text-sm hover:underline">
                                View Session Link
                              </a>
                            )}
                          </div>
                          <button
                            onClick={() => updateSessionStatus(session.session_id, 'reject')}
                            disabled={actionLoading[session.session_id] === 'reject'}
                            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 mx-auto"
                          >
                            {actionLoading[session.session_id] === 'reject' ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                            <span>Reject Session</span>
                          </button>
                        </div>
                      ) : session.status === 'rejected' ? (
                        <div className="text-center">
                          <div className="bg-red-50 rounded-lg p-3 mb-3">
                            <p className="text-red-700 font-medium">✗ Session Rejected</p>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Link className="w-5 h-5 text-slate-600" />
                              <input
                                type="url"
                                placeholder="Enter session link to accept"
                                value={sessionLinks[session.session_id] || ''}
                                onChange={(e) => setSessionLinks(prev => ({ ...prev, [session.session_id]: e.target.value }))}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#450063] focus:border-transparent outline-none"
                              />
                            </div>
                            <button
                              onClick={() => handleAcceptWithLink(session.session_id)}
                              disabled={actionLoading[session.session_id] === 'accept'}
                              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 mx-auto"
                            >
                              {actionLoading[session.session_id] === 'accept' ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                              <span>Accept Session</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className={`${session.status === 'payment_uploaded' ? 'bg-blue-50' : 'bg-yellow-50'} rounded-lg p-3 mb-3 text-center`}>
                            <p className={`${session.status === 'payment_uploaded' ? 'text-blue-700' : 'text-yellow-700'} font-medium`}>
                              {session.status === 'payment_uploaded' ? '💳 Payment Uploaded - Ready for Approval' : '⏳ Pending Approval'}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3 mb-3">
                            <Link className="w-5 h-5 text-slate-600" />
                            <input
                              type="url"
                              placeholder="Enter session link"
                              value={sessionLinks[session.session_id] || ''}
                              onChange={(e) => setSessionLinks(prev => ({ ...prev, [session.session_id]: e.target.value }))}
                              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#450063] focus:border-transparent outline-none"
                            />
                          </div>
                          
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleAcceptWithLink(session.session_id)}
                              disabled={actionLoading[session.session_id] === 'accept'}
                              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                              {actionLoading[session.session_id] === 'accept' ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                              <span>Accept</span>
                            </button>
                            
                            <button
                              onClick={() => updateSessionStatus(session.session_id, 'reject')}
                              disabled={actionLoading[session.session_id] === 'reject'}
                              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                              {actionLoading[session.session_id] === 'reject' ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <X className="w-4 h-4" />
                              )}
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* View Details Button */}
                    <div className="mt-4">
                      <button 
                        onClick={() => setSelectedSession(session)}
                        className="w-full bg-gradient-to-r from-[#450063] to-[#9414d1] hover:from-[#350051] hover:to-[#7c3aed] text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Sessions State */}
          {filteredSessions.length === 0 && sessions.length === 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Sessions Found</h3>
                <p className="text-gray-600 mb-6">
                  There are currently no sessions in the system. Sessions will appear here once they are created.
                </p>
              </div>
            </div>
          )}

          {/* No Search Results */}
          {filteredSessions.length === 0 && sessions.length > 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Sessions Found</h3>
                <p className="text-gray-600 mb-6">
                  No sessions match your current search criteria. Try adjusting your filters or search terms.
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="bg-[#450063] hover:bg-[#350051] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Session Detail Modal */}
          {selectedSession && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-[#280120] via-[#450063] to-[#9414d1] p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Session Details</h2>
                    <button
                      onClick={() => setSelectedSession(null)}
                      className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300"
                    >
                      <X className="w-6 h-6" />
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
                      <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedSession.status)}`}>
                        {getStatusIcon(selectedSession.status)}
                        <span className="capitalize ml-1">{selectedSession.status === 'payment_uploaded' ? 'Payment Uploaded' : selectedSession.status || 'Pending'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-slate-500">Date</label>
                      <p className="text-slate-800">{formatDate(selectedSession.date)}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-slate-500">Start Time</label>
                      <p className="text-slate-800">{formatTime(selectedSession.start_time)}</p>
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
                          className="text-[#450063] hover:text-[#280120] transition-colors flex items-center space-x-2"
                        >
                          <span>{selectedSession.session_link}</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Payment Slip in Modal */}
                  {selectedSession.slip_link && (
                    <div>
                      <label className="text-sm font-semibold text-slate-500">Payment Slip</label>
                      <PaymentSlipPreview slipLink={selectedSession.slip_link} sessionId={selectedSession.session_id} />
                    </div>
                  )}

                  {/* Admin Controls in Modal */}
                  <div className="space-y-4 border-t border-slate-200 pt-4">
                    <h3 className="text-lg font-semibold text-slate-700">Admin Actions</h3>
                    
                    {selectedSession.status === 'accepted' ? (
                      <div>
                        <div className="bg-green-50 rounded-lg p-3 mb-3 text-center">
                          <p className="text-green-700 font-medium">✓ Session Already Accepted</p>
                        </div>
                        <button
                          onClick={() => {
                            updateSessionStatus(selectedSession.session_id, 'reject');
                            setSelectedSession(null);
                          }}
                          disabled={actionLoading[selectedSession.session_id] === 'reject'}
                          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                          {actionLoading[selectedSession.session_id] === 'reject' ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          <span>Reject Session</span>
                        </button>
                      </div>
                    ) : selectedSession.status === 'rejected' ? (
                      <div>
                        <div className="bg-red-50 rounded-lg p-3 mb-3 text-center">
                          <p className="text-red-700 font-medium">✗ Session Currently Rejected</p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Link className="w-5 h-5 text-slate-600" />
                            <input
                              type="url"
                              placeholder="Enter session link to accept"
                              value={sessionLinks[selectedSession.session_id] || ''}
                              onChange={(e) => setSessionLinks(prev => ({ ...prev, [selectedSession.session_id]: e.target.value }))}
                              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#450063] focus:border-transparent outline-none"
                            />
                          </div>
                          <button
                            onClick={() => {
                              handleAcceptWithLink(selectedSession.session_id);
                              setSelectedSession(null);
                            }}
                            disabled={actionLoading[selectedSession.session_id] === 'accept'}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                          >
                            {actionLoading[selectedSession.session_id] === 'accept' ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            <span>Accept Session</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className={`${selectedSession.status === 'payment_uploaded' ? 'bg-blue-50' : 'bg-yellow-50'} rounded-lg p-3 mb-3 text-center`}>
                          <p className={`${selectedSession.status === 'payment_uploaded' ? 'text-blue-700' : 'text-yellow-700'} font-medium`}>
                            {selectedSession.status === 'payment_uploaded' ? '💳 Payment Uploaded - Ready for Approval' : '⏳ Pending Your Approval'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3 mb-3">
                          <Link className="w-5 h-5 text-slate-600" />
                          <input
                            type="url"
                            placeholder="Enter session link"
                            value={sessionLinks[selectedSession.session_id] || ''}
                            onChange={(e) => setSessionLinks(prev => ({ ...prev, [selectedSession.session_id]: e.target.value }))}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#450063] focus:border-transparent outline-none"
                          />
                        </div>
                        
                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              handleAcceptWithLink(selectedSession.session_id);
                              setSelectedSession(null);
                            }}
                            disabled={actionLoading[selectedSession.session_id] === 'accept'}
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                          >
                            {actionLoading[selectedSession.session_id] === 'accept' ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            <span>Accept</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              updateSessionStatus(selectedSession.session_id, 'reject');
                              setSelectedSession(null);
                            }}
                            disabled={actionLoading[selectedSession.session_id] === 'reject'}
                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                          >
                            {actionLoading[selectedSession.session_id] === 'reject' ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slip Preview Modal */}
          <SlipPreviewModal />
        </div>
      </div>
    </div>
  );
};

export default AllSessions;