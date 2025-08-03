import React, { useState, useEffect } from 'react';
import { User, Search, Mail, Phone, BookOpen, Calendar, DollarSign, Eye, Edit, Trash2, Users, X, Loader, GraduationCap, MapPin } from 'lucide-react';

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState({ show: false, id: null });
  const [operationLoading, setOperationLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, sessionsRes] = await Promise.all([
        fetch('http://localhost:8080/api/v1/academic/student'),
        fetch('http://localhost:8080/api/v1/academic/session')
      ]);
      
      const [studentsData, sessionsData] = await Promise.all([
        studentsRes.json(),
        sessionsRes.json()
      ]);
      
      setStudents(studentsData);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isStudentBindWithSessions = (studentId) => {
    return sessions.some(session => session.student?.student_id === studentId);
  };

  const getStudentSessions = (studentId) => {
    return sessions.filter(session => session.student?.student_id === studentId);
  };

  const filteredStudents = students.filter(student =>
    student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (isStudentBindWithSessions(showDeletePopup.id)) {
      alert("Cannot delete student with active sessions.");
      setShowDeletePopup({ show: false, id: null });
      return;
    }

    setOperationLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/v1/academic/student/${showDeletePopup.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setStudents(prev => prev.filter(s => s.student_id !== showDeletePopup.id));
        setShowDeletePopup({ show: false, id: null });
        alert("Student deleted successfully!");
      } else {
        alert("Failed to delete student.");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Error deleting student. Please try again.");
    } finally {
      setOperationLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editedStudent.first_name?.trim() || !editedStudent.last_name?.trim()) {
      alert('Please enter student first and last name');
      return;
    }
    
    setOperationLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/v1/academic/student', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedStudent),
      });

      if (response.ok) {
        const updatedStudent = await response.json();
        setStudents(prev => prev.map(s => s.student_id === updatedStudent.student_id ? updatedStudent : s));
        setIsEditing(false);
        setSelectedStudent(updatedStudent);
        setEditedStudent(null);
        alert('Student updated successfully!');
      } else {
        const errorText = await response.text();
        console.error('Update failed:', errorText);
        alert("Update failed. See console for details.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Update failed due to network or server error.");
    } finally {
      setOperationLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#450063] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading students...</p>
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
              All Students
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage and view all registered students with comprehensive admin controls
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search students by name, email, phone, or grade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#450063] focus:border-transparent"
              />
            </div>
            <div className="mt-4 text-sm text-gray-500 text-center">
              Showing {filteredStudents.length} of {students.length} students
            </div>
          </div>

          {/* Students Grid */}
          {filteredStudents.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredStudents.map((student) => {
                const hasActiveSessions = isStudentBindWithSessions(student.student_id);
                const studentSessions = getStudentSessions(student.student_id);
                
                return (
                  <div key={student.student_id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    {/* Status Bar */}
                    <div className="h-1 bg-gradient-to-r from-[#450063] to-[#9414d1]"></div>
                    
                    {/* Header */}
                    <div className="p-6">
                      {/* Student Info */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                            {student.first_name} {student.last_name}
                          </h3>
                          <p className="text-sm text-gray-500">ID: #{student.student_id}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <div className="w-12 h-12 bg-[#450063] rounded-lg flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          {hasActiveSessions && (
                            <div className="bg-green-100 text-green-800 border border-green-200 px-2 py-1 rounded-full text-xs font-medium">
                              Active
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Grade and Contact Info */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-4 h-4 text-[#450063]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Grade {student.grade}</p>
                            <p className="text-xs text-gray-500">Academic Level</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Mail className="w-4 h-4 text-[#450063]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{student.email}</p>
                            <p className="text-xs text-gray-500">Email</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Phone className="w-4 h-4 text-[#450063]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{student.phone_number}</p>
                            <p className="text-xs text-gray-500">Phone</p>
                          </div>
                        </div>

                        {student.date_of_birth && (
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-[#450063]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {new Date(student.date_of_birth).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-500">Date of Birth</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Sessions Count */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-100">
                        <div className="flex items-center justify-center space-x-3">
                          <Users className="w-6 h-6 text-[#450063]" />
                          <span className="text-2xl font-bold text-gray-900">
                            {studentSessions.length}
                          </span>
                          <span className="text-gray-600">sessions</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => setSelectedStudent(student)}
                          className="flex-1 bg-gradient-to-r from-[#450063] to-[#9414d1] hover:from-[#350051] hover:to-[#7c3aed] text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        
                        <button 
                          onClick={() => {
                            setSelectedStudent(student);
                            setEditedStudent(student);
                            setIsEditing(true);
                          }}
                          className="py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button 
                          onClick={() => setShowDeletePopup({ show: true, id: student.student_id })}
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
                            Student has active sessions - deletion disabled
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
          {filteredStudents.length === 0 && students.length === 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No students found</h3>
                <p className="text-gray-600 mb-6">
                  There are currently no students in the system. Students will appear here once they are registered.
                </p>
              </div>
            </div>
          )}

          {filteredStudents.length === 0 && students.length > 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No students found</h3>
                <p className="text-gray-600 mb-6">
                  No students match your current search criteria. Try adjusting your search terms.
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

          {/* Delete Confirmation Popup */}
          {showDeletePopup.show && (
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
                      Are you sure you want to delete this student?
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-yellow-800 text-sm font-medium">
                        ⚠️ This action cannot be undone and will permanently remove all student data.
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowDeletePopup({ show: false, id: null })}
                      className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
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
                          <span>Yes, Delete Student</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Student Detail Modal */}
          {selectedStudent && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-[#280120] via-[#450063] to-[#9414d1] p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                      {isEditing ? 'Edit Student' : 'Student Details'}
                    </h2>
                    <button
                      onClick={() => {
                        setSelectedStudent(null);
                        setIsEditing(false);
                        setEditedStudent(null);
                      }}
                      className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {isEditing ? (
                    <>
                      {/* EDIT MODE FORM */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-semibold text-slate-500">First Name</label>
                          <input
                            type="text"
                            value={editedStudent.first_name || ''}
                            onChange={(e) => setEditedStudent({...editedStudent, first_name: e.target.value})}
                            className="w-full border border-slate-300 rounded p-2 mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-slate-500">Last Name</label>
                          <input
                            type="text"
                            value={editedStudent.last_name || ''}
                            onChange={(e) => setEditedStudent({...editedStudent, last_name: e.target.value})}
                            className="w-full border border-slate-300 rounded p-2 mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-slate-500">Email</label>
                          <input
                            type="email"
                            value={editedStudent.email || ''}
                            onChange={(e) => setEditedStudent({...editedStudent, email: e.target.value})}
                            className="w-full border border-slate-300 rounded p-2 mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-slate-500">Phone</label>
                          <input
                            type="text"
                            value={editedStudent.phone_number || ''}
                            onChange={(e) => setEditedStudent({...editedStudent, phone_number: e.target.value})}
                            className="w-full border border-slate-300 rounded p-2 mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-slate-500">Grade</label>
                          <input
                            type="text"
                            value={editedStudent.grade || ''}
                            onChange={(e) => setEditedStudent({...editedStudent, grade: e.target.value})}
                            className="w-full border border-slate-300 rounded p-2 mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-slate-500">Date of Birth</label>
                          <input
                            type="date"
                            value={editedStudent.date_of_birth ? editedStudent.date_of_birth.split('T')[0] : ''}
                            onChange={(e) => setEditedStudent({...editedStudent, date_of_birth: e.target.value})}
                            className="w-full border border-slate-300 rounded p-2 mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-slate-500">Address</label>
                        <textarea
                          value={editedStudent.address || ''}
                          onChange={(e) => setEditedStudent({...editedStudent, address: e.target.value})}
                          className="w-full border border-slate-300 rounded p-2 mt-1"
                          rows={3}
                        />
                      </div>

                      <div className="flex justify-end space-x-4 mt-6">
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditedStudent(null);
                          }}
                          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdate}
                          disabled={operationLoading}
                          className="px-4 py-2 rounded bg-[#9414d1] hover:bg-[#7a0eb0] text-white disabled:opacity-50"
                        >
                          {operationLoading ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* VIEW MODE CONTENT */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-semibold text-slate-500">Full Name</label>
                          <p className="text-lg text-slate-800">{selectedStudent.first_name} {selectedStudent.last_name}</p>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-slate-500">Grade</label>
                          <p className="text-slate-800 font-semibold">Grade {selectedStudent.grade}</p>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-slate-500">Email</label>
                          <p className="text-slate-800">{selectedStudent.email}</p>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-slate-500">Phone</label>
                          <p className="text-slate-800">{selectedStudent.phone_number}</p>
                        </div>

                        {selectedStudent.date_of_birth && (
                          <div>
                            <label className="text-sm font-semibold text-slate-500">Date of Birth</label>
                            <p className="text-slate-800">{new Date(selectedStudent.date_of_birth).toLocaleDateString()}</p>
                          </div>
                        )}

                        <div>
                          <label className="text-sm font-semibold text-slate-500">Sessions Enrolled</label>
                          <p className="text-slate-800 font-bold text-[#9414d1]">
                            {getStudentSessions(selectedStudent.student_id).length} sessions
                          </p>
                        </div>
                      </div>

                      {selectedStudent.address && (
                        <div>
                          <label className="text-sm font-semibold text-slate-500">Address</label>
                          <p className="text-slate-800 bg-slate-50 rounded-xl p-4">{selectedStudent.address}</p>
                        </div>
                      )}

                      {/* Sessions List */}
                      {getStudentSessions(selectedStudent.student_id).length > 0 && (
                        <div>
                          <label className="text-sm font-semibold text-slate-500 mb-3 block">Enrolled Sessions</label>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {getStudentSessions(selectedStudent.student_id).slice(0, 5).map((session) => (
                              <div key={session.session_id} className="bg-slate-50 rounded-lg p-3 text-sm">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">Session #{session.session_id}</span>
                                  <span className="text-slate-500">{session.date}</span>
                                </div>
                                {session.mentor && (
                                  <p className="text-slate-600">
                                    Mentor: {session.mentor.first_name} {session.mentor.last_name} - {session.mentor.subject}
                                  </p>
                                )}
                                {session.class_room && (
                                  <p className="text-slate-600">Classroom: {session.class_room.title}</p>
                                )}
                              </div>
                            ))}
                            {getStudentSessions(selectedStudent.student_id).length > 5 && (
                              <p className="text-xs text-slate-500 text-center">
                                +{getStudentSessions(selectedStudent.student_id).length - 5} more sessions
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllStudents;