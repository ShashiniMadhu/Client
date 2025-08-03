import React, { useState, useEffect } from 'react';
import { User, Users, Plus, Check, X, BookOpen, UserCheck, Sparkles, TrendingUp, Award, Star, Calendar, Mail, Phone, MapPin, GraduationCap, Briefcase, DollarSign, ArrowRight, Building2, Clock, BarChart3 } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#280120] via-[#450063] to-[#9414d1] rounded-2xl shadow-2xl mb-8">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#03b2ed]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#fd59ca]/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative px-8 py-12">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Administrative Dashboard</h1>
                    <p className="text-white/80 text-lg">Comprehensive platform management and insights</p>
                  </div>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm font-medium">Total Mentors</p>
                        <p className="text-2xl font-bold text-white">{mentors.length}</p>
                      </div>
                      <div className="p-2 bg-[#03b2ed]/20 rounded-lg">
                        <User className="w-5 h-5 text-[#03b2ed]" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm font-medium">Available</p>
                        <p className="text-2xl font-bold text-white">{availableMentors.length}</p>
                      </div>
                      <div className="p-2 bg-[#fd59ca]/20 rounded-lg">
                        <UserCheck className="w-5 h-5 text-[#fd59ca]" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm font-medium">Active Sessions</p>
                        <p className="text-2xl font-bold text-white">24</p>
                      </div>
                      <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-emerald-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-4 flex justify-center lg:justify-end">
                <div className="w-48 h-48 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-[#03b2ed]/30 to-[#fd59ca]/30 rounded-full flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border shadow-sm ${
            message.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            {message.type === 'success' ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Navigation and Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
          {/* Tab Navigation */}
          <div className="border-b border-slate-200">
            <nav className="flex">
              {[
                { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
                { id: 'mentors', label: 'Mentor Management', icon: User },
                { id: 'classrooms', label: 'Classroom Setup', icon: BookOpen }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-8 py-6 font-semibold transition-all duration-200 relative border-b-2 ${
                      activeTab === tab.id
                        ? 'text-[#9414d1] border-[#9414d1] bg-[#9414d1]/5'
                        : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:block">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Performance Metrics */}
                  <div className="lg:col-span-2 bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-[#9414d1]" />
                        Platform Analytics
                      </h3>
                      <select className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label: 'New Students', value: '142', change: '+12%', positive: true },
                        { label: 'Sessions Completed', value: '89', change: '+8%', positive: true },
                        { label: 'Revenue Generated', value: '$12.4K', change: '+15%', positive: true },
                        { label: 'Satisfaction Rate', value: '4.8/5', change: '+0.2', positive: true }
                      ].map((metric, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-slate-200">
                          <p className="text-sm font-medium text-slate-600 mb-1">{metric.label}</p>
                          <p className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</p>
                          <p className={`text-xs font-medium ${metric.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                            {metric.change} vs last period
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-[#fd59ca]" />
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      {[
                        { title: 'Add New Mentor', desc: 'Register qualified mentor', action: () => setActiveTab('mentors'), gradient: 'from-[#03b2ed] to-[#9414d1]' },
                        { title: 'Create Classroom', desc: 'Setup learning environment', action: () => setActiveTab('classrooms'), gradient: 'from-[#fd59ca] to-[#9414d1]' },
                        { title: 'Generate Reports', desc: 'Export analytics data', action: () => {}, gradient: 'from-[#9414d1] to-[#03b2ed]' }
                      ].map((action, index) => (
                        <button
                          key={index}
                          onClick={action.action}
                          className={`w-full p-4 rounded-lg bg-gradient-to-r ${action.gradient} text-white hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 group text-left`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-sm">{action.title}</h4>
                              <p className="text-xs text-white/80 mt-1">{action.desc}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-[#9414d1]" />
                    Recent Platform Activity
                  </h3>
                  <div className="grid lg:grid-cols-2 gap-6">
                    {[
                      { action: 'New mentor registered', name: 'Dr. Sarah Wilson', time: '2 hours ago', type: 'mentor' },
                      { action: 'Classroom created', name: 'Advanced Mathematics', time: '4 hours ago', type: 'classroom' },
                      { action: 'Student enrolled', name: 'John Doe', time: '6 hours ago', type: 'student' },
                      { action: 'Session completed', name: 'Physics 101', time: '8 hours ago', type: 'session' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-slate-200 hover:shadow-sm transition-shadow">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          activity.type === 'mentor' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'classroom' ? 'bg-purple-100 text-purple-600' :
                          activity.type === 'student' ? 'bg-green-100 text-green-600' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          {activity.type === 'mentor' ? <User className="w-5 h-5" /> :
                           activity.type === 'classroom' ? <BookOpen className="w-5 h-5" /> :
                           activity.type === 'student' ? <GraduationCap className="w-5 h-5" /> :
                           <Clock className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 text-sm">{activity.action}</p>
                          <p className="text-slate-600 text-sm">{activity.name}</p>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'mentors' && (
              <div>
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#03b2ed] to-[#9414d1] rounded-xl flex items-center justify-center">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Mentor Registration</h2>
                      <p className="text-slate-600">Add qualified mentors to expand platform capacity</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <User className="w-5 h-5 text-[#9414d1]" />
                      Personal Details
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                          <select
                            name="title"
                            value={mentorForm.title}
                            onChange={handleMentorInputChange}
                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-colors"
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
                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-colors"
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
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-colors"
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
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-colors"
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
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-colors"
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
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-colors"
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
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-colors"
                          placeholder="Create secure password"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-[#9414d1]" />
                      Professional Credentials
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Subject Specialization</label>
                        <input
                          type="text"
                          name="subject"
                          value={mentorForm.subject}
                          onChange={handleMentorInputChange}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-colors"
                          placeholder="e.g., Mathematics, Physics, Programming"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Current Profession</label>
                        <input
                          type="text"
                          name="profession"
                          value={mentorForm.profession}
                          onChange={handleMentorInputChange}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-colors"
                          placeholder="e.g., Software Engineer, Professor"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-[#03b2ed]" />
                          Academic Qualification
                        </label>
                        <input
                          type="text"
                          name="qualification"
                          value={mentorForm.qualification}
                          onChange={handleMentorInputChange}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-colors"
                          placeholder="e.g., PhD in Computer Science, MSc Mathematics"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-[#03b2ed]" />
                          Session Fee (USD)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="session_fee"
                          value={mentorForm.session_fee}
                          onChange={handleMentorInputChange}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-colors"
                          placeholder="50.00"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Professional Bio</label>
                        <textarea
                          name="bio"
                          value={mentorForm.bio}
                          onChange={handleMentorInputChange}
                          rows={4}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-colors resize-none"
                          placeholder="Brief description of experience and expertise..."
                          required
                        />
                      </div>

                      <button
                        onClick={handleMentorSubmit}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#03b2ed] to-[#9414d1] hover:from-[#9414d1] hover:to-[#03b2ed] text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing Registration...
                          </>
                        ) : (
                          <>
                            <Plus className="w-5 h-5" />
                            Register Mentor
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'classrooms' && (
              <div>
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#fd59ca] to-[#9414d1] rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Classroom Management</h2>
                      <p className="text-slate-600">Create and configure new learning environments</p>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Classroom Form */}
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#9414d1]" />
                      Setup New Classroom
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Classroom Title</label>
                        <input
                          type="text"
                          name="title"
                          value={classroomForm.title}
                          onChange={handleClassroomInputChange}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-colors"
                          placeholder="e.g., Advanced Mathematics Grade 12"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#03b2ed]" />
                          Student Capacity
                        </label>
                        <input
                          type="number"
                          name="enrolled_student_count"
                          value={classroomForm.enrolled_student_count}
                          onChange={handleClassroomInputChange}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-colors"
                          min="1"
                          placeholder="25"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                          <User className="w-4 h-4 text-[#03b2ed]" />
                          Assigned Mentor
                        </label>
                        <select
                          name="mentor_id"
                          value={classroomForm.mentor.mentor_id}
                          onChange={handleClassroomInputChange}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#9414d1] focus:border-[#9414d1] transition-colors"
                          required
                        >
                          <option value="">Select available mentor</option>
                          {availableMentors.map(mentor => (
                            <option key={mentor.mentor_id} value={mentor.mentor_id}>
                              {mentor.title} {mentor.first_name} {mentor.last_name} - {mentor.subject}
                            </option>
                          ))}
                        </select>
                        
                        {availableMentors.length === 0 && (
                          <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start gap-3">
                              <div className="w-5 h-5 text-amber-600 mt-0.5">⚠️</div>
                              <div>
                                <p className="text-amber-800 text-sm font-semibold">No Available Mentors</p>
                                <p className="text-amber-700 text-sm mt-1">All mentors are currently assigned to classrooms. Please add new mentors first.</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={handleClassroomSubmit}
                        disabled={loading || availableMentors.length === 0}
                        className="w-full bg-gradient-to-r from-[#fd59ca] to-[#9414d1] hover:from-[#9414d1] hover:to-[#fd59ca] text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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

                  {/* Available Mentors */}
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Star className="w-5 h-5 text-[#fd59ca]" />
                      Available Mentors ({availableMentors.length})
                    </h3>
                    
                    {availableMentors.length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {availableMentors.map(mentor => (
                          <div key={mentor.mentor_id} className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-sm transition-shadow">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#03b2ed] to-[#9414d1] rounded-lg flex items-center justify-center flex-shrink-0">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-bold text-slate-900 truncate">
                                    {mentor.title} {mentor.first_name} {mentor.last_name}
                                  </h4>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 flex-shrink-0 ml-2">
                                    Available
                                  </span>
                                </div>
                                <p className="text-sm font-semibold text-[#9414d1] mb-1">{mentor.subject}</p>
                                <p className="text-sm text-slate-600 mb-2 truncate">{mentor.profession}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-slate-500">{mentor.qualification}</span>
                                  <span className="text-sm font-bold text-slate-900">
                                    ${mentor.session_fee}/session
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <User className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-600 font-medium">No Available Mentors</p>
                        <p className="text-slate-500 text-sm mt-1">Add new mentors to assign them to classrooms</p>
                        <button
                          onClick={() => setActiveTab('mentors')}
                          className="mt-4 px-4 py-2 bg-[#9414d1] text-white rounded-lg text-sm font-medium hover:bg-[#7a11a8] transition-colors"
                        >
                          Add New Mentor
                        </button>
                      </div>
                    )}
                  </div>
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