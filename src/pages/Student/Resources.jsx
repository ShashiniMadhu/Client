import React, { useState } from 'react';
import { 
  Search, 
  Play, 
  Clock, 
  Eye, 
  ThumbsUp,
  BookOpen,
  Code,
  Gamepad2,
  Cpu,
  Database,
  Smartphone,
  Globe,
  Brain,
  Shield,
  Palette
} from 'lucide-react';
import hero from '../../assets/hero.jpeg';


const VideoResources = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Videos', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'programming', name: 'Programming Languages', icon: <Code className="w-4 h-4" /> },
    { id: 'quantum', name: 'Quantum Computing', icon: <Cpu className="w-4 h-4" /> },
    { id: 'gamedev', name: 'Game Development', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'database', name: 'Database Management', icon: <Database className="w-4 h-4" /> },
    { id: 'mobile', name: 'Mobile Development', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'web', name: 'Web Development', icon: <Globe className="w-4 h-4" /> },
    { id: 'ai', name: 'AI & Machine Learning', icon: <Brain className="w-4 h-4" /> },
    { id: 'cybersecurity', name: 'Cybersecurity', icon: <Shield className="w-4 h-4" /> },
    { id: 'design', name: 'UI/UX Design', icon: <Palette className="w-4 h-4" /> }
  ];

  const videoCollections = {
    programming: [
      {
        id: 1,
        title: "Python Complete Course - Beginner to Advanced",
        embedUrl: "https://www.youtube.com/embed/8DvywoWv6fI",
        duration: "6:30:00",
        views: "2.1M",
        likes: "45K",
        description: "Complete Python programming course covering basics to advanced concepts",
        thumbnail: "https://img.youtube.com/vi/8DvywoWv6fI/maxresdefault.jpg"
      },
      {
        id: 2,
        title: "JavaScript Full Course for Beginners",
        embedUrl: "https://www.youtube.com/embed/PkZNo7MFNFg",
        duration: "4:20:00",
        views: "1.8M",
        likes: "38K",
        description: "Learn JavaScript from scratch with practical examples and projects",
        thumbnail: "https://img.youtube.com/vi/PkZNo7MFNFg/maxresdefault.jpg"
      },
      {
        id: 3,
        title: "Java Programming Complete Tutorial",
        embedUrl: "https://www.youtube.com/embed/grEKMHGYyns",
        duration: "12:00:00",
        views: "1.5M",
        likes: "32K",
        description: "Comprehensive Java programming course for beginners",
        thumbnail: "https://img.youtube.com/vi/grEKMHGYyns/maxresdefault.jpg"
      }
    ],
    quantum: [
      {
        id: 4,
        title: "Quantum Computing Explained with Quantum Physics",
        embedUrl: "https://www.youtube.com/embed/JhHMJCUmq28",
        duration: "22:00",
        views: "850K",
        likes: "25K",
        description: "Understanding quantum computing principles and applications",
        thumbnail: "https://img.youtube.com/vi/JhHMJCUmq28/maxresdefault.jpg"
      },
      {
        id: 5,
        title: "IBM Qiskit Full Course - Quantum Computing",
        embedUrl: "https://www.youtube.com/embed/a1NZC5rqQD8",
        duration: "2:15:00",
        views: "420K",
        likes: "12K",
        description: "Learn quantum programming with IBM Qiskit framework",
        thumbnail: "https://img.youtube.com/vi/a1NZC5rqQD8/maxresdefault.jpg"
      }
    ],
    gamedev: [
      {
        id: 6,
        title: "Unity Game Development Complete Course",
        embedUrl: "https://www.youtube.com/embed/gB1F9G0JXOo",
        duration: "7:40:00",
        views: "1.2M",
        likes: "28K",
        description: "Learn Unity game development from beginner to advanced",
        thumbnail: "https://img.youtube.com/vi/gB1F9G0JXOo/maxresdefault.jpg"
      },
      {
        id: 7,
        title: "Unreal Engine 5 Beginner Tutorial",
        embedUrl: "https://www.youtube.com/embed/ITCWa3oLNAQ",
        duration: "3:30:00",
        views: "980K",
        likes: "22K",
        description: "Getting started with Unreal Engine 5 for game development",
        thumbnail: "https://img.youtube.com/vi/ITCWa3oLNAQ/maxresdefault.jpg"
      }
    ],
    database: [
      {
        id: 8,
        title: "SQL Full Course - Complete Database Tutorial",
        embedUrl: "https://www.youtube.com/embed/HXV3zeQKqGY",
        duration: "4:00:00",
        views: "1.1M",
        likes: "30K",
        description: "Complete SQL course covering database fundamentals",
        thumbnail: "https://img.youtube.com/vi/HXV3zeQKqGY/maxresdefault.jpg"
      },
      {
        id: 9,
        title: "MongoDB Complete Course",
        embedUrl: "https://www.youtube.com/embed/2QQGWYe7IDU",
        duration: "2:45:00",
        views: "650K",
        likes: "18K",
        description: "Learn NoSQL database management with MongoDB",
        thumbnail: "https://img.youtube.com/vi/2QQGWYe7IDU/maxresdefault.jpg"
      }
    ],
    mobile: [
      {
        id: 10,
        title: "React Native Complete Course",
        embedUrl: "https://www.youtube.com/embed/0-S5a0eXPoc",
        duration: "3:20:00",
        views: "890K",
        likes: "24K",
        description: "Build mobile apps with React Native framework",
        thumbnail: "https://img.youtube.com/vi/0-S5a0eXPoc/maxresdefault.jpg"
      },
      {
        id: 11,
        title: "Flutter App Development Course",
        embedUrl: "https://www.youtube.com/embed/1ukSR1GRtMU",
        duration: "4:50:00",
        views: "750K",
        likes: "20K",
        description: "Complete Flutter course for cross-platform development",
        thumbnail: "https://img.youtube.com/vi/1ukSR1GRtMU/maxresdefault.jpg"
      }
    ],
    web: [
      {
        id: 12,
        title: "Full Stack Web Development Course",
        embedUrl: "https://www.youtube.com/embed/nu_pCVPKzTk",
        duration: "8:30:00",
        views: "1.4M",
        likes: "35K",
        description: "Complete full stack development with modern technologies",
        thumbnail: "https://img.youtube.com/vi/nu_pCVPKzTk/maxresdefault.jpg"
      },
      {
        id: 13,
        title: "React.js Complete Course",
        embedUrl: "https://www.youtube.com/embed/bMknfKXIFA8",
        duration: "5:15:00",
        views: "1.6M",
        likes: "40K",
        description: "Master React.js for modern web development",
        thumbnail: "https://img.youtube.com/vi/bMknfKXIFA8/maxresdefault.jpg"
      }
    ],
    ai: [
      {
        id: 14,
        title: "Machine Learning Complete Course",
        embedUrl: "https://www.youtube.com/embed/GwIo3gDZCVQ",
        duration: "10:30:00",
        views: "1.3M",
        likes: "42K",
        description: "Comprehensive machine learning course with Python",
        thumbnail: "https://img.youtube.com/vi/GwIo3gDZCVQ/maxresdefault.jpg"
      },
      {
        id: 15,
        title: "Deep Learning with TensorFlow",
        embedUrl: "https://www.youtube.com/embed/tPYj3fFJGjk",
        duration: "6:45:00",
        views: "920K",
        likes: "28K",
        description: "Learn deep learning with TensorFlow framework",
        thumbnail: "https://img.youtube.com/vi/tPYj3fFJGjk/maxresdefault.jpg"
      }
    ],
    cybersecurity: [
      {
        id: 16,
        title: "Ethical Hacking Complete Course",
        embedUrl: "https://www.youtube.com/embed/3Kq1MIfTWCE",
        duration: "15:30:00",
        views: "2.2M",
        likes: "55K",
        description: "Complete ethical hacking and penetration testing course",
        thumbnail: "https://img.youtube.com/vi/3Kq1MIfTWCE/maxresdefault.jpg"
      },
      {
        id: 17,
        title: "Network Security Fundamentals",
        embedUrl: "https://www.youtube.com/embed/kBzbKUirOFk",
        duration: "3:40:00",
        views: "680K",
        likes: "19K",
        description: "Understanding network security principles and practices",
        thumbnail: "https://img.youtube.com/vi/kBzbKUirOFk/maxresdefault.jpg"
      }
    ],
    design: [
      {
        id: 18,
        title: "UI/UX Design Complete Course",
        embedUrl: "https://www.youtube.com/embed/c9Wg6Cb_YlU",
        duration: "5:20:00",
        views: "1.1M",
        likes: "31K",
        description: "Master UI/UX design principles and tools",
        thumbnail: "https://img.youtube.com/vi/c9Wg6Cb_YlU/maxresdefault.jpg"
      },
      {
        id: 19,
        title: "Figma Complete Tutorial",
        embedUrl: "https://www.youtube.com/embed/FTlczfEyHnc",
        duration: "2:30:00",
        views: "850K",
        likes: "26K",
        description: "Complete Figma tutorial for design professionals",
        thumbnail: "https://img.youtube.com/vi/FTlczfEyHnc/maxresdefault.jpg"
      }
    ]
  };

  const getAllVideos = () => {
    return Object.values(videoCollections).flat();
  };

  const filteredVideos = (() => {
    let videos = activeCategory === 'all' ? getAllVideos() : videoCollections[activeCategory] || [];
    
    if (searchTerm) {
      videos = videos.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return videos;
  })();

  const VideoCard = ({ video }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <div className="aspect-video bg-gray-900 relative overflow-hidden">
          <iframe
            src={video.embedUrl}
            title={video.title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{video.duration}</span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#450053] transition-colors">
          {video.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{video.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{video.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{video.likes}</span>
            </div>
          </div>
          <button className="bg-[#450053] hover:bg-[#350041] text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
            <Play className="w-4 h-4" />
            <span>Watch</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-slide-in-left { animation: slide-in-left 0.8s ease-out forwards; }
        .animate-slide-in-right { animation: slide-in-right 0.8s ease-out forwards; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-900 { animation-delay: 0.9s; }
      `}</style>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#280120] via-[#450053] to-[#9414d1]">
        <div className="absolute inset-0">
          <img src={hero} alt="Hero Background" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#03b2ed]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#fd59ca]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-6xl font-black text-white mb-6 leading-tight animate-fade-in-up">
              <span className="inline-block animate-slide-in-left">Video Learning</span>
              <span className="block bg-gradient-to-r from-[#03b2ed] via-[#fd59ca] to-[#03b2ed] bg-clip-text text-transparent animate-slide-in-right animation-delay-300">
                Resources
              </span>
            </h1>
            <p className="text-xl text-white/90 font-medium max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up animation-delay-600">
              Master new technologies with our curated collection of comprehensive video tutorials from expert instructors.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto animate-fade-in-up animation-delay-900">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search video tutorials..."
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
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex flex-col items-center space-y-2 p-3 rounded-lg font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-[#450053] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.icon}
                <span className="text-xs text-center">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Video Content */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#450053]">
              {activeCategory === 'all' ? 'All Video Tutorials' : categories.find(c => c.id === activeCategory)?.name}
            </h2>
            <span className="text-gray-500">{filteredVideos.length} videos</span>
          </div>

          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No videos found</h3>
              <p className="text-gray-500">Try adjusting your search or selecting a different category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoResources;