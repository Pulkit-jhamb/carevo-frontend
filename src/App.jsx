import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Landing_page from './pages/landing_page';
import Quiz from './pages/quiz';
import Dashboard from './pages/dashboard';
import StudentDashboard from './pages/student_dashboard';
import Login from './pages/login';
import Signup from './pages/signup';
import MentalHealthChatbot from './pages/mental_health_si';
import StudyPlan from './pages/study_plan';
import React, { useState, useEffect } from 'react';
// import Sidebar from './pages/sidebar';
import axios from 'axios';
import { API_ENDPOINTS } from './config';
import { useAuthRedirect } from './hooks/useAuthRedirect';
import CarevoHomepage from './pages/home';


function UserIcon() {
  return (
    <span className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-black text-2xl shadow">
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
      </svg>
    </span>
  );
}

function TopNavbar() {
  return (
    <div className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur border-b border-gray-200 flex items-center justify-between px-8 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-black tracking-wide">Carevo</span>
      </div>
      <div className="flex items-center gap-3">
        <UserIcon />
      </div>
    </div>
  );
}

function MainLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Outlet />
      </div>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS, {
          withCredentials: true
        });
        setIsAuthenticated(response.data.authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Prevent going back to login page when authenticated
  useEffect(() => {
    if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/signup')) {
      navigate('/carevo-homepage', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f9fb] via-[#e0e7ef] to-[#c7d2fe]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
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

// Dashboard Selector Component
function DashboardSelector() {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const type = localStorage.getItem("userType");
    console.log("DashboardSelector - userType from localStorage:", type);
    setUserType(type);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f9fb] via-[#e0e7ef] to-[#c7d2fe]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show student dashboard for school students, college dashboard for college students
  console.log("UserType detected:", userType); // Debug log
  if (userType === "school") {
    return <StudentDashboard />;
  } else {
    return <Dashboard />;
  }
}

// Public Route Component - redirects authenticated users to chat
function PublicRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS, {
          withCredentials: true
        });
        setIsAuthenticated(response.data.authenticated);
        
        // If authenticated, redirect to dashboard
        if (response.data.authenticated) {
          navigate('/carevo-homepage', { replace: true });
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f9fb] via-[#e0e7ef] to-[#c7d2fe]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

function AppRoutes() {
  useAuthRedirect(); // Use the custom hook for auth redirects
  
  return (
    <Routes>
      <Route path="/" element={<Landing_page />} />
      
      {/* Public routes - redirect authenticated users to chat */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute>
          <Signup />
        </PublicRoute>
      } />
      
      {/* Dashboard route - has its own sidebar */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardSelector />
        </ProtectedRoute>
      } />
      
      {/* Quiz route - has its own sidebar */}
      <Route path="/quiz" element={
        <ProtectedRoute>
          <Quiz />
        </ProtectedRoute>
      } />
      
      {/* Chat route without MainLayout since it has its own sidebar */}
      <Route path="/chat" element={
        <ProtectedRoute>
          <MentalHealthChatbot />
        </ProtectedRoute>
      } />

      {/* Carevo Homepage route - no sidebar */}
      <Route path="/carevo-homepage" element={
        <ProtectedRoute>
          <CarevoHomepage />
        </ProtectedRoute>
      } />
        

      {/* Study Plan route - has its own sidebar */}
      <Route path="/study-plan" element={
        <ProtectedRoute>
          <StudyPlan />
        </ProtectedRoute>
      } />
      
      {/* Catch all route - redirect to dashboard for authenticated users */}
      <Route path="*" element={
        <ProtectedRoute>
          <Navigate to="/carevo-homepage" replace />
        </ProtectedRoute>
      } />
      
      
    </Routes>
  );
}