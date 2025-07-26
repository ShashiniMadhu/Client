import React from 'react';
import { Heart, Mail, Phone, MapPin, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#280120] via-[#450063] to-[#9414d1] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#03b2ed] via-[#fd59ca] to-[#03b2ed] bg-clip-text text-transparent mb-4">
              SkillMentor
            </h3>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              Empowering careers through personalized mentorship and cutting-edge technology education. 
              Connect with industry experts and accelerate your professional growth.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors duration-300">Find Mentors</a></li>
              <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors duration-300">Courses</a></li>
              <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors duration-300">About Us</a></li>
              <li><a href="#" className="text-white/70 hover:text-white text-sm transition-colors duration-300">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#03b2ed]" />
                <span className="text-white/70 text-sm">hello@skillmentor.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#03b2ed]" />
                <span className="text-white/70 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-[#03b2ed]" />
                <span className="text-white/70 text-sm">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-white/60 text-sm flex items-center">
            Made with <Heart className="w-4 h-4 mx-1 text-[#fd59ca]" /> by SkillMentor Team
          </p>
          <p className="text-white/60 text-sm mt-2 sm:mt-0">
            © 2025 SkillMentor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;