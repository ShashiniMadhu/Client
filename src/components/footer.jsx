import React from 'react';
import { Heart, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#450063] text-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Brand & Description */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-2">SkillMentor</h3>
            <p className="text-white/70 text-sm">Empowering careers through expert mentorship</p>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6">
            <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Mentors</a>
            <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Courses</a>
            <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">About</a>
            <a href="#" className="text-white/70 hover:text-white text-sm transition-colors">Contact</a>
          </div>

          {/* Social Links */}
          <div className="flex space-x-3">
            <a href="#" className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between text-sm text-white/60">
          <p className="flex items-center">
            Made with <Heart className="w-4 h-4 mx-1" /> by SkillMentor
          </p>
          <p className="mt-2 sm:mt-0">© 2025 SkillMentor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;