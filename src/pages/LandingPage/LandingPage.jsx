import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { Users, BookOpen, Award, Star, ArrowRight, GraduationCap } from 'lucide-react';
import Footer from '../../components/footer';
import axios from 'axios';
import logo from '../../assets/logo.png'; 
import hero from '../../assets/hero.jpeg'; 

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

const LandingPage = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  // Handle role-based navigation after sign in
  React.useEffect(() => {
    const handleSignedInUser = async () => {
      if (isSignedIn && user) {
        try {
          const email = user.primaryEmailAddress?.emailAddress;
          
          // Check admin
          try {
            const adminResponse = await axios.get(`${API_BASE_URL}/api/v1/academic/admin/by-email/${email}`);
            if (adminResponse.data) {
              await axios.post(`${API_BASE_URL}/api/v1/academic/admin/link-clerk`, {
                email: email,
                clerkUserId: user.id
              });
              navigate('/admin');
              return;
            }
          } catch (adminError) {}

          // Check student
          try {
            const studentResponse = await axios.get(`${API_BASE_URL}/api/v1/academic/student/by-email/${email}`);
            if (studentResponse.data) {
              await axios.post(`${API_BASE_URL}/api/v1/academic/student/link-clerk`, {
                email: email,
                clerkUserId: user.id
              });
              navigate('/student');
              return;
            }
          } catch (studentError) {
            // Student not found - don't automatically show role selection
            // User can manually trigger student creation via signup buttons
            console.log('Student not found for email:', email);
          }
        } catch (error) {
          console.error('Error checking user role:', error);
        }
      }
    };

    handleSignedInUser();
  }, [isSignedIn, user, navigate]);

// Only showing the handleStudentCreation function from LandingPage.jsx
// Replace your existing handleStudentCreation function with this improved version:

