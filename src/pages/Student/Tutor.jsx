import React, { useState } from 'react';
import { Users, Search, Filter, Grid3X3, List, Sparkles, ArrowUpRight, BookOpen, Award, TrendingUp, ChevronDown, Calendar, Star, Clock, ChevronRight, ChevronLeft, X, User, Briefcase } from 'lucide-react';
import ClassCardComponent from '../../components/classCard'; // Adjust the import path as necessary

// Main Enhanced TutorPage Component
const TutorPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Enhanced classes data with all required fields for ClassCard
  const classesData = [
    {
      id: 1,
      courseName: "AWS Developer Associate Exam Prep",
      logo: null,
      positiveReviews: 99,
      mentorName: "Michelle Burns",
      mentorPosition: "Tech Lead at IFS",
      mentorExperience: "Tutor since 2018",
      description: "Hi I'm Michelle. Language lover and tutor of English. I specialize in AWS certification preparation and have helped over 150 students achieve their AWS Developer Associate certification. My approach focuses on hands-on practice and real-world scenarios.",
      highlights: [
        { icon: <Users className="w-3 h-3 text-blue-600" />, text: "158 Enrollments" },
        { icon: <Star className="w-3 h-3 text-amber-500 fill-current" />, text: "4.9 Rating" },
        { icon: <Award className="w-3 h-3 text-emerald-600" />, text: "95% Pass Rate" }
      ]
    },
    {
      id: 2,
      courseName: "AWS DevOps Engineering",
      logo: null,
      positiveReviews: 97,
      mentorName: "David Chen",
      mentorPosition: "Senior DevOps Engineer at Amazon",
      mentorExperience: "Tutor since 2019",
      description: "Expert DevOps engineer with 8+ years of experience in cloud infrastructure and automation. I help students master CI/CD pipelines, infrastructure as code, and container orchestration with real-world projects.",
      highlights: [
        { icon: <Users className="w-3 h-3 text-blue-600" />, text: "175 Enrollments" },
        { icon: <Star className="w-3 h-3 text-amber-500 fill-current" />, text: "4.8 Rating" },
        { icon: <Award className="w-3 h-3 text-emerald-600" />, text: "92% Pass Rate" }
      ]
    },
    {
      id: 3,
      courseName: "AWS Machine Learning",
      logo: null,
      positiveReviews: 95,
      mentorName: "Sarah Johnson",
      mentorPosition: "ML Engineer at Google",
      mentorExperience: "Tutor since 2020",
      description: "Passionate about making machine learning accessible to everyone. I specialize in AWS ML services including SageMaker, Comprehend, and Rekognition with practical, hands-on learning approaches.",
      highlights: [
        { icon: <Users className="w-3 h-3 text-blue-600" />, text: "142 Enrollments" },
        { icon: <Star className="w-3 h-3 text-amber-500 fill-current" />, text: "4.9 Rating" },
        { icon: <Award className="w-3 h-3 text-emerald-600" />, text: "98% Pass Rate" }
      ]
    },
    {
      id: 4,
      courseName: "React Advanced Patterns",
      logo: null,
      positiveReviews: 93,
      mentorName: "Alex Rodriguez",
      mentorPosition: "Senior Frontend Developer at Meta",
      mentorExperience: "Tutor since 2021",
      description: "Frontend specialist with deep expertise in React ecosystem. I focus on advanced patterns, performance optimization, and modern development practices that are used in production at top tech companies.",
      highlights: [
        { icon: <Users className="w-3 h-3 text-blue-600" />, text: "89 Enrollments" },
        { icon: <Star className="w-3 h-3 text-amber-500 fill-current" />, text: "4.7 Rating" },
        { icon: <Award className="w-3 h-3 text-emerald-600" />, text: "90% Pass Rate" }
      ]
    },
    {
      id: 5,
      courseName: "Node.js Microservices",
      logo: null,
      positiveReviews: 91,
      mentorName: "Michael Thompson",
      mentorPosition: "Backend Architect at Netflix",
      mentorExperience: "Tutor since 2017",
      description: "Backend architecture expert with extensive experience in building scalable microservices. I teach practical approaches to Node.js, Docker, API design, and distributed systems architecture.",
      highlights: [
        { icon: <Users className="w-3 h-3 text-blue-600" />, text: "67 Enrollments" },
        { icon: <Star className="w-3 h-3 text-amber-500 fill-current" />, text: "4.6 Rating" },
        { icon: <Award className="w-3 h-3 text-emerald-600" />, text: "88% Pass Rate" }
      ]
    },
    {
      id: 6,
      courseName: "Python Data Science",
      logo: null,
      positiveReviews: 96,
      mentorName: "Dr. Emily Watson",
      mentorPosition: "Data Scientist at Microsoft",
      mentorExperience: "Tutor since 2016",
      description: "PhD in Statistics with 10+ years in data science. I guide students through the complete data science workflow using Python, from data collection and cleaning to advanced machine learning and visualization.",
      highlights: [
        { icon: <Users className="w-3 h-3 text-blue-600" />, text: "203 Enrollments" },
        { icon: <Star className="w-3 h-3 text-amber-500 fill-current" />, text: "4.8 Rating" },
        { icon: <Award className="w-3 h-3 text-emerald-600" />, text: "94% Pass Rate" }
      ]
    }
  ];

  const filteredClasses = classesData.filter(classData =>
    classData.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classData.mentorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#280120] via-[#450063] to-[#9414d1]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#03b2ed]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#fd59ca]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            {/* Floating Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full px-6 py-3 mb-8">
              <Sparkles className="w-5 h-5 text-[#fd59ca]" />
              <span className="text-white font-semibold">Premium Learning Experience</span>
            </div>

            <h1 className="text-7xl font-black text-white mb-6 leading-tight">
              Find your
              <span className="block bg-gradient-to-r from-[#03b2ed] via-[#fd59ca] to-[#03b2ed] bg-clip-text text-transparent animate-pulse">
                SkillMentor
              </span>
            </h1>
            
            <p className="text-2xl text-white/80 font-medium max-w-3xl mx-auto mb-12 leading-relaxed">
              Empower your career with personalized mentorship for AWS Developer Associate, Interview Prep, and cutting-edge technologies.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group relative bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] hover:from-[#fd59ca] hover:to-[#03b2ed] text-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 overflow-hidden">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  <BookOpen className="w-6 h-6" />
                  <span className="text-xl">Start Learning</span>
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </div>
              </button>
              
              <button className="group bg-white/20 backdrop-blur-lg border border-white/30 hover:bg-white/30 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6" />
                  <span className="text-xl">Browse Mentors</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Cards Preview */}
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 hidden lg:block">
          <div className="flex space-x-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-64 h-40 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/50 p-6 animate-float" style={{animationDelay: `${i * 0.5}s`}}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#9414d1] to-[#03b2ed] rounded-xl"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-100 rounded"></div>
                  <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Controls Section */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black text-[#280120] mb-2">Schedule a Call</h2>
            <p className="text-lg text-gray-600 font-medium">Choose from our premium course collection</p>
          </div>

          {/* Enhanced Controls */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border-2 border-gray-200 focus:border-[#03b2ed] rounded-2xl pl-12 pr-6 py-3 w-80 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#03b2ed]/20 transition-all duration-300 shadow-sm"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center space-x-2 bg-white border-2 border-gray-200 hover:border-[#9414d1] px-6 py-3 rounded-2xl transition-all duration-300 shadow-sm"
              >
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-700">Filter</span>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${filterOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-2xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all duration-200 ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#9414d1]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all duration-200 ${viewMode === 'list' ? 'bg-white shadow-sm text-[#9414d1]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Cards Grid */}
        <div className={`grid gap-8 mb-16 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
          {filteredClasses.map((classData, index) => (
            <div key={classData.id} className="animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
              <ClassCardComponent classData={classData} />
            </div>
          ))}
        </div>

        {/* No results message */}
        {filteredClasses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>

      {/* Enhanced Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#fd59ca] to-[#9414d1] rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
          <button className="relative w-16 h-16 bg-gradient-to-r from-[#fd59ca] to-[#9414d1] rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group">
            <Users className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
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
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default TutorPage;