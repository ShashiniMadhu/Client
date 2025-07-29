import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../../components/header';
import Sessions from './Sessions'; 
import Classroom  from './Classroom';
import Footer from '../../components/footer';

const Mentor = () => {
  // Define user role here - this is the key variable you control
  const userRole = 'mentor'; // Change this to 'tutor', 'mentor', or 'student'
  const userName = 'SkillMentor';

  return (
    <div>
      {/* Pass userRole to Header component */}
      <Header userType={userRole} userName={userName} />
      
      <Routes>
        <Route index element={<Classroom />} />
        <Route path="sessions" element={<Sessions />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default Mentor;