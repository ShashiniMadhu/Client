import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentProfile = () => {
  const studentId = 1; // Temporary hardcoded ID
  const [student, setStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  // Fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/v1/academic/student/${studentId}`);
        setStudent(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch student data:', err);
        setStatus('Failed to load profile.');
      }
    };
    fetchStudent();
  }, [studentId]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8080/api/v1/academic/student`, student);
      setStatus('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      console.error('Update failed:', err);
      setStatus('Failed to update profile.');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/academic/student/${studentId}`);
      setStatus('Account deleted successfully!');
      // Optionally redirect or clear session
    } catch (err) {
      console.error('Delete failed:', err);
      setStatus('Failed to delete account.');
    }
    setShowDeleteConfirm(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4 text-[#280120]">Student Profile</h2>

      {status && <p className="mb-4 text-sm text-blue-600">{status}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['first_name', 'last_name', 'email', 'phone_number', 'address', 'age', 'role'].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 capitalize">{field.replace('_', ' ')}:</label>
            <input
              type={field === 'age' ? 'number' : 'text'}
              name={field}
              value={student[field]}
              onChange={handleChange}
              disabled={!editMode}
              className={`w-full mt-1 p-2 border rounded-md ${
                editMode ? 'bg-white' : 'bg-gray-100 text-gray-600'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex space-x-3 mt-6">
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleUpdate}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Save Changes
          </button>
        )}

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Delete Account
        </button>

        {editMode && (
          <button
            onClick={() => setEditMode(false)}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-sm shadow-lg">
            <h3 className="text-xl font-semibold mb-2 text-red-600">Confirm Deletion</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to delete your account? This action is irreversible.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