const handleStudentCreation = async () => {
  if (!user) {
    console.log('No user found');
    return;
  }

  console.log('Starting student creation process for user:', user.primaryEmailAddress?.emailAddress);

  try {
    const email = user.primaryEmailAddress?.emailAddress;
    const clerkUserId = user.id;
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';

    if (!email) {
      alert('No email found. Please ensure your account has a valid email.');
      return;
    }

    // First check if student already exists
    try {
      console.log('Checking if student exists for email:', email);
      const existingStudent = await axios.get(`${API_BASE_URL}/api/v1/academic/student/by-email/${email}`);
      
      if (existingStudent.data) {
        console.log('Student already exists, linking with Clerk and navigating');
        
        // Link clerk user if not already linked
        await axios.post(`${API_BASE_URL}/api/v1/academic/student/link-clerk`, {
          email: email,
          clerkUserId: clerkUserId
        });
        
        // Set localStorage and navigate
        localStorage.setItem('userRole', 'student');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('clerkUserId', clerkUserId);
        
        navigate('/student');
        return;
      }
    } catch (checkError) {
      if (checkError.response?.status !== 404) {
        console.error('Error checking existing student:', checkError);
        alert('Error checking student account. Please try again.');
        return;
      }
      // 404 is expected - student doesn't exist, continue to create
      console.log('Student does not exist, proceeding with creation');
    }

    // Create new student - matching your DTO exactly
    const newStudentData = {
      clerk_user_id: clerkUserId,
      first_name: firstName || 'Student',
      last_name: lastName || 'User',
      email: email,
      phone_number: 'Not provided',
      address: 'Not provided',
      age: 18,
      password: 'ClerkUser123!',
      role: 'student'
    };

    console.log('Creating new student with data:', newStudentData);
    
    const createResponse = await axios.post(
      `${API_BASE_URL}/api/v1/academic/student`, 
      newStudentData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Student created successfully:', createResponse.data);

    if (createResponse.status === 200 && createResponse.data) {
      // Set localStorage
      localStorage.setItem('userRole', 'student');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('clerkUserId', clerkUserId);
      
      console.log('Navigating to student page');
      navigate('/student');
      setShowRoleSelection(false);
    } else {
      throw new Error('Invalid response from server');
    }

  } catch (error) {
    console.error('Error in student creation process:', error);
    
    let errorMessage = 'Error creating student account. Please try again.';
    
    if (error.response?.status === 400) {
      errorMessage = 'Invalid data provided. Please check your account information.';
    } else if (error.response?.status === 409) {
      errorMessage = 'Student account already exists with this email.';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    alert(errorMessage);
  }
};

  const stats = [
    { icon: <Users className="w-6 h-6" />, number: "10,000+", label: "Active Students" },
    { icon: <BookOpen className="w-6 h-6" />, number: "500+", label: "Expert Mentors" },
    { icon: <Award className="w-6 h-6" />, number: "95%", label: "Success Rate" },
    { icon: <Star className="w-6 h-6" />, number: "4.9", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
        
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animation-delay-900 {
          animation-delay: 0.9s;
        }
      `}</style>
      {/* Header */}
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - keeping original design */}
            <div className="flex items-center space-x-4">
              <img src={logo} alt="SkillMentor Logo" className="w-12 h-12 rounded-lg object-cover shadow-sm" />
              <div className="flex flex-col leading-tight">
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#9414d1] via-[#fd59ca] to-[#03b2ed] bg-clip-text text-transparent tracking-tight">
                  Skill<span className="text-[#280120]">Mentor</span>
                </h1>
                <p className="text-sm text-gray-600 font-medium italic">Learn • Grow • Succeed</p>
              </div>
            </div>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              {isSignedIn ? (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-gray-700 font-medium">
                      Welcome, <span className="text-[#450063] font-semibold">{user?.firstName || 'User'}!</span>
                    </p>
                    <p className="text-xs text-gray-500">Good to see you back</p>
                  </div>
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="px-6 py-2 text-[#450063] font-medium hover:bg-gray-50 rounded-lg transition-colors">
                      Login
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-6 py-2 bg-[#450063] hover:bg-[#350051] text-white font-medium rounded-lg transition-colors">
                      Join as Student
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with background image */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#280120] via-[#450063] to-[#9414d1]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src={hero} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#03b2ed]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#fd59ca]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-6xl font-black text-white mb-6 leading-tight animate-fade-in-up">
              <span className="inline-block animate-slide-in-left">Transform Your Future with</span>
              <span className="block bg-gradient-to-r from-[#03b2ed] via-[#fd59ca] to-[#03b2ed] bg-clip-text text-transparent animate-slide-in-right animation-delay-300">
                Expert Mentorship
              </span>
            </h1>
            <p className="text-xl text-white/90 font-medium max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up animation-delay-600">
              Connect with industry experts and accelerate your learning journey. Join thousands of students who have transformed their careers through personalized mentorship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-900">
              {!isSignedIn ? (
                <SignUpButton mode="modal">
                  <button className="group bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] hover:from-[#fd59ca] hover:to-[#03b2ed] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                    <div className="flex items-center justify-center space-x-2">
                      <span>Join as Student</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </button>
                </SignUpButton>
              ) : (
                <button 
                  onClick={handleStudentCreation}
                  className="group bg-gradient-to-r from-[#03b2ed] to-[#fd59ca] hover:from-[#fd59ca] hover:to-[#03b2ed] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>Join as Student</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>
              )}
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
            <div key={index} className="bg-white rounded-xl p-8 shadow-md border text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#450063] rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</h3>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose SkillMentor?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience personalized learning with industry experts who are passionate about your success.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-xl bg-white border shadow-md hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-[#450063]/10 rounded-xl flex items-center justify-center text-[#450063] mx-auto mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Mentors</h3>
            <p className="text-gray-600 leading-relaxed">Learn from industry professionals with years of real-world experience and proven track records.</p>
          </div>
          <div className="text-center p-8 rounded-xl bg-white border shadow-md hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-[#450063]/10 rounded-xl flex items-center justify-center text-[#450063] mx-auto mb-6">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Personalized Learning</h3>
            <p className="text-gray-600 leading-relaxed">Get customized learning paths tailored to your goals, pace, and preferred learning style.</p>
          </div>
          <div className="text-center p-8 rounded-xl bg-white border shadow-md hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-[#450063]/10 rounded-xl flex items-center justify-center text-[#450063] mx-auto mb-6">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Proven Results</h3>
            <p className="text-gray-600 leading-relaxed">Join thousands of successful learners who have achieved their career goals through our platform.</p>
          </div>
        </div>
      </div>

      {/* Student Account Creation Modal */}
      {showRoleSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-[#450063] rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to SkillMentor!</h2>
              <p className="text-gray-600 mb-6">
                We'll create your student account so you can start learning with expert mentors.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#450063] rounded-lg flex items-center justify-center text-white">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">Student Account</h3>
                      <p className="text-sm text-gray-600">Access courses, mentors, and learning resources</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleStudentCreation}
                  className="w-full bg-[#450063] hover:bg-[#350051] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Create My Student Account
                </button>
                
                <p className="text-xs text-gray-500 mt-4">
                  Already an admin? Use the login button above with your existing credentials.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default LandingPage;