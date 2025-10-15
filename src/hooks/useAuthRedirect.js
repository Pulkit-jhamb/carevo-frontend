// Replace your entire useAuthRedirect.jsx file with this:

import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to clear all auth data
  const clearAuthData = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userType");
    console.log('🧹 Cleared all auth data');
  }, []);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const token = localStorage.getItem('authToken');
      
      console.log('🔍 Checking auth status...');
      console.log('📍 Current path:', location.pathname);
      console.log('🔐 Token exists:', !!token);

      try {
        // The axios interceptor will automatically add the token header
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS);
        
        if (response.data.authenticated) {
          console.log('✅ User is authenticated');
          
          // If user is authenticated and on public routes, redirect to dashboard
          const publicRoutes = ['/login', '/signup', '/'];
          
          if (publicRoutes.includes(location.pathname)) {
            console.log('🔄 Redirecting authenticated user from public route');
            navigate('/dashboard', { replace: true });
          }
        } else {
          console.log('❌ User is not authenticated');
          clearAuthData();
          
          // If user is not authenticated and on protected routes, redirect to login
          const protectedRoutes = ['/dashboard', '/quiz', '/chat', '/study-plan'];
          const isProtectedRoute = protectedRoutes.some(route => 
            location.pathname.startsWith(route)
          );
          
          if (isProtectedRoute) {
            console.log('🔄 Redirecting unauthenticated user from protected route');
            navigate('/login', { replace: true });
          }
        }
      } catch (error) {
        console.error('🚨 Auth check failed:', error);
        clearAuthData();
        
        // If there's an error, assume user is not authenticated
        const protectedRoutes = ['/dashboard', '/quiz', '/chat', '/study-plan'];
        const isProtectedRoute = protectedRoutes.some(route => 
          location.pathname.startsWith(route)
        );
        
        if (isProtectedRoute) {
          console.log('🔄 Redirecting after auth error');
          navigate('/login', { replace: true });
        }
      }
    };

    // Small delay to prevent conflicts
    const timeoutId = setTimeout(() => {
      checkAuthAndRedirect();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [navigate, location.pathname, clearAuthData]);
};