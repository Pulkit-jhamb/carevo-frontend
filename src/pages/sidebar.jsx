import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';
import { 
  User, 
  MessageSquare, 
  BookOpen, 
  LayoutDashboard,
  FolderOpen,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  GraduationCap
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed, isDarkMode = false }) => {
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
    // Clear localStorage immediately to prevent race conditions
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userType");
    
    try {
      // Call backend logout (optional since JWT is stateless)
      await axios.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error("Logout failed:", error);
      // Continue with logout even if backend call fails
    }
    
    // Navigate to login
    navigate("/login", { replace: true });
  };

  // Navigation items with functional routes
  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', active: location.pathname === '/dashboard' },
    { icon: User, label: 'Quiz', path: '/quiz', active: location.pathname === '/quiz' },
    { icon: MessageSquare, label: 'Chat', path: '/chat', active: location.pathname === '/chat' },
    { icon: BookOpen, label: 'Study Plan', path: '/study-plan', active: location.pathname === '/study-plan' },
    { icon: GraduationCap, label: 'Classroom', path: '/classroom', active: location.pathname === '/classroom' || location.pathname === '/classroom-dark' },
    { icon: FolderOpen, label: 'Inventory', path: '/inventory', active: location.pathname === '/inventory' || location.pathname === '/inventory-dark' }
  ];



  // Handle navigation
  const handleNavigation = (path) => {
    if (path !== '#') {
      navigate(path);
    }
  };

  return (
    <div className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 flex flex-col ${isCollapsed ? 'w-16' : 'w-64'} ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Logo */}
      <div className="p-6">
        {isCollapsed ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">C</span>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-1 rounded transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-200 text-gray-300' 
                  : 'hover:bg-gray-600 hover:text-white text-gray-600'
              }`}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">C</span>
              </div>
              <span className={`text-xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Carevo</span>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-1 rounded transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-200 text-gray-300' 
                  : 'hover:bg-gray-600 hover:text-white text-gray-600'
              }`}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <div className="mb-8">
          {!isCollapsed && <h3 className={`text-xs font-medium uppercase tracking-wider mb-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>Navigation</h3>}
          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  item.active
                    ? (isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900')
                    : (isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-white hover:bg-gray-600')
                } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                title={isCollapsed ? item.label : ""}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'} ${
                  isDarkMode ? 'text-white' : ''
                }`} />
                {!isCollapsed && <span>{item.label}</span>}
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

      </div>

      {/* User Profile */}
      <div className="p-4">
        {isCollapsed ? (
          <div className="flex flex-col items-center space-y-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
            }`}>
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-700'
              }`}>
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className={`p-1 ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Logout"
            >
              <LogOut className={`w-4 h-4 ${isDarkMode ? 'text-white' : ''}`} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end">
            <button 
              onClick={handleLogout}
              className={`p-1 flex-shrink-0 ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Logout"
            >
              <LogOut className={`w-4 h-4 ${isDarkMode ? 'text-white' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;