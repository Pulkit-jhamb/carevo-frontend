import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS, {
          withCredentials: true
        });
        
        // If authenticated and on public routes, redirect to dashboard
        if (response.data.authenticated && 
            (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/')) {
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        // If not authenticated and on protected routes, redirect to login
        if (!location.pathname.includes('/login') && !location.pathname.includes('/signup') && location.pathname !== '/') {
          navigate('/login', { replace: true });
        }
      }
    };

    checkAuthAndRedirect();
  }, [navigate, location.pathname]);

  // Prevent back button from going to login/signup when authenticated
  useEffect(() => {
    const handlePopState = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS, {
          withCredentials: true
        });
        
        if (response.data.authenticated && 
            (location.pathname === '/login' || location.pathname === '/signup')) {
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        // Handle error silently
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate, location.pathname]);
}; 