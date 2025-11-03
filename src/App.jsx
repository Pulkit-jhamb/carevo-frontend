import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_ENDPOINTS } from './config';
import { useAuthRedirect } from './hooks/useAuthRedirect';
import { setupAxiosInterceptors } from './utils/axiosConfig';

// Landing pages
import CarevoLanding from './pages/landing_page/landing_page';
import Pricing from './pages/landing_page/pricing';
import AboutTeam from './pages/landing_page/about_team';
import Product from './pages/landing_page/product';

// Auth
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';

// College pages
import ChatLight from './pages/college/chat_light';
import ChatDark from './pages/college/chat_dark';
import CollegeDashboardLight from './pages/college/college_dashboard_light';
import CollegeDashboardDark from './pages/college/college_dashboard_dark';
import CommunityLight from './pages/college/community_light';
import CommunityDark from './pages/college/community_dark';
import NotabilityLight from './pages/college/notability_light';
import NotabilityDark from './pages/college/notability_dark';
import PlacementLight from './pages/college/placement_light';
import PlacementDark from './pages/college/placement_dark';
import QuizCollegeLight from './pages/college/quiz_college_light';
import QuizCollegeDark from './pages/college/quiz_college_dark';
import ResumeCollegeLight from './pages/college/resume_college_light';
import ResumeCollegeDark from './pages/college/resume_college_dark';

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Allow access while backend auth is being integrated
      setIsAuthenticated(true);
      setLoading(false);
      return;

      // Original auth check kept for future reference
      /*
      try {
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS);

        if (response.data.authenticated) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userName');
          localStorage.removeItem('userType');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Protected route auth check failed:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userType');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
      */
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/signup')) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f9fb] via-[#e0e7ef] to-[#c7d2fe]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children, allowAuthenticated = false }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS);

        if (response.data.authenticated) {
          if (!allowAuthenticated) {
            navigate('/dashboard', { replace: true });
          }
        } else {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userName');
          localStorage.removeItem('userType');
        }
      } catch (error) {
        console.error('Public route auth check failed:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userType');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, allowAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f9fb] via-[#e0e7ef] to-[#c7d2fe]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
}

function AppRoutes() {
  useAuthRedirect();

  return (
    <Routes>
      <Route
        path="/"
        element={(
          <PublicRoute>
            <CarevoLanding />
          </PublicRoute>
        )}
      />

      {/* Public routes */}
      <Route
        path="/login"
        element={(
          <PublicRoute>
            <Login />
          </PublicRoute>
        )}
      />
      <Route
        path="/signup"
        element={(
          <PublicRoute>
            <Signup />
          </PublicRoute>
        )}
      />
      <Route
        path="/about-team"
        element={(
          <PublicRoute>
            <AboutTeam />
          </PublicRoute>
        )}
      />
      <Route
        path="/product"
        element={(
          <PublicRoute>
            <Product />
          </PublicRoute>
        )}
      />
      <Route
        path="/pricing"
        element={(
          <PublicRoute>
            <Pricing />
          </PublicRoute>
        )}
      />

      {/* College dashboard routes */}
      <Route
        path="/dashboard"
        element={(
          <ProtectedRoute>
            <CollegeDashboardLight />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/college-dashboard-light"
        element={(
          <ProtectedRoute>
            <CollegeDashboardLight />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/college-dashboard-dark"
        element={(
          <ProtectedRoute>
            <CollegeDashboardDark />
          </ProtectedRoute>
        )}
      />

      {/* College experience routes */}
      <Route
        path="/quiz-college-light"
        element={(
          <ProtectedRoute>
            <QuizCollegeLight />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/quiz-college-dark"
        element={(
          <ProtectedRoute>
            <QuizCollegeDark />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/mental-health-college-light"
        element={(
          <ProtectedRoute>
            <ChatLight />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/mental-health-college-dark"
        element={(
          <ProtectedRoute>
            <ChatDark />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/chat"
        element={(
          <ProtectedRoute>
            <ChatLight />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/community"
        element={(
          <ProtectedRoute>
            <CommunityLight />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/community-dark"
        element={(
          <ProtectedRoute>
            <CommunityDark />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/notability-light"
        element={(
          <ProtectedRoute>
            <NotabilityLight />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/notability-dark"
        element={(
          <ProtectedRoute>
            <NotabilityDark />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/placement-light"
        element={(
          <ProtectedRoute>
            <PlacementLight />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/placement-dark"
        element={(
          <ProtectedRoute>
            <PlacementDark />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/resume-college-light"
        element={(
          <ProtectedRoute>
            <ResumeCollegeLight />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/resume-college-dark"
        element={(
          <ProtectedRoute>
            <ResumeCollegeDark />
          </ProtectedRoute>
        )}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  useEffect(() => {
    setupAxiosInterceptors();
    console.log('Axios interceptors set up');
  }, []);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
