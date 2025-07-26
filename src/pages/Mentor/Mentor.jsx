import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../../components/header'; // Import your actual Header component
import About from '../../components/Aboutus';
import Sessions from './Sessions'; 
import Footer from '../../components/footer';

const Student = () => {
  // Define user role here - this is the key variable you control
  const userRole = 'mentor'; // Change this to 'tutor', 'mentor', or 'student'
  const userName = 'SkillMentor';

  return (
    <div>
      {/* Pass userRole to Header component */}
      <Header userType={userRole} userName={userName} />
      
      {/* Routes */}
      <Routes>
        <Route index element={<Sessions />} />
        <Route path="about" element={<About />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default Student;