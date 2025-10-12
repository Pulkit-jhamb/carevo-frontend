import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';
import { 
  Home, 
  User, 
  MessageSquare, 
  BookOpen, 
  Settings, 
  HelpCircle,
  LogOut,
  Menu,
  LayoutDashboard,
  FolderOpen,
  Users,
  MapPin,
  FileText,
  Briefcase
} from 'lucide-react';

const CollegeSidebarDark = ({ isCollapsed, setIsCollapsed }) => {
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
    { icon: Home, label: 'Home', path: '/carevo-homepage', active: location.pathname === '/carevo-homepage' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/college-dashboard-dark', active: location.pathname === '/dashboard' || location.pathname === '/college-dashboard-light' || location.pathname === '/college-dashboard-dark' },
    { icon: User, label: 'Psychometric', path: '/quiz-college-dark', active: location.pathname === '/quiz' || location.pathname === '/quiz-dark' || location.pathname === '/quiz-college-light' || location.pathname === '/quiz-college-dark' },
    { icon: MessageSquare, label: 'Chat', path: '/mental-health-dark', active: location.pathname === '/chat' || location.pathname === '/mental-health-dark' },
    { icon: FolderOpen, label: 'Notability', path: '/notability-dark', active: location.pathname === '/inventory' || location.pathname === '/inventory-dark' || location.pathname === '/notability-light' || location.pathname === '/notability-dark' },
    { icon: MapPin, label: 'Placement', path: '/placement-dark', active: location.pathname === '/placement' || location.pathname === '/placement-light' || location.pathname === '/placement-dark' },
    { icon: FileText, label: 'Resume', path: '/resume-college-dark', active: location.pathname === '/resume' || location.pathname === '/resume-college-light' || location.pathname === '/resume-college-dark' },
    { icon: Users, label: 'Community', path: '/community-dark', active: location.pathname === '/community' || location.pathname === '/community-dark' }
  ];

  const settingsItems = [
    { icon: Settings, label: 'Settings', path: '#' },
    { icon: HelpCircle, label: 'Help', path: '#' }
  ];

  // Handle navigation
  const handleNavigation = (path) => {
    if (path !== '#') {
      navigate(path);
    }
  };

  return (
    <div className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 flex flex-col ${isCollapsed ? 'w-16' : 'w-64'}`} style={{ backgroundColor: '#1a1a1a' }}>
      {/* Logo */}
      <div className="p-6">
        {isCollapsed ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">C</span>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-gray-700 transition-colors"
            >
              <Menu className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">C</span>
              </div>
              <span className="text-xl font-semibold text-white">Carevo</span>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-gray-700 transition-colors"
            >
              <Menu className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <div className="mb-8">
          {!isCollapsed && <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Navigation</h3>}
          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  item.active
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                title={isCollapsed ? item.label : ""}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'} text-white`} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {!isCollapsed && (
          <div>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Settings & Help</h3>
            <nav className="space-y-2">
              {settingsItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-left"
                >
                  <item.icon className="w-5 h-5 mr-3 flex-shrink-0 text-white" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="p-4">
        {isCollapsed ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1 text-gray-400 hover:text-white"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-white" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end">
            <button 
              onClick={handleLogout}
              className="p-1 text-gray-400 hover:text-white flex-shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeSidebarDark;
