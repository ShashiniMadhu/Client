import React from 'react';
import { Users, Target, Award, BookOpen, Sparkles, ArrowRight, Star, TrendingUp, Heart, Shield } from 'lucide-react';
import hero from '../assets/hero.jpeg';

const AboutUs = () => {
  const stats = [
    { icon: <Users className="w-6 h-6" />, number: "10,000+", label: "Students Mentored" },
    { icon: <BookOpen className="w-6 h-6" />, number: "500+", label: "Expert Mentors" },
    { icon: <Award className="w-6 h-6" />, number: "95%", label: "Success Rate" },
    { icon: <Star className="w-6 h-6" />, number: "4.9", label: "Average Rating" }
  ];

  const values = [
    { icon: <Target className="w-8 h-8" />, title: "Excellence", description: "We strive for excellence in every mentorship session, ensuring high-quality learning experiences." },
    { icon: <Heart className="w-8 h-8" />, title: "Personalized Care", description: "Every student receives personalized attention tailored to their unique learning goals and pace." },
    { icon: <Shield className="w-8 h-8" />, title: "Trust & Safety", description: "We maintain the highest standards of trust and safety in our learning environment." },
    { icon: <TrendingUp className="w-8 h-8" />, title: "Growth Focused", description: "We're committed to helping you achieve measurable career growth and professional success." }
  ];

  const team = [
    { name: "Sarah Chen", role: "Co-Founder & CEO", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face", description: "Former AWS Principal Engineer with 12+ years in cloud architecture." },
    { name: "Marcus Johnson", role: "Co-Founder & CTO", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face", description: "Ex-Google Senior Staff Engineer, passionate about education technology." },
    { name: "Emily Rodriguez", role: "Head of Mentorship", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face", description: "Learning experience designer with expertise in adult education." }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-in-left { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slide-in-right { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-slide-in-left { animation: slide-in-left 0.8s ease-out forwards; }
        .animate-slide-in-right { animation: slide-in-right 0.8s ease-out forwards; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-900 { animation-delay: 0.9s; }
      `}</style>

      {/* Hero Section with Background Image */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#280120] via-[#450063] to-[#9414d1]">
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
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full px-6 py-3 mb-8 animate-fade-in-up">
              <Sparkles className="w-5 h-5 text-[#fd59ca]" />
              <span className="text-white font-semibold">About SkillMentor</span>
            </div>

            <h1 className="text-6xl font-black text-white mb-6 leading-tight animate-fade-in-up">
              <span className="inline-block animate-slide-in-left">Transforming</span>
              <span className="block bg-gradient-to-r from-[#03b2ed] via-[#fd59ca] to-[#03b2ed] bg-clip-text text-transparent animate-slide-in-right animation-delay-300">
                Careers Together
              </span>
            </h1>
            
            <p className="text-xl text-white/90 font-medium max-w-3xl mx-auto leading-relaxed mb-12 animate-fade-in-up animation-delay-600">
              We're on a mission to democratize access to high-quality mentorship and accelerate professional growth through personalized learning experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-900">
              <button className="bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] hover:from-[#fd59ca] hover:to-[#03b2ed] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                <div className="flex items-center justify-center space-x-2">
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
              <button className="bg-white/20 backdrop-blur-lg border border-white/30 hover:bg-white/30 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#450063] rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</h3>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-[#450063] mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              At SkillMentor, we believe that everyone deserves access to world-class mentorship. We're bridging the gap between industry experts and aspiring professionals, creating meaningful connections that drive career transformation.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Our platform combines cutting-edge technology with human expertise to deliver personalized learning experiences that adapt to your unique goals, pace, and learning style.
            </p>
            <button className="bg-[#450063] hover:bg-[#350051] text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Start Your Journey
            </button>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop" 
              alt="Team collaboration" 
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#450063] mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape the experience we create for our learning community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-[#450063] mx-auto mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#450063] mb-4">Meet Our Team</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Passionate educators and technologists dedicated to transforming how people learn and grow professionally.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <img 
                src={member.image} 
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-6 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
              <p className="text-[#450063] font-medium mb-4">{member.role}</p>
              <p className="text-gray-600 leading-relaxed">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;