import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config";
import axios from "axios";
import CollegeSidebarLight from "./sidebar_college_light"; // College light sidebar

export default function CollegeDashboardLight() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  // Theme toggle handler
  const handleToggleTheme = () => {
    navigate("/college-dashboard-dark");
  };

  // Get current date for calendar
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      setIsLoading(false);
      return;
    }

    const getUserInfo = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS);
        if (response.data.authenticated && response.data.user) {
          setUser(response.data.user);
          setUserName(response.data.user.name || "User");
          setUserEmail(response.data.user.email);
        }
      } catch (error) {
        console.error("Failed to get user info:", error);
      }
      setIsLoading(false);
    };

    getUserInfo();
  }, []);

  // Sample data for college dashboard
  const collegeData = {
    cgpa: "8.5",
    semester: "6th",
    projects: 2,
    workExperience: 3,
    internships: 2,
    skills: ["React", "Node.js", "Python", "Machine Learning"]
  };

  return (
    <div className="flex bg-white min-h-screen">
      <CollegeSidebarLight isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search anything"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 placeholder-gray-500"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex items-center gap-4">
            {/* Theme toggle button */}
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-full bg-gray-100 text-black hover:bg-gray-200 transition-colors"
              title="Switch to Dark Mode"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">{userName || 'Harshit Dua'}</span>
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left/Center Content - 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                {/* Summary Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* About Card */}
                  <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-600">About</h3>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{userName || "Harshit Dua"}</h2>
                    <p className="text-sm text-gray-600 mb-1">College: TIET</p>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600">Year:</span>
                      <span className="text-sm font-medium text-gray-900">3rd</span>
                    </div>
                  </div>

                  {/* Resume Card */}
                  <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-600">Resume</h3>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-3xl font-bold text-gray-900">88%</h2>
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">ATS Score</p>
                  </div>

                  {/* Projects Card */}
                  <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-600">Projects</h3>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-3xl font-bold text-gray-900">{collegeData.projects}</h2>
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Electronics Buggy</p>
                  </div>

                  {/* Work Experience Card */}
                  <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-600">Work Experience</h3>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-3xl font-bold text-gray-900">{collegeData.workExperience}</h2>
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Intern at Google</p>
                  </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* CGPA Chart */}
                  <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">CGPA</h3>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        Calculate CGPA
                      </button>
                    </div>
                    <div className="h-64">
                      {/* Bar Chart */}
                      <div className="flex items-end justify-center gap-4 h-40 mb-4 px-2">
                        {/* Semester bars */}
                        {[
                          { sem: '1', midTerm: 7.5, endTerm: 8.2 },
                          { sem: '2', midTerm: 8.0, endTerm: 8.5 },
                          { sem: '3', midTerm: 7.8, endTerm: 8.3 },
                          { sem: '4', midTerm: 8.2, endTerm: 8.7 },
                          { sem: '5', midTerm: 8.5, endTerm: 9.0 },
                          { sem: '6', midTerm: 8.3, endTerm: 8.8 }
                        ].map((data, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div className="flex items-end gap-1 mb-2">
                              {/* Mid Term Bar */}
                              <div 
                                className="w-4 bg-gray-400 rounded-t"
                                style={{ height: `${(data.midTerm / 10) * 100}px` }}
                                title={`Mid Term: ${data.midTerm}`}
                              ></div>
                              {/* End Term Bar */}
                              <div 
                                className="w-4 bg-teal-500 rounded-t"
                                style={{ height: `${(data.endTerm / 10) * 100}px` }}
                                title={`End Term: ${data.endTerm}`}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{data.sem}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Legend */}
                      <div className="flex items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-400 rounded"></div>
                          <span className="text-gray-600">Mid Term</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-teal-500 rounded"></div>
                          <span className="text-gray-600">End Term</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Student Attendance */}
                  <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Student Attendance</h3>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        Calculate Attendance
                      </button>
                    </div>
                    <div className="h-64 px-4">
                      {/* Line Chart */}
                      <div className="relative h-36 mb-6">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 350 120">
                          {/* Grid lines */}
                          <defs>
                            <pattern id="grid" width="50" height="20" patternUnits="userSpaceOnUse">
                              <path d="M 50 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid)" />
                          
                          {/* Attendance line (Present) */}
                          <polyline
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                            points="40,90 90,70 140,75 190,60 240,55 290,50"
                          />
                          
                          {/* Absent line */}
                          <polyline
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="3"
                            points="40,100 90,95 140,90 190,85 240,80 290,75"
                          />
                          
                          {/* Data points */}
                          {[40, 90, 140, 190, 240, 290].map((x, i) => (
                            <g key={i}>
                              <circle cx={x} cy={[90, 70, 75, 60, 55, 50][i]} r="4" fill="#3b82f6" />
                              <circle cx={x} cy={[100, 95, 90, 85, 80, 75][i]} r="4" fill="#ef4444" />
                            </g>
                          ))}
                        </svg>
                        
                        {/* X-axis labels */}
                        <div className="flex justify-between text-xs text-gray-500 mt-2 px-6">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <span key={day}>{day}</span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Legend */}
                      <div className="flex items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-600">Present</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-gray-600">Absent</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Calendar */}
              <div className="space-y-6">
                {/* Calendar */}
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">{currentMonth} {currentYear}</h3>
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                    {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                      <div key={day} className={`text-center text-sm py-2 cursor-pointer hover:bg-gray-100 rounded ${day === currentDay ? 'bg-blue-500 text-white' : 'text-gray-900'}`}>
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-600 hover:text-gray-900">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Event
                  </button>
                </div>

                {/* Today's Schedule */}
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Wednesday, 12 July</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="text-xs text-gray-500 w-16">08:00 AM</div>
                      <div className="flex-1 bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                        <div className="font-medium text-gray-900">Mathematics</div>
                        <div className="text-sm text-gray-600">08:00 AM - 09:00 AM</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="text-xs text-gray-500 w-16">10:00 AM</div>
                      <div className="flex-1 bg-green-50 border-l-4 border-green-500 p-3 rounded">
                        <div className="font-medium text-gray-900">Mechanics</div>
                        <div className="text-sm text-gray-600">10:00 AM - 12:00 PM</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="text-xs text-gray-500 w-16">01:00 PM</div>
                      <div className="flex-1 bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
                        <div className="font-medium text-gray-900">C Programming</div>
                        <div className="text-sm text-gray-600">01:00 PM - 03:00 PM</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="text-xs text-gray-500 w-16">04:00 PM</div>
                      <div className="flex-1 bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                        <div className="font-medium text-gray-900">Training Session</div>
                        <div className="text-sm text-gray-600">04:00 PM - 05:00 PM</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}