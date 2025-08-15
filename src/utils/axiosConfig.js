// Create this file: src/utils/axiosConfig.js

import axios from 'axios';

// This function sets up axios to automatically include the token in all requests
export const setupAxiosInterceptors = () => {
  
  // 🔥 REQUEST INTERCEPTOR - Adds token to every request automatically
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Adding token to request:', config.url);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 🔥 RESPONSE INTERCEPTOR - Handles token expiration
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        console.log('🚨 Token expired or invalid - clearing localStorage');
        
        // Clear all auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userType');
        
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
};

export default axios;