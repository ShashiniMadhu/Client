import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import Student from "./pages/Student/Student";
import MentorPage from './pages/Mentor/Mentor';
import AboutUs from './components/Aboutus';
import LandingPage from "./pages/LandingPage/LandingPage";
import Admin from './pages/Admin/Admin';
import ProtectedRoute from './components/ProtectedRoute';

// Get your publishable key from Clerk Dashboard
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file")
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/student/*" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Student />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Admin />
              </ProtectedRoute>
            } 
          />
          <Route path="/mentor/*" element={<MentorPage />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;