import React, { useState, useEffect } from 'react';
import { BookOpen, Search, User, Users, Award, Mail, Phone, Eye, Edit, Trash2, Lock, GraduationCap, Loader, X } from 'lucide-react';

const AllClassrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({ title: '', enrolled_student_count: '' });
  const [operationLoading, setOperationLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classroomsRes, sessionsRes] = await Promise.all([
        fetch('http://localhost:8080/api/v1/academic/classroom'),
        fetch('http://localhost:8080/api/v1/academic/session')
      ]);
      
      const [classroomsData, sessionsData] = await Promise.all([
        classroomsRes.json(),
        sessionsRes.json()
      ]);
      
      setClassrooms(classroomsData);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isClassroomBindWithSessions = (classroomId) => {
    return sessions.some(session => session.class_room?.class_room_id === classroomId);
  };

  const handleEdit = (classroom) => {
    if (isClassroomBindWithSessions(classroom.class_room_id)) return;
    setSelectedClassroom(classroom);
    setFormData({
      title: classroom.title,
      enrolled_student_count: classroom.enrolled_student_count
    });
    setShowEditForm(true);
  };

  const handleDelete = (classroom) => {
    if (isClassroomBindWithSessions(classroom.class_room_id)) return;
    setSelectedClassroom(classroom);
    setShowDeleteConfirm(true);
  };

  const handleFormSubmit = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a classroom title');
      return;
    }
    setOperationLoading(true);
    
    try {
      const updateData = {
        class_room_id: selectedClassroom.class_room_id,
        title: formData.title.trim(),
        enrolled_student_count: parseInt(formData.enrolled_student_count) || 0,
        mentor: selectedClassroom.mentor ? { mentorId: selectedClassroom.mentor.mentor_id } : null
      };

      const response = await fetch('http://localhost:8080/api/v1/academic/classroom', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Update failed:', errorData);
        alert(`Failed to update classroom: ${response.status} ${response.statusText}`);
        return;
      }

      const updatedClassroom = await response.json();
      console.log('Classroom updated successfully:', updatedClassroom);
      
      // Update local state immediately for better UX
      setClassrooms(prev => prev.map(classroom => 
        classroom.class_room_id === selectedClassroom.class_room_id ? updatedClassroom : classroom
      ));
      
      // Also fetch fresh data
      await fetchData();
      setShowEditForm(false);
      setSelectedClassroom(null);
      alert('Classroom updated successfully!');
      
    } catch (error) {
      console.error('Error updating classroom:', error);
      alert('Error updating classroom. Please try again.');
    } finally {
      setOperationLoading(false);
    }
  };

  const confirmDelete = async () => {
    setOperationLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8080/api/v1/academic/classroom/${selectedClassroom.class_room_id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Delete failed:', errorData);
        alert(`Failed to delete classroom: ${response.status} ${response.statusText}`);
        return;
      }

      console.log('Classroom deleted successfully');
      
      // Update local state immediately for better UX
      setClassrooms(prev => prev.filter(classroom => 
        classroom.class_room_id !== selectedClassroom.class_room_id
      ));
      
      // Also fetch fresh data
      await fetchData();
      setShowDeleteConfirm(false);
      setSelectedClassroom(null);
      alert('Classroom deleted successfully!');
      
    } catch (error) {
      console.error('Error deleting classroom:', error);
      alert('Error deleting classroom. Please try again.');
    } finally {
      setOperationLoading(false);
    }
  };

  const filteredClassrooms = classrooms.filter(classroom =>
    classroom.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.mentor?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.mentor?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.mentor?.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#450063] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading classrooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#450063] mb-6">
              All Classrooms
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage and view all learning spaces with comprehensive admin controls
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search classrooms by title, mentor, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#450063] focus:border-transparent"
              />
            </div>
            <div className="mt-4 text-sm text-gray-500 text-center">
              Showing {filteredClassrooms.length} of {classrooms.length} classrooms
            </div>
          </div>

          {/* Classrooms Grid */}
          {filteredClassrooms.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredClassrooms.map((classroom) => {
                const hasActiveSessions = isClassroomBindWithSessions(classroom.class_room_id);
                
                return (
                  <div key={classroom.class_room_id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    {/* Status Bar */}
                    <div className="h-1 bg-gradient-to-r from-[#450063] to-[#9414d1]"></div>
                    
                    {/* Header */}
                    <div className="p-6">
                      {/* Title and Lock Status */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                            {classroom.title}
                          </h3>
                          <p className="text-sm text-gray-500">ID: #{classroom.class_room_id}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <div className="w-12 h-12 bg-[#450063] rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          {hasActiveSessions && (
                            <div className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                              <Lock className="w-3 h-3" />
                              <span>Active</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Enrolled Students Count */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-100">
                        <div className="flex items-center justify-center space-x-3">
                          <Users className="w-6 h-6 text-[#450063]" />
                          <span className="text-2xl font-bold text-gray-900">
                            {classroom.enrolled_student_count}
                          </span>
                          <span className="text-gray-600">students</span>
                        </div>
                      </div>

                      {/* Mentor Information */}
                      {classroom.mentor && (
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <User className="w-4 h-4 text-[#450063]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {classroom.mentor.title} {classroom.mentor.first_name} {classroom.mentor.last_name}
                              </p>
                              <p className="text-xs text-gray-500">Mentor</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Award className="w-4 h-4 text-[#450063]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{classroom.mentor.subject}</p>
                              <p className="text-xs text-gray-500">Subject</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <GraduationCap className="w-4 h-4 text-[#450063]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{classroom.mentor.profession}</p>
                              <p className="text-xs text-gray-500">Role</p>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4 border">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-600">Session Fee</span>
                              <span className="text-lg font-bold text-[#450063]">
                                ${classroom.mentor.session_fee}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => setSelectedClassroom(classroom)}
                          className="flex-1 bg-gradient-to-r from-[#450063] to-[#9414d1] hover:from-[#350051] hover:to-[#7c3aed] text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        
                        <button 
                          onClick={() => handleEdit(classroom)}
                          disabled={hasActiveSessions}
                          className={`py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                            hasActiveSessions 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
                          }`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(classroom)}
                          disabled={hasActiveSessions}
                          className={`py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                            hasActiveSessions 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {hasActiveSessions && (
                        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-xs text-yellow-700 text-center">
                            <Lock className="w-3 h-3 inline mr-1" />
                            Has active sessions - editing/deletion disabled
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* No Results */}
          {filteredClassrooms.length === 0 && classrooms.length === 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No classrooms found</h3>
                <p className="text-gray-600 mb-6">
                  There are currently no classrooms in the system. Classrooms will appear here once they are created.
                </p>
              </div>
            </div>
          )}

          {filteredClassrooms.length === 0 && classrooms.length > 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No classrooms found</h3>
                <p className="text-gray-600 mb-6">
                  No classrooms match your current search criteria. Try adjusting your search terms.
                </p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="bg-[#450063] hover:bg-[#350051] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}

          {/* Classroom Detail Modal */}
          {selectedClassroom && !showEditForm && !showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-[#280120] via-[#450063] to-[#9414d1] p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Classroom Details</h2>
                    <button
                      onClick={() => setSelectedClassroom(null)}
                      className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold text-slate-500">Classroom ID</label>
                      <p className="text-lg text-slate-800">#{selectedClassroom.class_room_id}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-slate-500">Title</label>
                      <p className="text-lg text-slate-800 font-semibold">{selectedClassroom.title}</p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-slate-500">Enrolled Students</label>
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 text-center">
                        <div className="flex items-center justify-center space-x-3">
                          <Users className="w-6 h-6 text-[#9414d1]" />
                          <span className="text-3xl font-bold text-slate-800">
                            {selectedClassroom.enrolled_student_count}
                          </span>
                          <span className="text-slate-600">students</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedClassroom.mentor && (
                    <div>
                      <label className="text-sm font-semibold text-slate-500 mb-4 block">Assigned Mentor</label>
                      <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-[#450063] to-[#9414d1] rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-800">
                              {selectedClassroom.mentor.title} {selectedClassroom.mentor.first_name} {selectedClassroom.mentor.last_name}
                            </h3>
                            <p className="text-slate-600">{selectedClassroom.mentor.profession}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label>
                            <p className="text-slate-700 flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-slate-400" />
                              <span>{selectedClassroom.mentor.email}</span>
                            </p>
                          </div>
                          
                          <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</label>
                            <p className="text-slate-700 flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-slate-400" />
                              <span>{selectedClassroom.mentor.phone_number}</span>
                            </p>
                          </div>
                          
                          <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Subject</label>
                            <p className="text-slate-700 font-semibold">{selectedClassroom.mentor.subject}</p>
                          </div>
                          
                          <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Session Fee</label>
                            <p className="text-slate-700 font-bold text-[#9414d1]">
                              ${selectedClassroom.mentor.session_fee}
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Qualification</label>
                          <p className="text-slate-700">{selectedClassroom.mentor.qualification}</p>
                        </div>

                        {selectedClassroom.mentor.bio && (
                          <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bio</label>
                            <p className="text-slate-700 bg-white rounded-lg p-3 text-sm leading-relaxed">
                              {selectedClassroom.mentor.bio}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Edit Form Modal */}
          {showEditForm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                <div className="bg-gradient-to-r from-[#280120] via-[#450063] to-[#9414d1] p-6 rounded-t-2xl">
                  <h3 className="text-xl font-bold text-white">Edit Classroom</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Classroom Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#450063] focus:border-transparent outline-none transition-all duration-300"
                        placeholder="Enter classroom title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Enrolled Students Count
                      </label>
                      <input
                        type="number"
                        value={formData.enrolled_student_count}
                        onChange={(e) => setFormData({ ...formData, enrolled_student_count: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#450063] focus:border-transparent outline-none transition-all duration-300"
                        min="0"
                        placeholder="Enter student count"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={() => {
                        setShowEditForm(false);
                        setSelectedClassroom(null);
                      }}
                      className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleFormSubmit}
                      disabled={operationLoading}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-[#450063] to-[#9414d1] text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                    >
                      {operationLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-t-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Trash2 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Confirm Deletion</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <p className="text-slate-700 mb-4">
                      Are you sure you want to delete the classroom:
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <h4 className="font-bold text-red-800 text-lg">"{selectedClassroom?.title}"</h4>
                      <p className="text-red-600 text-sm">ID: #{selectedClassroom?.class_room_id}</p>
                      <p className="text-red-600 text-sm">Students: {selectedClassroom?.enrolled_student_count}</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-yellow-800 text-sm font-medium">
                        ⚠️ This action cannot be undone and will permanently remove:
                      </p>
                      <ul className="text-yellow-700 text-sm mt-2 ml-4 list-disc">
                        <li>All classroom data</li>
                        <li>Student enrollment records</li>
                        <li>Associated settings</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setSelectedClassroom(null);
                      }}
                      className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      disabled={operationLoading}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                    >
                      {operationLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Deleting...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Trash2 className="w-4 h-4" />
                          <span>Yes, Delete Classroom</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllClassrooms;