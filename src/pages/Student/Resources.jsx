import React, { useState } from 'react';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Download, 
  ExternalLink, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Star, 
  ArrowRight, 
  Sparkles,
  Target,
  TrendingUp,
  Code,
  Briefcase,
  Users,
  MessageCircle,
  Calendar,
  Award,
  ChevronDown,
  Play,
  BookmarkPlus
} from 'lucide-react';

const Resources = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Resources', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'guides', name: 'Career Guides', icon: <FileText className="w-4 h-4" /> },
    { id: 'videos', name: 'Video Tutorials', icon: <Video className="w-4 h-4" /> },
    { id: 'templates', name: 'Templates', icon: <Download className="w-4 h-4" /> },
    { id: 'tools', name: 'Tools & Apps', icon: <Code className="w-4 h-4" /> },
    { id: 'events', name: 'Events & Webinars', icon: <Calendar className="w-4 h-4" /> }
  ];

  const featuredResources = [
    {
      id: 1,
      title: "The Complete Software Engineer Career Roadmap",
      description: "A comprehensive guide covering everything from junior to senior engineer roles, including salary expectations and skill requirements.",
      type: "Career Guide",
      category: "guides",
      duration: "45 min read",
      author: "Sarah Chen",
      rating: 4.9,
      downloads: 12500,
      image: null,
      tags: ["Career Growth", "Software Engineering", "Roadmap"],
      isPremium: false
    },
    {
      id: 2,
      title: "System Design Interview Masterclass",
      description: "Learn how to ace system design interviews with real examples from FAANG companies. Includes practice problems and solutions.",
      type: "Video Series",
      category: "videos",
      duration: "3.5 hours",
      author: "Marcus Johnson",
      rating: 4.8,
      downloads: 8900,
      image: null,
      tags: ["System Design", "Interviews", "FAANG"],
      isPremium: true
    },
    {
      id: 3,
      title: "Resume Template Pack - Tech Professionals",
      description: "5 professionally designed resume templates optimized for ATS systems and tech roles. Includes cover letter templates.",
      type: "Template",
      category: "templates",
      duration: "Instant download",
      author: "Emily Rodriguez",
      rating: 4.7,
      downloads: 15200,
      image: null,
      tags: ["Resume", "Templates", "ATS"],
      isPremium: false
    }
  ];

  const resourceLibrary = [
    {
      id: 4,
      title: "JavaScript Interview Prep Kit",
      description: "100+ JavaScript interview questions with detailed explanations and code examples.",
      type: "Study Guide",
      category: "guides",
      duration: "2 hours",
      author: "Alex Kim",
      rating: 4.6,
      downloads: 6700,
      tags: ["JavaScript", "Interviews", "Coding"],
      isPremium: false
    },
    {
      id: 5,
      title: "Salary Negotiation Workshop",
      description: "Learn proven strategies to negotiate your salary and benefits package effectively.",
      type: "Workshop",
      category: "videos",
      duration: "90 min",
      author: "Dr. Lisa Park",
      rating: 4.9,
      downloads: 4300,
      tags: ["Salary", "Negotiation", "Career"],
      isPremium: true
    },
    {
      id: 6,
      title: "Project Portfolio Builder",
      description: "Interactive tool to create stunning project portfolios that showcase your skills effectively.",
      type: "Tool",
      category: "tools",
      duration: "Self-paced",
      author: "SkillMentor Team",
      rating: 4.5,
      downloads: 3200,
      tags: ["Portfolio", "Projects", "Showcase"],
      isPremium: false
    },
    {
      id: 7,
      title: "Tech Industry Trends 2025",
      description: "Comprehensive report on emerging technologies and market demands for the coming year.",
      type: "Report",
      category: "guides",
      duration: "30 min read",
      author: "Industry Research Team",
      rating: 4.4,
      downloads: 2800,
      tags: ["Trends", "Technology", "2025"],
      isPremium: true
    },
    {
      id: 8,
      title: "Networking Event: AI & Machine Learning",
      description: "Join industry experts for discussions on the latest AI/ML trends and career opportunities.",
      type: "Live Event",
      category: "events",
      duration: "2 hours",
      author: "SkillMentor Events",
      rating: 4.8,
      downloads: 0,
      tags: ["AI", "ML", "Networking"],
      isPremium: false,
      date: "Aug 15, 2025"
    }
  ];

  const learningPaths = [
    {
      title: "Frontend Developer Path",
      description: "Complete learning path from HTML/CSS basics to advanced React development",
      resources: 24,
      duration: "3-6 months",
      level: "Beginner to Advanced",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Data Scientist Path",
      description: "Master data analysis, machine learning, and statistical modeling",
      resources: 18,
      duration: "4-8 months", 
      level: "Intermediate",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "DevOps Engineer Path",
      description: "Learn cloud platforms, containerization, and infrastructure automation",
      resources: 20,
      duration: "3-5 months",
      level: "Intermediate to Advanced",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const filteredResources = [...featuredResources, ...resourceLibrary].filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#280120] via-[#450063] to-[#9414d1]">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#03b2ed]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#fd59ca]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full px-6 py-3 mb-8">
              <Sparkles className="w-5 h-5 text-[#fd59ca]" />
              <span className="text-white font-semibold">Learning Resources</span>
            </div>

            <h1 className="text-6xl font-black text-white mb-6 leading-tight">
              Accelerate Your
              <span className="block bg-gradient-to-r from-[#03b2ed] via-[#fd59ca] to-[#03b2ed] bg-clip-text text-transparent">
                Career Growth
              </span>
            </h1>
            
            <p className="text-xl text-white/80 font-medium max-w-3xl mx-auto leading-relaxed mb-8">
              Access curated learning materials, templates, tools, and expert insights to fast-track your professional development journey.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search resources, guides, templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#03b2ed] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-[#9414d1] to-[#03b2ed] text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Paths */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-[#280120] mb-4">Structured Learning Paths</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Follow curated learning journeys designed to take you from beginner to expert in your chosen field.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {learningPaths.map((path, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className={`w-16 h-16 bg-gradient-to-r ${path.color} rounded-2xl flex items-center justify-center text-white mb-6`}>
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{path.title}</h3>
              <p className="text-slate-600 mb-6">{path.description}</p>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Resources:</span>
                  <span className="font-medium text-slate-700">{path.resources}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Duration:</span>
                  <span className="font-medium text-slate-700">{path.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Level:</span>
                  <span className="font-medium text-slate-700">{path.level}</span>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] hover:from-[#fd59ca] hover:to-[#03b2ed] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 group">
                <div className="flex items-center justify-center space-x-2">
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Resources */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-[#280120] mb-4">Featured Resources</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Hand-picked premium content from industry experts to supercharge your learning.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {featuredResources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="h-48 bg-gradient-to-br from-[#280120] via-[#450063] to-[#9414d1] flex items-center justify-center relative">
                  {resource.isPremium && (
                    <div className="absolute top-4 right-4 bg-[#fd59ca] text-white text-xs font-bold px-3 py-1 rounded-full">
                      PREMIUM
                    </div>
                  )}
                  <div className="text-center text-white">
                    {resource.category === 'videos' ? <Play className="w-12 h-12 mx-auto mb-2" /> :
                     resource.category === 'templates' ? <Download className="w-12 h-12 mx-auto mb-2" /> :
                     <FileText className="w-12 h-12 mx-auto mb-2" />}
                    <p className="font-medium">{resource.type}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-[#9414d1] transition-colors duration-300">
                    {resource.title}
                  </h3>
                  <p className="text-slate-600 mb-4 line-clamp-3">{resource.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{resource.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{resource.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{resource.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {resource.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                      {resource.downloads > 0 ? `${resource.downloads.toLocaleString()} downloads` : 'Upcoming Event'}
                    </div>
                    <button className="flex items-center space-x-2 bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] hover:from-[#fd59ca] hover:to-[#03b2ed] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 group">
                      {resource.category === 'events' ? (
                        <>
                          <Calendar className="w-4 h-4" />
                          <span>Register</span>
                        </>
                      ) : (
                        <>
                          <span>Access</span>
                          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resource Library */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black text-[#280120] mb-4">Resource Library</h2>
            <p className="text-lg text-slate-600">
              Explore our complete collection of learning materials and tools.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-slate-600">
            <span className="font-medium">{filteredResources.length} resources found</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#9414d1] to-[#03b2ed] rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  {resource.category === 'videos' ? <Play className="w-6 h-6" /> :
                   resource.category === 'templates' ? <Download className="w-6 h-6" /> :
                   resource.category === 'tools' ? <Code className="w-6 h-6" /> :
                   resource.category === 'events' ? <Calendar className="w-6 h-6" /> :
                   <FileText className="w-6 h-6" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-[#9414d1] transition-colors duration-300 truncate">
                      {resource.title}
                    </h3>
                    {resource.isPremium && (
                      <span className="bg-[#fd59ca] text-white text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">
                        PRO
                      </span>
                    )}
                  </div>
                  
                  <p className="text-slate-600 mb-3 line-clamp-2">{resource.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-500 mb-3">
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium">{resource.type}</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{resource.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{resource.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span key={tagIndex} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                      {resource.tags.length > 2 && (
                        <span className="text-slate-400 text-xs">+{resource.tags.length - 2}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-slate-400 hover:text-[#9414d1] transition-colors duration-300">
                        <BookmarkPlus className="w-4 h-4" />
                      </button>
                      <button className="bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] hover:from-[#fd59ca] hover:to-[#03b2ed] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm">
                        {resource.category === 'events' ? 'Register' : 'Access'}
                      </button>
                    </div>
                  </div>

                  {resource.date && (
                    <div className="mt-3 text-sm text-[#9414d1] font-medium">
                      📅 {resource.date}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No resources found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-[#280120] via-[#450063] to-[#9414d1] py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-6">Ready to Level Up Your Skills?</h2>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Get personalized mentorship and access to exclusive premium resources to accelerate your career growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] hover:from-[#fd59ca] hover:to-[#03b2ed] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
              <div className="flex items-center justify-center space-x-2">
                <span>Find Your Mentor</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
            <button className="bg-white/20 backdrop-blur-lg border border-white/30 hover:bg-white/30 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300">
              Browse All Resources
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;