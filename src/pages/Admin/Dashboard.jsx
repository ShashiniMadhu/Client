import React, { useState, useEffect } from 'react';
import { User, Users, Plus, Check, X, BookOpen, UserCheck, Sparkles, TrendingUp, Award, Star, Calendar, Mail, Phone, MapPin, GraduationCap, Briefcase, DollarSign, ArrowRight } from 'lucide-react';

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [mentorForm, setMentorForm] = useState({
    first_name: '',
    last_name: '',
    address: '',
    email: '',
    title: '',
    profession: '',
    subject: '',
    phone_number: '',
    qualification: '',
    session_fee: '',
    password: '',
    role: 'mentor',
    bio: ''
  });

  const [classroomForm, setClassroomForm] = useState({
    title: '',
    enrolled_student_count: '',
    mentor: { mentor_id: '' }
  });

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/v1/academic/mentor');
      if (response.ok) {
        const data = await response.json();
        setMentors(data);
      } else {
        throw new Error('Failed to fetch mentors');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch mentors: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleMentorSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/v1/academic/mentor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...mentorForm,
          session_fee: parseFloat(mentorForm.session_fee)
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Mentor created successfully!' });
        setMentorForm({
          first_name: '',
          last_name: '',
          address: '',
          email: '',
          title: '',
          profession: '',
          subject: '',
          phone_number: '',
          qualification: '',
          session_fee: '',
          password: '',
          role: 'mentor',
          bio: ''
        });
        fetchMentors();
      } else {
        throw new Error('Failed to create mentor');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create mentor: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleClassroomSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/v1/academic/classroom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...classroomForm,
          enrolled_student_count: parseInt(classroomForm.enrolled_student_count),
          mentor: { mentor_id: parseInt(classroomForm.mentor.mentor_id) }
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Classroom created successfully!' });
        setClassroomForm({
          title: '',
          enrolled_student_count: '',
          mentor: { mentor_id: '' }
        });
        fetchMentors();
      } else {
        throw new Error('Failed to create classroom');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create classroom: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleMentorInputChange = (e) => {
    const { name, value } = e.target;
    setMentorForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClassroomInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mentor_id') {
      setClassroomForm(prev => ({
        ...prev,
        mentor: { mentor_id: value }
      }));
    } else {
      setClassroomForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const availableMentors = mentors.filter(mentor => !mentor.class_room_id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#280120] via-[#450063] to-[#9414d1] rounded-3xl p-8 mb-8">
          <div className="absolute inset-0">
            <div className="absolute top-4 right-4 w-32 h-32 bg-[#03b2ed]/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-40 h-40 bg-[#fd59ca]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl">
                  <Sparkles className="w-6 h-6 text-[#fd59ca]" />
                </div>
                <span className="text-white font-semibold">Admin Dashboard</span>
              </div>
              <h1 className="text-4xl font-black text-white mb-2">
                Welcome back, Admin
              </h1>
              <p className="text-white/80 text-lg">
                Manage your mentorship platform with powerful tools and insights
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl flex items-center justify-center">
                <UserCheck className="w-16 h-16 text-white/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 backdrop-blur-lg border ${
            message.type === 'success' 
              ? 'bg-emerald-50/80 text-emerald-800 border-emerald-200' 
              : 'bg-red-50/80 text-red-800 border-red-200'
          }`}>
            {message.type === 'success' ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 mb-8">
          <div className="flex flex-wrap border-b border-slate-200/50">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'mentors', label: 'Create Mentor', icon: User },
              { id: 'classrooms', label: 'Create Classroom', icon: BookOpen }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all duration-300 relative ${
                    activeTab === tab.id
                      ? 'text-[#9414d1] bg-gradient-to-r from-[#9414d1]/10 to-[#03b2ed]/10'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9414d1] to-[#03b2ed] rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Recent Activity */}
                  <div className="bg-gradient-to-br from-white/50 to-slate-50/50 backdrop-blur-lg rounded-2xl p-6 border border-white/30">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#9414d1]" />
                      Recent Activity
                    </h3>
                    <div className="space-y-4">
                      {[
                        { action: 'New mentor registered', name: 'Dr. Sarah Wilson', time: '2 hours ago', type: 'mentor' },
                        { action: 'Classroom created', name: 'Advanced Mathematics', time: '4 hours ago', type: 'classroom' },
                        { action: 'Student enrolled', name: 'John Doe', time: '6 hours ago', type: 'student' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-white/50 transition-colors">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.type === 'mentor' ? 'bg-blue-100 text-blue-600' :
                            activity.type === 'classroom' ? 'bg-purple-100 text-purple-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {activity.type === 'mentor' ? <User className="w-5 h-5" /> :
                             activity.type === 'classroom' ? <BookOpen className="w-5 h-5" /> :
                             <GraduationCap className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">{activity.action}</p>
                            <p className="text-sm text-slate-600">{activity.name}</p>
                          </div>
                          <span className="text-xs text-slate-500">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gradient-to-br from-white/50 to-slate-50/50 backdrop-blur-lg rounded-2xl p-6 border border-white/30">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#fd59ca]" />
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      {[
                        { title: 'Add New Mentor', desc: 'Register a new mentor to the platform', action: () => setActiveTab('mentors'), color: 'from-[#03b2ed] to-[#9414d1]' },
                        { title: 'Create Classroom', desc: 'Set up a new learning environment', action: () => setActiveTab('classrooms'), color: 'from-[#fd59ca] to-[#9414d1]' },
                        { title: 'View Reports', desc: 'Check platform analytics and insights', action: () => {}, color: 'from-[#9414d1] to-[#03b2ed]' }
                      ].map((action, index) => (
                        <button
                          key={index}
                          onClick={action.action}
                          className={`w-full p-4 rounded-xl bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-all duration-300 hover:scale-105 group`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-left">
                              <h4 className="font-semibold">{action.title}</h4>
                              <p className="text-sm text-white/80">{action.desc}</p>
                            </div>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'mentors' && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#03b2ed] to-[#9414d1] rounded-xl flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Create New Mentor</h2>
                    <p className="text-slate-600">Add a new mentor to expand your teaching capacity</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-[#9414d1]" />
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                        <select
                          name="title"
                          value={mentorForm.title}
                          onChange={handleMentorInputChange}
                          className="w-full px-4 py-3 bg-white/70 backdrop-blur-lg border border-white/30 rounded-xl focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-all duration-300"
                          required
                        >
                          <option value="">Select Title</option>
                          <option value="Dr.">Dr.</option>
                          <option value="Prof.">Prof.</option>
                          <option value="Mr.">Mr.</option>
                          <option value="Ms.">Ms.</option>
                          <option value="Mrs.">Mrs.</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                        <input
                          type="text"
                          name="first_name"
                          value={mentorForm.first_name}
                          onChange={handleMentorInputChange}
                          className="w-full px-4 py-3 bg-white/70 backdrop-blur-lg border border-white/30 rounded-xl focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-all duration-300"
                          placeholder="Enter first name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        value={mentorForm.last_name}
                        onChange={handleMentorInputChange}
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-lg border border-white/30 rounded-xl focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-all duration-300"
                        placeholder="Enter last name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#03b2ed]" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={mentorForm.email}
                        onChange={handleMentorInputChange}
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-lg border border-white/30 rounded-xl focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-all duration-300"
                        placeholder="mentor@skillmentor.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#03b2ed]" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={mentorForm.phone_number}
                        onChange={handleMentorInputChange}
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-lg border border-white/30 rounded-xl focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-all duration-300"
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#03b2ed]" />
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={mentorForm.address}
                        onChange={handleMentorInputChange}
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-lg border border-white/30 rounded-xl focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-all duration-300"
                        placeholder="Enter full address"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={mentorForm.password}
                        onChange={handleMentorInputChange}
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-lg border border-white/30 rounded-xl focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-all duration-300"
                        placeholder="Create secure password"
                        required
                      />
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-[#9414d1]" />
                      Professional Information
                    </h3>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={mentorForm.subject}
                        onChange={handleMentorInputChange}
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-lg border border-white/30 rounded-xl focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-all duration-300"
                        placeholder="e.g., Mathematics, Physics, Programming"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Profession</label>
                      <input
                        type="text"
                        name="profession"
                        value={mentorForm.profession}
                        onChange={handleMentorInputChange}
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-lg border border-white/30 rounded-xl focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-all duration-300"
                        placeholder="e.g., Software Engineer, Professor"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#03b2ed]" />
                        Qualification
                      </label>
                      <input
                        type="text"
                        name="qualification"
                        value={mentorForm.qualification}
                        onChange={handleMentorInputChange}
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-lg border border-white/30 rounded-xl focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-all duration-300"
                        placeholder="e.g., PhD in Computer Science, MSc Mathematics"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#03b2ed]" />
                        Session Fee (USD)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="session_fee"
                        value={mentorForm.session_fee}
                        onChange={handleMentorInputChange}
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-lg border border-white/30 rounded-xl focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-all duration-300"
                        placeholder="50.00"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
                      <textarea
                        name="bio"
                        value={mentorForm.bio}
                        onChange={handleMentorInputChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-lg border border-white/30 rounded-xl focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-all duration-300 resize-none"
                        placeholder="Tell us about your experience and expertise..."
                        required
                      />
                    </div>

                    <button
                      onClick={handleMentorSubmit}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#03b2ed] to-[#9414d1] hover:from-[#9414d1] hover:to-[#03b2ed] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating Mentor...
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          Create Mentor
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'classrooms' && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#fd59ca] to-[#9414d1] rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Create New Classroom</h2>
                    <p className="text-slate-600">Set up a new learning environment for students</p>
                  </div>
                </div>

                <div className="max-w-2xl space-y-6">
                  <div className="bg-gradient-to-br from-white/50 to-slate-50/50 backdrop-blur-lg rounded-2xl p-6 border border-white/30">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Classroom Title</label>
                        <input
                          type="text"
                          name="title"
                          value={classroomForm.title}
                          onChange={handleClassroomInputChange}
                          className="w-full px-4 py-3 bg-white/70 backdrop-blur-lg border border-white/30 rounded-xl focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-all duration-300"
                          placeholder="e.g., Advanced Mathematics Grade 12"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#03b2ed]" />
                          Enrolled Student Count
                        </label>
                        <input
                          type="number"
                          name="enrolled_student_count"
                          value={classroomForm.enrolled_student_count}
                          onChange={handleClassroomInputChange}
                          className="w-full px-4 py-3 bg-white/70 backdrop-blur-lg border border-white/30 rounded-xl focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-all duration-300"
                          min="1"
                          placeholder="25"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                          <User className="w-4 h-4 text-[#03b2ed]" />
                          Assign Mentor
                        </label>
                        <select
                          name="mentor_id"
                          value={classroomForm.mentor.mentor_id}
                          onChange={handleClassroomInputChange}
                          className="w-full px-4 py-3 bg-white/70 backdrop-blur-lg border border-white/30 rounded-xl focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-all duration-300"
                          required
                        >
                          <option value="">Select an available mentor</option>
                          {availableMentors.map(mentor => (
                            <option key={mentor.mentor_id} value={mentor.mentor_id}>
                              {mentor.title} {mentor.first_name} {mentor.last_name} - {mentor.subject}
                            </option>
                          ))}
                        </select>
                        
                        {availableMentors.length === 0 && (
                          <div className="mt-3 p-4 bg-amber-50/80 border border-amber-200 rounded-xl">
                            <p className="text-amber-700 text-sm font-medium">
                              No available mentors. All mentors are already assigned to classrooms.
                            </p>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={handleClassroomSubmit}
                        disabled={loading || availableMentors.length === 0}
                        className="w-full bg-gradient-to-r from-[#fd59ca] to-[#9414d1] hover:from-[#9414d1] hover:to-[#fd59ca] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Creating Classroom...
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-5 h-5" />
                            Create Classroom
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Available Mentors Display */}
                  {availableMentors.length > 0 && (
                    <div className="bg-gradient-to-br from-white/50 to-slate-50/50 backdrop-blur-lg rounded-2xl p-6 border border-white/30">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-[#fd59ca]" />
                        Available Mentors ({availableMentors.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableMentors.map(mentor => (
                          <div key={mentor.mentor_id} className="bg-white/60 backdrop-blur-lg p-4 rounded-xl border border-white/30 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#03b2ed] to-[#9414d1] rounded-xl flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900">
                                  {mentor.title} {mentor.first_name} {mentor.last_name}
                                </h4>
                                <p className="text-sm text-[#9414d1] font-semibold">{mentor.subject}</p>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{mentor.profession}</p>
                            <div className="flex items-center justify-between">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                Available
                              </span>
                              <span className="text-sm font-semibold text-slate-700">
                                ${mentor.session_fee}/session
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;