import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';
import { 
  User, 
  MessageSquare, 
  BookOpen, 
  LogOut,
  Menu,
  LayoutDashboard,
  FolderOpen,
  Users,
  MapPin,
  FileText,
  Briefcase
} from 'lucide-react';

const CollegeSidebarLight = ({ isCollapsed, setIsCollapsed, isDarkMode = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Get user info on component mount
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS);
        if (response.data.authenticated && response.data.user) {
          setUserName(response.data.user.name || "User");
          setUserEmail(response.data.user.email);
        }
      } catch (error) {
        console.error("Failed to get user info:", error);
        navigate("/login");
      }
    };
    getUserInfo();
  }, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userType");
    
    try {
      await axios.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error("Logout failed:", error);
    }
    
    navigate("/login", { replace: true });
  };

  // Navigation items for college students
  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/college-dashboard-light', active: location.pathname === '/dashboard' || location.pathname === '/college-dashboard-light' || location.pathname === '/college-dashboard-dark' },
    { icon: User, label: 'Psychometric', path: '/quiz-college-light', active: location.pathname === '/quiz' || location.pathname === '/quiz-dark' || location.pathname === '/quiz-college-light' || location.pathname === '/quiz-college-dark' },
    { icon: MessageSquare, label: 'Chat', path: '/mental-health-college-light', active: location.pathname === '/chat' || location.pathname === '/mental-health-college-light' || location.pathname === '/mental-health-college-dark' },
    { icon: FolderOpen, label: 'Notability', path: '/notability-light', active: location.pathname === '/inventory' || location.pathname === '/inventory-dark' || location.pathname === '/notability-light' || location.pathname === '/notability-dark' },
    { icon: MapPin, label: 'Placement', path: '/placement-light', active: location.pathname === '/placement' || location.pathname === '/placement-light' || location.pathname === '/placement-dark' },
    { icon: FileText, label: 'Resume', path: '/resume-college-light', active: location.pathname === '/resume' || location.pathname === '/resume-college-light' || location.pathname === '/resume-college-dark' },
    { icon: Users, label: 'Community', path: '/community', active: location.pathname === '/community' || location.pathname === '/community-dark' }
  ];


  // Handle navigation
  const handleNavigation = (path) => {
    if (path !== '#') {
      navigate(path);
    }
  };

  return (
    <div className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 flex flex-col ${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200`}>
      {/* Logo */}
      <div className="p-6">
        {isCollapsed ? (
          <div className="flex flex-col items-center space-y-3">
            <span className="text-lg font-semibold text-gray-900">Ca</span>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-semibold text-gray-900">Carevo</span>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <div className="mb-8">
          {!isCollapsed && <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">Navigation</h3>}
          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  item.active
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                title={isCollapsed ? item.label : ""}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

      </div>

      {/* User Profile */}
      <div className="p-4">
        {isCollapsed ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm font-medium">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1 text-gray-600 hover:text-gray-900"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end">
            <button 
              onClick={handleLogout}
              className="p-1 text-gray-600 hover:text-gray-900 flex-shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeSidebarLight;
