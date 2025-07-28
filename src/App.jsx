

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Student from "./pages/Student/Student";
import MentorPage from './pages/Mentor/Mentor';
import AboutUs from './components/Aboutus';
import LandingPage from "./pages/LandingPage/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student/*" element={<Student />} />
        <Route path="/mentor" element={<MentorPage />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </Router>
  );
}

export default App;
