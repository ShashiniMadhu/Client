import React, { useState, useEffect } from 'react';
import { BookOpen, Search, User, Users, Award, Mail, Phone, Eye, Edit, Trash2, Plus, GraduationCap } from 'lucide-react';

const AllClassrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({ title: '', enrolled_student_count: '' });
  const [operationLoading, setOperationLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/academic/classroom');
      const data = await response.json();
      setClassrooms(data);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (classroom) => {
    setSelectedClassroom(classroom);
    setFormData({
      title: classroom.title,
      enrolled_student_count: classroom.enrolled_student_count
    });
    setShowEditForm(true);
  };

  const handleDelete = (classroom) => {
    setSelectedClassroom(classroom);
    setShowDeleteConfirm(true);
  };

  const handleFormSubmit = async () => {
    if (!formData.title.trim()) return;
    setOperationLoading(true);
    
    try {
      // Try different endpoints and methods based on your API structure
      let response;
      
      // Method 1: Try PATCH instead of PUT (sometimes CORS allows PATCH)
      try {
        response = await fetch(`http://localhost:8080/api/v1/academic/classroom/${selectedClassroom.class_room_id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } catch (patchError) {
        // Method 2: Try POST to an update endpoint
        try {
          response = await fetch(`http://localhost:8080/api/v1/academic/classroom/${selectedClassroom.class_room_id}/update`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(formData),
          });
        } catch (postError) {
          // Method 3: Try PUT with different headers
          response = await fetch(`http://localhost:8080/api/v1/academic/classroom/${selectedClassroom.class_room_id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(formData),
          });
        }
      }

      if (response && response.ok) {
        // Update local state immediately for better UX
        const updatedClassrooms = classrooms.map(classroom => 
          classroom.class_room_id === selectedClassroom.class_room_id 
            ? { ...classroom, ...formData }
            : classroom
        );
        setClassrooms(updatedClassrooms);
        
        setShowEditForm(false);
        setSelectedClassroom(null);
        showNotification('Classroom updated successfully!', 'success');
      } else {
        // If API fails, still update locally and show warning
        const updatedClassrooms = classrooms.map(classroom => 
          classroom.class_room_id === selectedClassroom.class_room_id 
            ? { ...classroom, ...formData }
            : classroom
        );
        setClassrooms(updatedClassrooms);
        
        setShowEditForm(false);
        setSelectedClassroom(null);
        showNotification('Updated locally. Server CORS policy needs configuration.', 'warning');
      }
    } catch (error) {
      console.error('Error updating classroom:', error);
      
      // Fallback: Update locally even if API fails
      const updatedClassrooms = classrooms.map(classroom => 
        classroom.class_room_id === selectedClassroom.class_room_id 
          ? { ...classroom, ...formData }
          : classroom
      );
      setClassrooms(updatedClassrooms);
      
      setShowEditForm(false);
      setSelectedClassroom(null);
      showNotification('CORS Error: Updated locally. Backend needs CORS configuration.', 'warning');
    } finally {
      setOperationLoading(false);
    }
  };

  const confirmDelete = async () => {
    setOperationLoading(true);
    
    try {
      let response;
      
      // Method 1: Try DELETE request
      try {
        response = await fetch(`http://localhost:8080/api/v1/academic/classroom/${selectedClassroom.class_room_id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
      } catch (deleteError) {
        // Method 2: Try POST to delete endpoint
        try {
          response = await fetch(`http://localhost:8080/api/v1/academic/classroom/${selectedClassroom.class_room_id}/delete`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });
        } catch (postError) {
          // Method 3: Try with different endpoint structure
          response = await fetch(`http://localhost:8080/api/v1/academic/classroom/delete/${selectedClassroom.class_room_id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });
        }
      }

      if (response && response.ok) {
        // Remove from local state
        const updatedClassrooms = classrooms.filter(
          classroom => classroom.class_room_id !== selectedClassroom.class_room_id
        );
        setClassrooms(updatedClassrooms);
        
        setShowDeleteConfirm(false);
        setSelectedClassroom(null);
        showNotification('Classroom deleted successfully!', 'success');
      } else {
        const errorText = response ? await response.text() : 'No response';
        console.error('Failed to delete classroom:', response?.status, errorText);
        
        if (response?.status === 500) {
          showNotification('Server Error: Classroom might have associated data preventing deletion.', 'error');
        } else {
          showNotification('Failed to delete classroom. Please try again.', 'error');
        }
      }
    } catch (error) {
      console.error('Error deleting classroom:', error);
      
      if (error.message.includes('CORS')) {
        showNotification('CORS Error: Cannot delete due to server configuration.', 'error');
      } else {
        showNotification('Network error: Please check your connection and try again.', 'error');
      }
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9414d1]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'warning' ? 'bg-yellow-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification({ show: false, message: '', type: '' })}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#280120] via-[#450063] to-[#9414d1] rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#03b2ed] to-[#fd59ca] rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">All Classrooms</h1>
                <p className="text-white/80">Manage and view all learning spaces</p>
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
              placeholder="Search classrooms by title, mentor, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9414d1] focus:border-transparent outline-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Classrooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClassrooms.map((classroom) => (
            <div key={classroom.class_room_id} className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {classroom.title}
                      </h3>
                      <p className="text-white/80 text-sm">ID: {classroom.class_room_id}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {/* Enrolled Students Count */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-[#9414d1]" />
                      <span className="text-2xl font-bold text-slate-800">
                        {classroom.enrolled_student_count}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">Students Enrolled</p>
                  </div>

                  {/* Mentor Information */}
                  {classroom.mentor && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-slate-600">
                        <User className="w-4 h-4 text-[#03b2ed]" />
                        <div>
                          <span className="text-sm font-semibold">
                            {classroom.mentor.title} {classroom.mentor.first_name} {classroom.mentor.last_name}
                          </span>
                          <p className="text-xs text-slate-400">Mentor</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-slate-600">
                        <Award className="w-4 h-4 text-[#9414d1]" />
                        <span className="text-sm">{classroom.mentor.subject}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-slate-600">
                        <GraduationCap className="w-4 h-4 text-[#fd59ca]" />
                        <span className="text-sm">{classroom.mentor.profession}</span>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Session Fee:</span>
                          <span className="font-bold text-[#9414d1]">
                            ${classroom.mentor.session_fee}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 mt-6">
                  <button 
                    onClick={() => setSelectedClassroom(classroom)}
                    className="flex-1 bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] text-white py-2 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button 
                    onClick={() => handleEdit(classroom)}
                    className="flex-1 bg-slate-100 text-slate-600 py-2 px-4 rounded-xl font-medium hover:bg-slate-200 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(classroom)}
                    className="bg-red-100 text-red-600 py-2 px-4 rounded-xl font-medium hover:bg-red-200 transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredClassrooms.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-24 h-24 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-500 mb-2">No classrooms found</h3>
            <p className="text-slate-400">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Classroom Detail Modal */}
        {selectedClassroom && !showEditForm && !showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Classroom Details</h2>
                  <button
                    onClick={() => setSelectedClassroom(null)}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300"
                  >
                    ×
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
                        <div className="w-16 h-16 bg-gradient-to-br from-[#03b2ed] to-[#fd59ca] rounded-full flex items-center justify-center">
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
              <div className="bg-gradient-to-r from-[#9414d1] to-[#03b2ed] p-6 rounded-t-2xl">
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
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-transparent outline-none transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Enrolled Students Count
                    </label>
                    <input
                      type="number"
                      value={formData.enrolled_student_count}
                      onChange={(e) => setFormData({ ...formData, enrolled_student_count: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-transparent outline-none transition-all duration-300"
                      min="0"
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
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-[#9414d1] to-[#03b2ed] text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
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
                <h3 className="text-xl font-bold text-white">Delete Classroom</h3>
              </div>
              <div className="p-6">
                <p className="text-slate-700 mb-6">
                  Are you sure you want to delete <strong>"{selectedClassroom?.title}"</strong>? 
                  This action cannot be undone and will permanently remove the classroom and all associated data.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setSelectedClassroom(null);
                    }}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={operationLoading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {operationLoading ? 'Deleting...' : 'Delete Classroom'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllClassrooms;