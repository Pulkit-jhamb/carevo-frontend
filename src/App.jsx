import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Quiz from './pages/quiz';
import Dashboard from './pages/dashboard';
import StudentDashboard from './pages/student_dashboard';
import StudentDashboardSimple from './pages/student_dashboard_simple';
import TestDashboard from './pages/test_dashboard';
import StudentDashboardDark from './pages/student_dashboard_dark';
import Login from './pages/login';
import Signup from './pages/signup';
import MentalHealthChatbot from './pages/mental_health_si';
import StudyPlan from './pages/study_plan';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from './config';
import { useAuthRedirect } from './hooks/useAuthRedirect';
import StudentOnboardingForm from './pages/onboarding';
import { setupAxiosInterceptors } from './utils/axiosConfig';
import Classroom from './pages/classroom';
import ClassroomLight from './pages/classroom_light';
import InventoryLight from './pages/inventory_light';
import InventoryDark from './pages/inventory_dark';
import QuizDark from './pages/quiz_dark';
import MentalHealthDark from './pages/mental_health_dark';
import MentalHealthCollegeLight from './pages/mental_health_college_light';
import MentalHealthCollegeDark from './pages/mental_health_college_dark';
import CollegeDashboardLight from './pages/college_dashbpard_lt';
import CollegeDashboardDark from './pages/college_dashboard_dark';
import CommunityLight from './pages/community_light';
import CommunityDark from './pages/community_dark';
import NotabilityLight from './pages/notability_light';
import NotabilityDark from './pages/notability_dark';
import PlacementLight from './pages/placement_light';
import PlacementDark from './pages/placement_dark';
import QuizCollegeLight from './pages/quiz_college_light';
import QuizCollegeDark from './pages/quiz_college_dark';
import ResumeCollegeLight from './pages/resume_college_light';
import ResumeCollegeDark from './pages/resume_college_dark';

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

