import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, BookOpen, X, Check } from 'lucide-react';

const ClassroomManager = () => {
  const [classroom, setClassroom] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({ title: '', enrolled_student_count: '' });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const mentorId = 1;

  // Fetch existing classroom on component mount
  useEffect(() => {
    fetchClassroom();
  }, []);

  const fetchClassroom = async () => {
    setInitialLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/v1/academic/classroom/mentor/${mentorId}`);
      if (response.ok) {
        const data = await response.json();
        setClassroom(data);
      } else if (response.status === 404) {
        // No classroom exists for this mentor
        setClassroom(null);
      } else {
        console.error('Error fetching classroom:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching classroom:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const createClassroom = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/v1/academic/classroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          enrolled_student_count: parseInt(formData.enrolled_student_count),
          mentor: { mentor_id: mentorId }
        })
      });
      const data = await response.json();
      setClassroom(data);
      setShowCreateForm(false);
      setFormData({ title: '', enrolled_student_count: '' });
    } catch (error) {
      console.error('Error creating classroom:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateClassroom = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/v1/academic/classroom', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_room_id: classroom.class_room_id,
          title: formData.title,
          enrolled_student_count: parseInt(formData.enrolled_student_count),
          mentor: { mentor_id: mentorId }
        })
      });
      const data = await response.json();
      setClassroom(data);
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating classroom:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteClassroom = async () => {
    setLoading(true);
    try {
      await fetch(`http://localhost:8080/api/v1/academic/classroom/${classroom.class_room_id}`, {
        method: 'DELETE'
      });
      setClassroom(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting classroom:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setFormData({ title: classroom.title, enrolled_student_count: classroom.enrolled_student_count });
    setShowEditForm(true);
  };

  // Show loading spinner while fetching initial data
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9414d1] mx-auto mb-4"></div>
          <p className="text-slate-600">Loading classroom...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#280120] via-[#450063] to-[#9414d1]">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#03b2ed]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#fd59ca]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-black text-white mb-4">
              My <span className="bg-gradient-to-r from-[#03b2ed] via-[#fd59ca] to-[#03b2ed] bg-clip-text text-transparent">Classroom</span>
            </h1>
            <p className="text-xl text-white/80 font-medium">Manage your classroom and students</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* No classroom exists and no form is shown */}
        {!classroom && !showCreateForm && (
          <div className="text-center py-16">
            <BookOpen className="w-20 h-20 text-slate-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">No Classroom Created</h2>
            <p className="text-slate-600 mb-8">Create your first classroom to start mentoring students</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="group bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] hover:from-[#fd59ca] hover:to-[#03b2ed] text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Create Classroom</span>
              </div>
            </button>
          </div>
        )}

        {/* Create or Edit Form */}
        {(showCreateForm || showEditForm) && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#280120]">
                {showCreateForm ? 'Create New Classroom' : 'Edit Classroom'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setShowEditForm(false);
                  setFormData({ title: '', enrolled_student_count: '' });
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Classroom Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#9414d1] focus:border-transparent"
                  placeholder="Enter classroom title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Enrolled Student Count</label>
                <input
                  type="number"
                  value={formData.enrolled_student_count}
                  onChange={(e) => setFormData({ ...formData, enrolled_student_count: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#9414d1] focus:border-transparent"
                  placeholder="Enter student count"
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={showCreateForm ? createClassroom : updateClassroom}
                  disabled={loading || !formData.title || !formData.enrolled_student_count}
                  className="flex-1 bg-gradient-to-r from-[#03b2ed] to-[#9414d1] text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : showCreateForm ? 'Create Classroom' : 'Update Classroom'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Classroom Details - Only shown if classroom exists and no forms are open */}
        {classroom && !showCreateForm && !showEditForm && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#280120]">Classroom Details</h3>
              <div className="flex space-x-3">
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center space-x-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-600">Title</label>
                  <p className="text-lg font-medium text-slate-900">{classroom.title}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600">Students Enrolled</label>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-[#9414d1]" />
                    <p className="text-lg font-medium text-slate-900">{classroom.enrolled_student_count}</p>
                  </div>
                </div>
              </div>
              
              {classroom.mentor && (
                <div className="bg-gradient-to-br from-[#9414d1]/10 to-[#03b2ed]/10 rounded-xl p-6">
                  <h4 className="font-semibold text-[#280120] mb-3">Mentor Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {classroom.mentor.title} {classroom.mentor.first_name} {classroom.mentor.last_name}</p>
                    <p><span className="font-medium">Subject:</span> {classroom.mentor.subject}</p>
                    <p><span className="font-medium">Email:</span> {classroom.mentor.email}</p>
                    <p><span className="font-medium">Phone:</span> {classroom.mentor.phone_number}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Confirm Deletion</h3>
              <p className="text-slate-600 mb-6">Are you sure you want to delete this classroom? This action cannot be undone.</p>
              <div className="flex space-x-4">
                <button
                  onClick={deleteClassroom}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassroomManager;