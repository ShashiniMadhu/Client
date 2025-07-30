import React, { useState, useEffect } from 'react';
import { GraduationCap, Search, Mail, Phone, MapPin, User, Eye, Edit, Trash2, Plus } from 'lucide-react';

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/academic/student');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
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
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">All Students</h1>
                <p className="text-white/80">Manage and view all registered students</p>
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
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#9414d1] focus:border-transparent outline-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div key={student.student_id} className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {student.first_name} {student.last_name}
                      </h3>
                      <p className="text-white/80 text-sm">Student ID: {student.student_id}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-slate-600">
                    <Mail className="w-4 h-4 text-[#9414d1]" />
                    <span className="text-sm">{student.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-slate-600">
                    <Phone className="w-4 h-4 text-[#03b2ed]" />
                    <span className="text-sm">{student.phone_number}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-slate-600">
                    <MapPin className="w-4 h-4 text-[#fd59ca]" />
                    <span className="text-sm">{student.address}</span>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold">Age:</span> {student.age}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2 mt-6">
                  <button 
                    onClick={() => setSelectedStudent(student)}
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

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="w-24 h-24 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-500 mb-2">No students found</h3>
            <p className="text-slate-400">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Student Detail Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Student Details</h2>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-500">Full Name</label>
                  <p className="text-lg text-slate-800">{selectedStudent.first_name} {selectedStudent.last_name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-slate-500">Email</label>
                  <p className="text-slate-800">{selectedStudent.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-slate-500">Phone</label>
                  <p className="text-slate-800">{selectedStudent.phone_number}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-slate-500">Address</label>
                  <p className="text-slate-800">{selectedStudent.address}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-slate-500">Age</label>
                  <p className="text-slate-800">{selectedStudent.age}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-slate-500">Role</label>
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {selectedStudent.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllStudents;