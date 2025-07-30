import React, { useState, useEffect } from 'react';
import { User, Search, Mail, Phone, MapPin, BookOpen, Award, DollarSign, Eye, Edit, Trash2, Plus, Users } from 'lucide-react';

const AllMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/academic/mentor');
      const data = await response.json();
      setMentors(data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">All Mentors</h1>
                <p className="text-white/80">Manage and view all registered mentors</p>
              </div>
            </div>
        
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search mentors by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9414d1] focus:border-transparent outline-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <div key={mentor.mentor_id} className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {mentor.title} {mentor.first_name} {mentor.last_name}
                      </h3>
                      <p className="text-white/80 text-sm">ID: {mentor.mentor_id}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-slate-600">
                    <BookOpen className="w-4 h-4 text-[#9414d1]" />
                    <span className="text-sm font-semibold">{mentor.subject}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-slate-600">
                    <Award className="w-4 h-4 text-[#03b2ed]" />
                    <span className="text-sm">{mentor.profession}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-slate-600">
                    <Mail className="w-4 h-4 text-[#fd59ca]" />
                    <span className="text-sm">{mentor.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-slate-600">
                    <Phone className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{mentor.phone_number}</span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Session Fee:</span>
                      <span className="font-bold text-[#9414d1] flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {mentor.session_fee}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Sessions:</span>
                      <span className="font-semibold text-slate-700 flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {mentor.sessions ? mentor.sessions.length : 0}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3">
                    <p className="text-xs text-slate-600 font-medium">Qualification:</p>
                    <p className="text-sm text-slate-800">{mentor.qualification}</p>
                  </div>
                </div>

                <div className="flex space-x-2 mt-6">
                  <button 
                    onClick={() => setSelectedMentor(mentor)}
                    className="flex-1 bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] text-white py-2 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button className="flex-1 bg-slate-100 text-slate-600 py-2 px-4 rounded-xl font-medium hover:bg-slate-200 transition-all duration-300 flex items-center justify-center space-x-2">
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button className="bg-red-100 text-red-600 py-2 px-4 rounded-xl font-medium hover:bg-red-200 transition-all duration-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <User className="w-24 h-24 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-500 mb-2">No mentors found</h3>
            <p className="text-slate-400">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Mentor Detail Modal */}
        {selectedMentor && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Mentor Details</h2>
                  <button
                    onClick={() => setSelectedMentor(null)}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-slate-500">Full Name</label>
                    <p className="text-lg text-slate-800">{selectedMentor.title} {selectedMentor.first_name} {selectedMentor.last_name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-500">Subject</label>
                    <p className="text-slate-800 font-semibold">{selectedMentor.subject}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-500">Email</label>
                    <p className="text-slate-800">{selectedMentor.email}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-500">Phone</label>
                    <p className="text-slate-800">{selectedMentor.phone_number}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-500">Session Fee</label>
                    <p className="text-slate-800 font-bold">${selectedMentor.session_fee}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-500">Classroom ID</label>
                    <p className="text-slate-800">{selectedMentor.class_room_id}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-slate-500">Address</label>
                  <p className="text-slate-800">{selectedMentor.address}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-slate-500">Qualification</label>
                  <p className="text-slate-800">{selectedMentor.qualification}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-slate-500">Bio</label>
                  <p className="text-slate-800 bg-slate-50 rounded-xl p-4">{selectedMentor.bio}</p>
                </div>

                {selectedMentor.sessions && selectedMentor.sessions.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-slate-500 mb-3 block">Recent Sessions</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedMentor.sessions.slice(0, 5).map((session) => (
                        <div key={session.session_id} className="bg-slate-50 rounded-lg p-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Session #{session.session_id}</span>
                            <span className="text-slate-500">{session.date}</span>
                          </div>
                          <p className="text-slate-600">Student: {session.student.first_name} {session.student.last_name}</p>
                        </div>
                      ))}
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

export default AllMentors;