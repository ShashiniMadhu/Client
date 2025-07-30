import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Users, BookOpen } from 'lucide-react';

const ClassroomManager = () => {
  const [classroom, setClassroom] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({ title: '', enrolled_student_count: '' });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const mentorId = 1;

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
      } else {
        setClassroom(null);
      }
    } catch (error) {
      console.error('Error fetching classroom:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9414d1] mx-auto mb-4"></div>
          <p className="text-slate-600">Loading classroom...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="relative bg-gradient-to-br from-[#280120] via-[#450063] to-[#9414d1] py-16 px-6 text-center">
        <h1 className="text-5xl font-black text-white mb-4">
          My <span className="bg-gradient-to-r from-[#03b2ed] via-[#fd59ca] to-[#03b2ed] bg-clip-text text-transparent">Classroom</span>
        </h1>
        <p className="text-xl text-white/80 font-medium">View your assigned classroom</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {!classroom ? (
          <div className="text-center py-16">
            <BookOpen className="w-20 h-20 text-slate-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">No Assigned Classroom</h2>
            <p className="text-slate-600">You have not been assigned to any class yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <h3 className="text-2xl font-bold text-[#280120] mb-6">Classroom Details</h3>
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
      </div>
    </div>
  );
};

export default ClassroomManager;
