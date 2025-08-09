import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Trash2, Save, X, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { useUserData } from '../../hooks/useUserData';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

const StudentProfile = () => {
  const { userData, userRole, loading: userLoading, error: userError } = useUserData();
  
  const [student, setStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState(''); // 'success' or 'error'

  // Fetch student data based on authenticated user
  useEffect(() => {
    const fetchStudent = async () => {
      if (userLoading) return;
      
      if (userError) {
        setStatus(`Authentication error: ${userError}`);
        setStatusType('error');
        setLoading(false);
        return;
      }
      
      if (!userData || userRole !== 'student') {
        setStatus('Only students can access this profile');
        setStatusType('error');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const studentId = userData.student_id;
        
        console.log('Fetching student data for ID:', studentId);
        
        const response = await fetch(`${API_BASE_URL}/api/v1/academic/student/${studentId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch student data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setStudent(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch student data:', err);
        setStatus('Failed to load profile.');
        setStatusType('error');
        setLoading(false);
      }
    };

    fetchStudent();
  }, [userData, userRole, userLoading, userError]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/academic/student`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      });
      
      if (!response.ok) {
        throw new Error(`Update failed: ${response.status} ${response.statusText}`);
      }
      
      setStatus('Profile updated successfully!');
      setStatusType('success');
      setEditMode(false);
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setStatus('');
        setStatusType('');
      }, 3000);
    } catch (err) {
      console.error('Update failed:', err);
      setStatus('Failed to update profile.');
      setStatusType('error');
    }
  };

  const handleDelete = async () => {
    try {
      const studentId = userData.student_id;
      
      const response = await fetch(`${API_BASE_URL}/api/v1/academic/student/${studentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
      }
      
      setStatus('Account deleted successfully!');
      setStatusType('success');
      
      // Redirect after successful deletion
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      console.error('Delete failed:', err);
      setStatus('Failed to delete account.');
      setStatusType('error');
    }
    setShowDeleteConfirm(false);
  };

  // Show loading state while user data is being fetched
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#450063] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Show error if user authentication failed
  if (userError || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-red-800 mb-4">Authentication Error</h3>
            <p className="text-red-600 mb-6">
              {userError || 'Unable to load user data. Please try logging in again.'}
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show error if user is not a student
  if (userRole !== 'student') {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-yellow-800 mb-4">Access Restricted</h3>
            <p className="text-yellow-600 mb-6">
              Profile page is only available for students. Your current role is: {userRole}
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#450063] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-red-800 mb-4">Profile Not Found</h3>
            <p className="text-red-600 mb-6">
              {status || 'Unable to load your profile. Please try again.'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Status Message */}
            {status && (
              <div className={`mb-6 p-4 rounded-lg border ${
                statusType === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <div className="flex items-center space-x-2">
                  {statusType === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span className="font-medium">{status}</span>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#450063] to-[#9414d1] px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Student Profile</h2>
                      <p className="text-white/80">Manage your personal information</p>
                    </div>
                  </div>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="bg-white/20 hover:bg-white/30 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <Edit3 className="w-5 h-5" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Profile Form */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={student.first_name || ''}
                      onChange={handleChange}
                      disabled={!editMode}
                      className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 ${
                        editMode 
                          ? 'bg-white border-gray-300 focus:border-[#450063] focus:ring-2 focus:ring-[#450063]/20' 
                          : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={student.last_name || ''}
                      onChange={handleChange}
                      disabled={!editMode}
                      className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 ${
                        editMode 
                          ? 'bg-white border-gray-300 focus:border-[#450063] focus:ring-2 focus:ring-[#450063]/20' 
                          : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={student.email || ''}
                      onChange={handleChange}
                      disabled={!editMode}
                      className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 ${
                        editMode 
                          ? 'bg-white border-gray-300 focus:border-[#450063] focus:ring-2 focus:ring-[#450063]/20' 
                          : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone_number"
                      value={student.phone_number || ''}
                      onChange={handleChange}
                      disabled={!editMode}
                      className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 ${
                        editMode 
                          ? 'bg-white border-gray-300 focus:border-[#450063] focus:ring-2 focus:ring-[#450063]/20' 
                          : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={student.age || ''}
                      onChange={handleChange}
                      disabled={!editMode}
                      className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 ${
                        editMode 
                          ? 'bg-white border-gray-300 focus:border-[#450063] focus:ring-2 focus:ring-[#450063]/20' 
                          : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={student.role || ''}
                      disabled={true}
                      className="w-full px-4 py-3 border rounded-lg bg-gray-50 border-gray-200 text-gray-600"
                    />
                  </div>
                </div>

                {/* Address - Full Width */}
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Address
                  </label>
                  <textarea
                    name="address"
                    rows="3"
                    value={student.address || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 resize-none ${
                      editMode 
                        ? 'bg-white border-gray-300 focus:border-[#450063] focus:ring-2 focus:ring-[#450063]/20' 
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">
                  {editMode ? (
                    <>
                      <button
                        onClick={handleUpdate}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2"
                      >
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditMode(false);
                          setStatus('');
                          setStatusType('');
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2"
                      >
                        <X className="w-5 h-5" />
                        <span>Cancel</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditMode(true)}
                      className="bg-[#450063] hover:bg-[#350051] text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <Edit3 className="w-5 h-5" />
                      <span>Edit Profile</span>
                    </button>
                  )}

                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-800">Confirm Account Deletion</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to permanently delete your account? All your data, including sessions and progress, will be lost forever.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Yes, Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;