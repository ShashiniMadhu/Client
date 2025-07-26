import React, { useState } from 'react';
import { Calendar, Clock, User, Filter, Search, Grid3X3, List, MoreVertical, BookOpen } from 'lucide-react';

const StudentDashboard = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample course data
  const coursesData = [
    {
      id: 1,
      title: "AWS Developer Associate Exam Prep",
      mentor: "Michelle Burns",
      mentorImage: null,
      nextSession: "3/1/2025",
      status: "accepted",
      progress: 75,
      totalSessions: 12,
      completedSessions: 9
    },
    {
      id: 2,
      title: "AWS Machine Learning Specialty Certification Exam Prep",
      mentor: "Dr. Priya Sharma",
      mentorImage: null,
      nextSession: "3/3/2025",
      status: "pending",
      progress: 45,
      totalSessions: 16,
      completedSessions: 7
    },
    {
      id: 3,
      title: "Microsoft Cybersecurity Architect Expert Certification Exam Prep",
      mentor: "Scarlet Nexus",
      mentorImage: null,
      nextSession: "3/4/2024",
      status: "completed",
      progress: 100,
      totalSessions: 10,
      completedSessions: 10
    },
    {
      id: 4,
      title: "AWS Developer Associate Exam Prep",
      mentor: "Michelle Burns",
      mentorImage: null,
      nextSession: "7/8/2025",
      status: "pending",
      progress: 30,
      totalSessions: 12,
      completedSessions: 4
    }
  ];

  const statusConfig = {
    accepted: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Accepted'
    },
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Pending'
    },
    completed: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Completed'
    }
  };

  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.mentor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const CourseCard = ({ course }) => {
    const status = statusConfig[course.status];
    
    return (
      <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        </div>

        {/* Mentor Avatar */}
        <div className="flex items-start mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full border-2 border-white/30 flex items-center justify-center overflow-hidden">
            {course.mentorImage ? (
              <img src={course.mentorImage} alt={course.mentor} className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-white/80" />
            )}
          </div>
        </div>

        {/* Course Title */}
        <h3 className="text-xl font-semibold mb-2 leading-tight pr-16">
          {course.title}
        </h3>

        {/* Mentor Info */}
        <div className="flex items-center mb-4 text-white/90">
          <span className="text-sm">Mentor: {course.mentor}</span>
        </div>

        {/* Next Session */}
        <div className="flex items-center mb-4 text-white/90">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm">Next Session: {course.nextSession}</span>
        </div>

        {/* Progress Bar (for active/pending courses) */}
        {course.status !== 'completed' && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-white/90 mb-2">
              <span>Progress</span>
              <span>{course.completedSessions}/{course.totalSessions} sessions</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300" 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20">
          {course.status === 'completed' ? 'View Certificate' : 
           course.status === 'accepted' ? 'Continue Learning' : 'View Details'}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2">My Courses</h1>
              <p className="text-lg text-slate-600">Track your learning progress and upcoming sessions</p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl pl-12 pr-6 py-3 w-80 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
              >
                <option value="all">All Courses</option>
                <option value="accepted">Accepted</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>

              {/* View Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{coursesData.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {coursesData.filter(c => c.status === 'accepted').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {coursesData.filter(c => c.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {coursesData.filter(c => c.status === 'completed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
            : 'grid-cols-1 max-w-4xl mx-auto'
        }`}>
          {filteredCourses.map((course, index) => (
            <div 
              key={course.id} 
              className="animate-fade-in-up" 
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;