// 🚨 UPDATED PROTECTED ROUTE COMPONENT
function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.log('❌ No token found');
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // The axios interceptor will automatically add the token header
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS);
        
        if (response.data.authenticated) {
          console.log('✅ Protected route: User authenticated');
          setIsAuthenticated(true);
        } else {
          console.log('❌ Protected route: User not authenticated');
          localStorage.removeItem('authToken');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userName');
          localStorage.removeItem('userType');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('🚨 Protected route auth check failed:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userType');
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
      navigate('/dashboard', { replace: true });
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

// Dashboard Selector Component - REMOVED theme toggle
function DashboardSelector() {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const type = localStorage.getItem("userType");
    setUserType(type);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f9fb] via-[#e0e7ef] to-[#c7d2fe]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  // Show student dashboard for school students, college dashboard for college students
  if (userType === "school") {
    return <StudentDashboard />;
  } else if (userType === "college") {
    return <CollegeDashboardLight />;
  } else {
    // Fallback: if userType is null, undefined, or unexpected value
    return <StudentDashboard />;
  }
}

// 🚨 UPDATED PUBLIC ROUTE COMPONENT
function PublicRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // The axios interceptor will automatically add the token header
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS);
        
        if (response.data.authenticated) {
          setIsAuthenticated(true);
          // If authenticated, redirect to dashboard
          navigate('/dashboard', { replace: true });
        } else {
          setIsAuthenticated(false);
          // Clear token if not valid
          localStorage.removeItem('authToken');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userName');
          localStorage.removeItem('userType');
        }
      } catch (error) {
        console.error('Public route auth check failed:', error);
        setIsAuthenticated(false);
        // Clear token on error
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userType');
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
  // 🚨 NEW: Set up axios interceptors when app starts
  useEffect(() => {
    setupAxiosInterceptors();
    console.log('✅ Axios interceptors set up');
  }, []);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

function AppRoutes() {
  useAuthRedirect();
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Public routes - redirect authenticated users to dashboard */}
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
      <Route path="/dashboard-dark" element={
        <ProtectedRoute>
          <StudentDashboardDark />
        </ProtectedRoute>
      } />
      
      {/* Direct student dashboard routes for testing */}
      <Route path="/student-dashboard" element={
        <ProtectedRoute>
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/student-dashboard-simple" element={
        <ProtectedRoute>
          <StudentDashboardSimple />
        </ProtectedRoute>
      } />
      <Route path="/test-dashboard" element={
        <ProtectedRoute>
          <TestDashboard />
        </ProtectedRoute>
      } />
      
      {/* College Dashboard routes */}
      <Route path="/college-dashboard-light" element={
        <ProtectedRoute>
          <CollegeDashboardLight />
        </ProtectedRoute>
      } />
      <Route path="/college-dashboard-dark" element={
        <ProtectedRoute>
          <CollegeDashboardDark />
        </ProtectedRoute>
      } />
      
        

      {/* Study Plan route - has its own sidebar */}
      <Route path="/study-plan" element={
        <ProtectedRoute>
          <StudyPlan />
        </ProtectedRoute>
      } />
      
      {/* Onboarding route - no sidebar */}
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <StudentOnboardingForm />
        </ProtectedRoute>
      } />
      
      {/* Classroom routes - have their own sidebars */}
      <Route path="/classroom" element={
        <ProtectedRoute>
          <ClassroomLight />
        </ProtectedRoute>
      } />
      <Route path="/classroom-dark" element={
        <ProtectedRoute>
          <Classroom />
        </ProtectedRoute>
      } />
      
      {/* Inventory routes - have their own sidebars */}
      <Route path="/inventory" element={
        <ProtectedRoute>
          <InventoryLight />
        </ProtectedRoute>
      } />
      <Route path="/inventory-dark" element={
        <ProtectedRoute>
          <InventoryDark />
        </ProtectedRoute>
      } />
      
      {/* Quiz routes - have their own sidebars */}
      <Route path="/quiz" element={
        <ProtectedRoute>
          <Quiz />
        </ProtectedRoute>
      } />
      <Route path="/quiz-dark" element={
        <ProtectedRoute>
          <QuizDark />
        </ProtectedRoute>
      } />
      
      {/* Mental Health routes - have their own sidebars */}
      <Route path="/chat" element={
        <ProtectedRoute>
          <MentalHealthChatbot />
        </ProtectedRoute>
      } />
      <Route path="/mental-health-dark" element={
        <ProtectedRoute>
          <MentalHealthDark />
        </ProtectedRoute>
      } />
      
      {/* College Mental Health routes - have their own college sidebars */}
      <Route path="/mental-health-college-light" element={
        <ProtectedRoute>
          <MentalHealthCollegeLight />
        </ProtectedRoute>
      } />
      <Route path="/mental-health-college-dark" element={
        <ProtectedRoute>
          <MentalHealthCollegeDark />
        </ProtectedRoute>
      } />
      
      {/* Community routes - have their own sidebars */}
      <Route path="/community" element={
        <ProtectedRoute>
          <CommunityLight />
        </ProtectedRoute>
      } />
      <Route path="/community-dark" element={
        <ProtectedRoute>
          <CommunityDark />
        </ProtectedRoute>
      } />
      
      {/* Notability routes - have their own sidebars */}
      <Route path="/notability-light" element={
        <ProtectedRoute>
          <NotabilityLight />
        </ProtectedRoute>
      } />
      <Route path="/notability-dark" element={
        <ProtectedRoute>
          <NotabilityDark />
        </ProtectedRoute>
      } />
      
      {/* Placement routes - have their own sidebars */}
      <Route path="/placement-light" element={
        <ProtectedRoute>
          <PlacementLight />
        </ProtectedRoute>
      } />
      <Route path="/placement-dark" element={
        <ProtectedRoute>
          <PlacementDark />
        </ProtectedRoute>
      } />
      
      {/* College Quiz routes - have their own sidebars */}
      <Route path="/quiz-college-light" element={
        <ProtectedRoute>
          <QuizCollegeLight />
        </ProtectedRoute>
      } />
      <Route path="/quiz-college-dark" element={
        <ProtectedRoute>
          <QuizCollegeDark />
        </ProtectedRoute>
      } />
      
      {/* College Resume routes - have their own sidebars */}
      <Route path="/resume-college-light" element={
        <ProtectedRoute>
          <ResumeCollegeLight />
        </ProtectedRoute>
      } />
      <Route path="/resume-college-dark" element={
        <ProtectedRoute>
          <ResumeCollegeDark />
        </ProtectedRoute>
      } />
      
      {/* Catch all route - redirect to dashboard for authenticated users */}
      <Route path="*" element={
        <ProtectedRoute>
          <Navigate to="/dashboard" replace />
        </ProtectedRoute>
      } />
    </Routes>
  );
}