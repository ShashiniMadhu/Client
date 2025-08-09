import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const linkUserAndGetRole = async () => {
      if (!isLoaded || !isSignedIn || !user) {
        setLoading(false);
        return;
      }

      try {
        const email = user.primaryEmailAddress?.emailAddress;
        const clerkUserId = user.id;
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        
        if (!email) {
          setError('No email found');
          setLoading(false);
          return;
        }

        // Check if user is admin first
        try {
          const adminResponse = await axios.get(`${API_BASE_URL}/api/v1/academic/admin/by-email/${email}`);
          if (adminResponse.data) {
            // Link admin with Clerk
            await axios.post(`${API_BASE_URL}/api/v1/academic/admin/link-clerk`, {
              email: email,
              clerkUserId: clerkUserId
            });
            setUserRole('admin');
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('clerkUserId', clerkUserId);
            setLoading(false);
            return;
          }
        } catch (adminError) {
          // Admin not found, check student
        }

        // Check if user is student
        try {
          const studentResponse = await axios.get(`${API_BASE_URL}/api/v1/academic/student/by-email/${email}`);
          if (studentResponse.data) {
            // Link existing student with Clerk
            await axios.post(`${API_BASE_URL}/api/v1/academic/student/link-clerk`, {
              email: email,
              clerkUserId: clerkUserId
            });
            setUserRole('student');
            localStorage.setItem('userRole', 'student');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('clerkUserId', clerkUserId);
            setLoading(false);
            return;
          }
        } catch (studentError) {
          // Student not found, create new student
          console.log('Student not found, creating new student...');
          
          try {
            // Create new student with Clerk data
            const newStudentData = {
              clerk_user_id: clerkUserId,
              first_name: firstName || 'User',
              last_name: lastName || 'Name',
              email: email,
              phone_number: 'N/A', // Default value
              address: 'N/A', // Default value
              age: 18, // Default minimum age
              password: 'clerk_user', // Default password for Clerk users
              role: 'student'
            };

            const createResponse = await axios.post(
              `${API_BASE_URL}/api/v1/academic/student`, 
              newStudentData
            );

            if (createResponse.data) {
              setUserRole('student');
              localStorage.setItem('userRole', 'student');
              localStorage.setItem('userEmail', email);
              localStorage.setItem('clerkUserId', clerkUserId);
              setLoading(false);
              return;
            }
          } catch (createError) {
            console.error('Error creating student:', createError);
            setError('Failed to create student account');
          }
        }

        if (!userRole) {
          setError('Unable to determine user role');
        }
        
      } catch (error) {
        console.error('Error linking user:', error);
        setError('Failed to authenticate user');
      } finally {
        setLoading(false);
      }
    };

    linkUserAndGetRole();
  }, [isLoaded, isSignedIn, user]);

  // Show loading while Clerk loads
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Redirect to home if not signed in
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  // Show error if authentication failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Check if user has required role
  if (userRole && !allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;