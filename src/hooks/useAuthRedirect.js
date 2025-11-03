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
    // Temporarily disable useAuthRedirect to debug login issues
    console.log('🔍 useAuthRedirect disabled for debugging');
    console.log('📍 Current path:', location.pathname);
    console.log('🔐 Token exists:', !!localStorage.getItem('authToken'));
    
    // Only redirect if we're on a protected route without a token
    const token = localStorage.getItem('authToken');
    const protectedRoutes = [
      '/dashboard',
      '/college-dashboard',
      '/quiz-college',
      '/mental-health-college',
      '/community',
      '/notability',
      '/placement',
      '/resume',
      '/chat'
    ];
    const isProtectedRoute = protectedRoutes.some(route => 
      location.pathname.startsWith(route)
    );
    
    if (isProtectedRoute && !token) {
      console.log('🔄 No token on protected route, redirecting to login');
      navigate('/login', { replace: true });
    }
  }, [navigate, location.pathname, clearAuthData]);
};
