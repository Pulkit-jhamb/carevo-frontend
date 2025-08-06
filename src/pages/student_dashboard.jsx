import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config";
import axios from "axios";

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    fetch(`${API_ENDPOINTS.USER}?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      })
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS, {
          withCredentials: true
        });
        if (response.data.authenticated && response.data.user) {
          setUserName(response.data.user.name || "Aanya Mehra");
          setUserEmail(response.data.user.email);
        }
      } catch (error) {
        console.error("Failed to get user info:", error);
      }
    };
    getUserInfo();
  }, []);

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

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      )
    },
    {
      label: "Quiz",
      href: "/quiz",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      label: "AI Assistant",
      href: "/chat",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    }
  ];

  // Sample data for the student dashboard
  const academicPerformance = [
    { term: "Term 1", percentage: 81, color: "bg-gray-700" },
    { term: "Term 2", percentage: 88, color: "bg-gray-500" },
    { term: "Term 3", percentage: 89, color: "bg-black" }
  ];

  const topSubjects = [
    "Mathematics",
    "Science", 
    "Computer Applications",
    "English"
  ];

  const extracurricularActivities = [
    { activity: "School Debate Team", role: "Vice Captain" },
    { activity: "Science Club", role: "Event Organizer" },
    { activity: "Dance Troupe", role: "Lead Performer" },
    { activity: "Environment Club", role: "Member" }
  ];

  const certifications = [
    "Microsoft Office Specialist",
    "Python Basics - Code.org",
    "Creative Writing Workshop",
    "Math Olympiad Level 1"
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-black">Carevo</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</div>
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-black'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </a>
              );
            })}
          </div>

          <div className="mt-8 space-y-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Settings & Help</div>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help
            </a>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold">{userName.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 flex items-center gap-2"
            >
              LOGOUT
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* About Section */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {user?.name || "Aanya Mehra"}
                    </h3>
                    <p className="text-gray-700 font-medium mb-1">
                      {user?.institute || "SPRINGDALE HIGH SCHOOL"}
                    </p>
                    <p className="text-gray-600 mb-3">
                      {user?.year ? `Year ${user.year}` : "10TH GRADE"}
                    </p>
                    <div className="space-y-1">
                      <div className="h-2 bg-gray-200 rounded w-full"></div>
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Performance Section */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Academic Performance</h2>
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    View Report
                  </button>
                </div>
                
                {/* Donut Chart */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="2"
                        strokeDasharray="81, 100"
                        strokeDashoffset="0"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#6b7280"
                        strokeWidth="2"
                        strokeDasharray="88, 100"
                        strokeDashoffset="-81"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeDasharray="89, 100"
                        strokeDashoffset="-169"
                      />
                    </svg>
                  </div>
                </div>
                
                {/* Performance Data */}
                <div className="flex justify-between">
                  {academicPerformance.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className={`w-2 h-2 ${item.color} rounded-full`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.term}</p>
                        <p className="text-sm text-gray-600">{item.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Subjects Section */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Top Subjects</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Below are the student's highest scoring subjects
                </p>
                <div className="space-y-3">
                  {topSubjects.map((subject, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <span className="text-sm text-gray-700">{subject}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extracurricular Activities Section */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Extracurricular Activities</h2>
                <p className="text-sm text-gray-600 mb-4">
                  The following are the student's activities and roles.
                </p>
                <div className="space-y-3">
                  {extracurricularActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-gray-300 rounded-full mt-1"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                        <p className="text-xs text-gray-600">- {activity.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications Section */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 lg:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-900">Certifications</h2>
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    Upload
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  The following certifications have been completed
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <span className="text-sm text-gray-700">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 