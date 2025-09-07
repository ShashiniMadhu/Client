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
  const [statusType, setStatusType] = useState('');

  // Helper method to clear status after delay
  const clearStatus = (delay = 3000) => {
    setTimeout(() => {
      setStatus('');
      setStatusType('');
    }, delay);
  };

  // Helper method to set status
  const setStatusMessage = (message, type) => {
    setStatus(message);
    setStatusType(type);
  };

  // Helper method to handle redirects
  const redirectTo = (path, delay = 0) => {
    setTimeout(() => {
      window.location.href = path;
    }, delay);
  };

  // Fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      if (userLoading) return;
      
      if (userError) {
        setStatusMessage(`Authentication error: ${userError}`, 'error');
        setLoading(false);
        return;
      }
      
      if (!userData || userRole !== 'student') {
        setStatusMessage('Only students can access this profile', 'error');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/academic/student/${userData.student_id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch student data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setStudent(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch student data:', err);
        setStatusMessage('Failed to load profile.', 'error');
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
      });
      
      if (!response.ok) {
        throw new Error(`Update failed: ${response.status} ${response.statusText}`);
      }
      
      setStatusMessage('Profile updated successfully!', 'success');
      setEditMode(false);
      clearStatus();
    } catch (err) {
      console.error('Update failed:', err);
      setStatusMessage('Failed to update profile.', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/academic/student/${userData.student_id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
      }
      
      setStatusMessage('Account deleted successfully!', 'success');
      redirectTo('/', 2000);
    } catch (err) {
      console.error('Delete failed:', err);
      setStatusMessage('Failed to delete account.', 'error');
    }
    setShowDeleteConfirm(false);
  };

  // Render error/loading states
  const renderErrorState = (icon, title, message, buttonText, buttonAction, bgColor = 'red') => (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="max-w-2xl mx-auto">
        <div className={`bg-${bgColor}-50 border border-${bgColor}-200 rounded-lg p-8 text-center`}>
          {icon}
          <h3 className={`text-2xl font-bold text-${bgColor}-800 mb-4`}>{title}</h3>
          <p className={`text-${bgColor}-600 mb-6`}>{message}</p>
          <button 
            onClick={buttonAction}
            className={`bg-${bgColor}-600 hover:bg-${bgColor}-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );

  const renderLoadingState = (message) => (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="text-center">
        <Loader className="w-12 h-12 text-[#450063] animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  );

  // Render form field
  const renderField = (name, label, icon, type = 'text', disabled = false, rows = null) => {
    const inputClass = `w-full px-4 py-3 border rounded-lg transition-all duration-300 ${
      editMode && !disabled
        ? 'bg-white border-gray-300 focus:border-[#450063] focus:ring-2 focus:ring-[#450063]/20' 
        : 'bg-gray-50 border-gray-200 text-gray-600'
    }`;

    const InputComponent = rows ? 'textarea' : 'input';
    
    return (
      <div className={rows ? 'mt-6' : ''}>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {icon && <span className="w-4 h-4 inline mr-2">{icon}</span>}
          {label}
        </label>
        <InputComponent
          type={!rows ? type : undefined}
          rows={rows}
          name={name}
          value={student[name] || ''}
          onChange={handleChange}
          disabled={!editMode || disabled}
          className={`${inputClass}${rows ? ' resize-none' : ''}`}
        />
      </div>
    );
  };

  // Early returns for different states
  if (userLoading) return renderLoadingState('Loading user data...');
  
  if (userError || !userData) {
    return renderErrorState(
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />,
      'Authentication Error',
      userError || 'Unable to load user data. Please try logging in again.',
      'Return to Home',
      () => redirectTo('/')
    );
  }

  if (userRole !== 'student') {
    return renderErrorState(
      <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />,
      'Access Restricted',
      `Profile page is only available for students. Your current role is: ${userRole}`,
      'Return to Home',
      () => redirectTo('/'),
      'yellow'
    );
  }

  if (loading) return renderLoadingState('Loading profile...');

  if (!student) {
    return renderErrorState(
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />,
      'Profile Not Found',
      status || 'Unable to load your profile. Please try again.',
      'Retry',
      () => window.location.reload()
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                  {renderField('first_name', 'First Name', <User className="w-4 h-4" />)}
                  {renderField('last_name', 'Last Name', <User className="w-4 h-4" />)}
                  {renderField('email', 'Email Address', <Mail className="w-4 h-4" />, 'email')}
                  {renderField('phone_number', 'Phone Number', <Phone className="w-4 h-4" />)}
                  {renderField('age', 'Age', <Calendar className="w-4 h-4" />, 'number')}
                  {renderField('role', 'Role', null, 'text', true)}
                </div>

                {/* Address - Full Width */}
                {renderField('address', 'Address', <MapPin className="w-4 h-4" />, 'text', false, 3)}

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