import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../../components/header'; // Import your actual Header component
import TutorPage from './Tutor';
import About from '../../components/Aboutus';
import Footer from '../../components/footer';
import Dashboard from './Dashboard'; 
import Resources from './Resources'; 
import CheckoutPage from './Checkout';
import Profile from './Profile'; 

const Student = () => {
  // Define user role here - this is the key variable you control
  const userRole = 'student'; // Change this to 'tutor', 'mentor', or 'student'
  const userName = 'SkillMentor';

  return (
    <div>
      {/* Pass userRole to Header component */}
      <Header userType={userRole} userName={userName} />
      
      {/* Routes */}
      <Routes>
        <Route index element={<TutorPage />} />
        <Route path="about" element={<About />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="resources" element={<Resources />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="profile" element={<Profile />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default Student;