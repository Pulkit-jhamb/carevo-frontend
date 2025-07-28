import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Landing_page from './pages/landing_page';
import Quiz from './pages/quiz';
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import Signup from './pages/signup';
import MentalHealthChatbot from './pages/mental_health_si';
import React from 'react';
import Sidebar from './pages/sidebar';

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
      <div className="flex-1 ml-72">
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing_page />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/chat" element={<MentalHealthChatbot />} />
        </Route>
      </Routes>
    </Router>
  );
} 