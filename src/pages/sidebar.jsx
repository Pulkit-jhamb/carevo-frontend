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
  LayoutDashboard
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Get user info on component mount
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS, {
          withCredentials: true
        });
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
    try {
      await axios.post(API_ENDPOINTS.LOGOUT, {}, {
        withCredentials: true
      });
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("userType");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  // Navigation items with functional routes
  const sidebarItems = [
    { icon: Home, label: 'Home', path: '/carevo-homepage', active: location.pathname === '/carevo-homepage' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', active: location.pathname === '/dashboard' },
    { icon: User, label: 'Quiz', path: '/quiz', active: location.pathname === '/quiz' },
    { icon: MessageSquare, label: 'Chat', path: '/chat', active: location.pathname === '/chat' },
    { icon: BookOpen, label: 'Study Plan', path: '/study-plan', active: location.pathname === '/study-plan' }
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
    <div className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 flex flex-col ${isCollapsed ? 'w-16' : 'w-64'}`} style={{ backgroundColor: '#fafafa' }}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        {isCollapsed ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">C</span>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-gray-200 transition-colors"
            >
              <Menu className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">C</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Carevo</span>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-gray-200 transition-colors"
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
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                title={isCollapsed ? item.label : ""}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {!isCollapsed && (
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">Settings & Help</h3>
            <nav className="space-y-2">
              {settingsItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors text-left"
                >
                  <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        {isCollapsed ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-700 text-sm font-medium">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-700 text-sm font-medium">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
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

export default Sidebar;