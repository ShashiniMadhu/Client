import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

export const useUserData = () => {
  const { user, isSignedIn } = useUser();
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isSignedIn || !user) {
        setLoading(false);
        return;
      }

      try {
        const clerkUserId = user.id;
        const role = localStorage.getItem('userRole');
        
        if (!role) {
          setError('User role not found');
          setLoading(false);
          return;
        }

        setUserRole(role);

        // Fetch user data based on role
        const endpoint = role === 'student' 
          ? `http://localhost:8080/api/v1/academic/student/by-clerk/${clerkUserId}`
          : `http://localhost:8080/api/v1/academic/admin/by-clerk/${clerkUserId}`;

        const response = await axios.get(endpoint);
        setUserData(response.data);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isSignedIn, user]);

  return { userData, userRole, loading, error };
};