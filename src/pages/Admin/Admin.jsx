import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header'; 
import Footer from '../../components/footer';
import Dashboard from './Dashboard';
import Sessions from './Sessions';
import Classes from './Classes';
import Mentors from './Mentors';
import Students from './Students';

function Admin() {
  // Define user role and userName like in your working Student component
  const userRole = 'admin';
  const userName = 'Admin Portal';

  return (
    <div>
      {/* Pass userRole and userName to Header if it expects these props */}
      <Header userType={userRole} userName={userName} />
      
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="sessions" element={<Sessions />} />
        <Route path="classes" element={<Classes />} />
        <Route path="mentors" element={<Mentors />} />
        <Route path="students" element={<Students />} />
      </Routes>
      
      <Footer />
    </div>
  );
}

export default Admin;