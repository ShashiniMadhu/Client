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
        const firstName = user.firstName || 'User';
        const lastName = user.lastName || 'Student';
        
        console.log('🔍 Processing user:', { email, clerkUserId, firstName, lastName });
        
        if (!email) {
          setError('No email found');
          setLoading(false);
          return;
        }

        // Check if user is admin first
        try {
          console.log('🔍 Checking for admin with email:', email);
          const adminResponse = await axios.get(`${API_BASE_URL}/api/v1/academic/admin/by-email/${email}`);
          if (adminResponse.data) {
            console.log('✅ Admin found, linking with Clerk');
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
          console.log('ℹ️ Admin not found, checking for student');
        }

        // Check if user is student
        try {
          console.log('🔍 Checking for student with email:', email);
          const studentResponse = await axios.get(`${API_BASE_URL}/api/v1/academic/student/by-email/${email}`);
          if (studentResponse.data) {
            console.log('✅ Student found, linking with Clerk');
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
          console.log('ℹ️ Student not found, will create new student');
          console.log('Student check error:', studentError.response?.status, studentError.response?.data);
          
          try {
            // Create new student with Clerk data - EXACTLY matching your DTO requirements
            const newStudentData = {
              clerk_user_id: clerkUserId,
              first_name: firstName,
              last_name: lastName,
              email: email,
              phone_number: 'Not provided', // Default value - not empty
              address: 'Not provided', // Default value - not empty  
              age: 18, // Minimum age as per validation
              password: 'ClerkUser123!', // Strong password meeting validation (8+ chars)
              role: 'student'
            };

            console.log('📝 Creating student with data:', newStudentData);
            
            const createResponse = await axios.post(
              `${API_BASE_URL}/api/v1/academic/student`, 
              newStudentData,
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );

            console.log('✅ Student created successfully:', createResponse.data);

            if (createResponse.data) {
              setUserRole('student');
              localStorage.setItem('userRole', 'student');
              localStorage.setItem('userEmail', email);
              localStorage.setItem('clerkUserId', clerkUserId);
              setLoading(false);
              return;
            }
          } catch (createError) {
            console.error('❌ Error creating student:');
            console.error('Status:', createError.response?.status);
            console.error('Error data:', createError.response?.data);
            console.error('Full error:', createError);
            
            // Set a more descriptive error message
            let errorMessage = 'Failed to create student account';
            if (createError.response?.data?.message) {
              errorMessage = createError.response.data.message;
            } else if (createError.response?.data) {
              errorMessage = `Server error: ${JSON.stringify(createError.response.data)}`;
            }
            setError(errorMessage);
          }
        }

        if (!userRole) {
          setError('Unable to determine user role');
        }
        
      } catch (error) {
        console.error('❌ Error in authentication flow:', error);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your account...</p>
        </div>
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h2>
            <p className="text-gray-600 mb-6 text-sm">{error}</p>
            <div className="space-y-2">
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Go to Home
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user has required role
  if (userRole && !allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;