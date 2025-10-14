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
  const [projects, setProjects] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showWorkModal, setShowWorkModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [semesters, setSemesters] = useState([]);
  const [overallCgpa, setOverallCgpa] = useState(0.0);
  const [totalCredits, setTotalCredits] = useState(0);
  const navigate = useNavigate();

  // Theme toggle handler
  const handleToggleTheme = () => {
    navigate("/college-dashboard-dark");
  };

  // Fetch current date from backend
  const fetchCurrentDate = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.CURRENT_DATE);
      setCurrentDate(response.data);
    } catch (error) {
      console.error("Failed to fetch current date:", error);
      // Fallback to local date
      const now = new Date();
      setCurrentDate({
        date: now.getDate(),
        month: now.toLocaleString('default', { month: 'long' }),
        year: now.getFullYear(),
        weekday: now.toLocaleString('default', { weekday: 'long' }),
        formatted_date: now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })
      });
    }
  };

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.PROJECTS);
      setProjects(response.data.projects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  // Fetch work experience
  const fetchWorkExperience = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.WORK_EXPERIENCE);
      setWorkExperience(response.data.workExperience);
    } catch (error) {
      console.error("Failed to fetch work experience:", error);
    }
  };

  // Fetch events
  const fetchEvents = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.EVENTS);
      setEvents(response.data.events);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  // Fetch semesters and CGPA
  const fetchSemesters = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.SEMESTERS);
      setSemesters(response.data.semesters);
      setOverallCgpa(response.data.overall_cgpa);
      setTotalCredits(response.data.total_credits);
    } catch (error) {
      console.error("Failed to fetch semesters:", error);
    }
  };

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
    fetchCurrentDate();
    fetchProjects();
    fetchWorkExperience();
    fetchEvents();
    fetchSemesters();
  }, []);

  // CRUD Functions for Projects
  const addProject = async (projectData) => {
    try {
      const response = await axios.post(API_ENDPOINTS.PROJECTS, projectData);
      if (response.status === 201) {
        fetchProjects(); // Refresh projects list
        setShowProjectModal(false);
      }
    } catch (error) {
      console.error("Failed to add project:", error);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      const response = await axios.delete(`${API_ENDPOINTS.PROJECTS}/${projectId}`);
      if (response.status === 200) {
        fetchProjects(); // Refresh projects list
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  // CRUD Functions for Work Experience
  const addWorkExperience = async (workData) => {
    try {
      const response = await axios.post(API_ENDPOINTS.WORK_EXPERIENCE, workData);
      if (response.status === 201) {
        fetchWorkExperience(); // Refresh work experience list
        setShowWorkModal(false);
      }
    } catch (error) {
      console.error("Failed to add work experience:", error);
    }
  };

  const deleteWorkExperience = async (experienceId) => {
    try {
      const response = await axios.delete(`${API_ENDPOINTS.WORK_EXPERIENCE}/${experienceId}`);
      if (response.status === 200) {
        fetchWorkExperience(); // Refresh work experience list
      }
    } catch (error) {
      console.error("Failed to delete work experience:", error);
    }
  };

  // CRUD Functions for Events
  const addEvent = async (eventData) => {
    try {
      const response = await axios.post(API_ENDPOINTS.EVENTS, eventData);
      if (response.status === 201) {
        fetchEvents(); // Refresh events list
        setShowEventModal(false);
      }
    } catch (error) {
      console.error("Failed to add event:", error);
    }
  };

  const deleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await axios.delete(`${API_ENDPOINTS.EVENTS}/${eventId}`);
        if (response.status === 200) {
          fetchEvents(); // Refresh events list
        }
      } catch (error) {
        console.error("Failed to delete event:", error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  // CRUD Functions for Semesters
  const addSemester = async (semesterData) => {
    try {
      const response = await axios.post(API_ENDPOINTS.SEMESTERS, semesterData);
      if (response.status === 201) {
        fetchSemesters(); // Refresh semesters list
        setShowSemesterModal(false);
      }
    } catch (error) {
      console.error("Failed to add semester:", error);
      alert('Failed to add semester. Please try again.');
    }
  };

  const deleteSemester = async (semesterId) => {
    if (window.confirm('Are you sure you want to delete this semester?')) {
      try {
        const response = await axios.delete(`${API_ENDPOINTS.SEMESTERS}/${semesterId}`);
        if (response.status === 200) {
          fetchSemesters(); // Refresh semesters list
        }
      } catch (error) {
        console.error("Failed to delete semester:", error);
        alert('Failed to delete semester. Please try again.');
      }
    }
  };

  // Sample data for college dashboard
  const collegeData = {
    cgpa: "8.5",
    semester: "6th",
    projects: projects.length,
    workExperience: workExperience.length,
    internships: 2,
    skills: ["React", "Node.js", "Python", "Machine Learning"]
  };

  return (
    <div className="flex bg-white min-h-screen">
      <CollegeSidebarLight isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <div className="bg-white px-8 py-5 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search anything"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 placeholder-gray-500"
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
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
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
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-600">About</h3>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{userName || "User"}</h2>
                    <p className="text-sm text-gray-600 mb-1">College: {user?.institute || "Not specified"}</p>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-sm text-gray-600">Year:</span>
                      <span className="text-sm font-medium text-gray-900">{user?.year || "Not specified"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600">Major:</span>
                      <span className="text-sm font-medium text-gray-900">{user?.major || "Not specified"}</span>
                    </div>
                  </div>

                  {/* Resume Card */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
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
                    </div>
                    <p className="text-sm text-gray-600">ATS Score</p>
                  </div>

                  {/* Projects Card */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-600">Projects</h3>
                      <div className="relative group">
                        <button className="text-gray-400 hover:text-gray-600 p-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-32 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button 
                            onClick={() => setShowProjectModal(true)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Add Project
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-3xl font-bold text-gray-900">{collegeData.projects}</h2>
                    </div>
                    <div className="space-y-1">
                      {projects.length > 0 ? (
                        projects.slice(0, 2).map((project, index) => (
                          <div key={project.id} className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">{project.title}</p>
                            <button 
                              onClick={() => deleteProject(project.id)}
                              className="text-red-400 hover:text-red-600 ml-2"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">No projects yet</p>
                      )}
                    </div>
                  </div>

                  {/* Work Experience Card */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-600">Work Experience</h3>
                      <div className="relative group">
                        <button className="text-gray-400 hover:text-gray-600 p-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-40 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button 
                            onClick={() => setShowWorkModal(true)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Add Experience
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-3xl font-bold text-gray-900">{collegeData.workExperience}</h2>
                    </div>
                    <div className="space-y-1">
                      {workExperience.length > 0 ? (
                        workExperience.slice(0, 2).map((experience, index) => (
                          <div key={experience.id} className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">{experience.title}</p>
                            <button 
                              onClick={() => deleteWorkExperience(experience.id)}
                              className="text-red-400 hover:text-red-600 ml-2"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">No experience yet</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* CGPA Section */}
                <div className="grid grid-cols-1 gap-6">
                  {/* Overall CGPA Display */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Overall CGPA</h3>
                        <p className="text-sm text-gray-600">Out of 10.0 • {totalCredits} Total Credits</p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-gray-900">{overallCgpa.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">/ 10.0</div>
                      </div>
                    </div>
                  </div>

                  {/* CGPA Chart */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Semester-wise CGPA</h3>
                      <button 
                        onClick={() => setShowSemesterModal(true)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                      >
                        Add Semester
                      </button>
                    </div>
                    <div className="h-64">
                      {semesters.length > 0 ? (
                        <>
                          {/* Bar Chart */}
                          <div className="flex items-end justify-center gap-4 h-40 mb-4 px-2">
                            {semesters.map((semester, index) => (
                              <div key={semester.id} className="flex flex-col items-center group relative">
                                <div className="relative">
                                  <div 
                                    className="w-8 bg-gradient-to-t from-gray-600 to-gray-400 rounded-t cursor-pointer hover:from-gray-500 hover:to-gray-300 transition-colors"
                                    style={{ height: `${(semester.sgpa / 10) * 120}px` }}
                                    title={`Semester ${semester.semester_number}: ${semester.sgpa} SGPA`}
                                  ></div>
                                  <button 
                                    onClick={() => deleteSemester(semester.id)}
                                    className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                    title="Delete semester"
                                  >
                                    ×
                                  </button>
                                </div>
                                <div className="mt-2 text-center">
                                  <div className="text-xs text-gray-900 font-medium">{semester.sgpa}</div>
                                  <div className="text-xs text-gray-600">Sem {semester.semester_number}</div>
                                  <div className="text-xs text-gray-500">{semester.credits}cr</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Legend */}
                          <div className="flex items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-gray-500 rounded"></div>
                              <span className="text-gray-600">SGPA (out of 10)</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-40">
                          <div className="text-center">
                            <div className="text-gray-600 mb-2">No semester data available</div>
                            <button 
                              onClick={() => setShowSemesterModal(true)}
                              className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                            >
                              Add Your First Semester
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Student Attendance */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
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
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const newDate = new Date(calendarDate);
                          newDate.setMonth(newDate.getMonth() - 1);
                          setCalendarDate(newDate);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => {
                          const newDate = new Date(calendarDate);
                          newDate.setMonth(newDate.getMonth() + 1);
                          setCalendarDate(newDate);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
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
                    {(() => {
                      const year = calendarDate.getFullYear();
                      const month = calendarDate.getMonth();
                      const firstDay = new Date(year, month, 1);
                      const lastDay = new Date(year, month + 1, 0);
                      const daysInMonth = lastDay.getDate();
                      const startingDayOfWeek = firstDay.getDay();
                      const today = new Date();
                      const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
                      
                      const days = [];
                      
                      // Empty cells for days before the first day of the month
                      for (let i = 0; i < startingDayOfWeek; i++) {
                        days.push(
                          <div key={`empty-${i}`} className="text-center text-sm py-2"></div>
                        );
                      }
                      
                      // Days of the month
                      for (let day = 1; day <= daysInMonth; day++) {
                        const isToday = isCurrentMonth && day === today.getDate();
                        const currentDateObj = new Date(year, month, day);
                        const isSelected = selectedDate.toDateString() === currentDateObj.toDateString();
                        days.push(
                          <div 
                            key={day} 
                            onClick={() => setSelectedDate(currentDateObj)}
                            className={`text-center text-sm py-2 cursor-pointer hover:bg-gray-100 rounded transition-colors ${
                              isSelected ? 'bg-gray-600 text-white' : 
                              isToday ? 'bg-gray-500 text-white' : 'text-gray-900 hover:text-gray-700'
                            }`}
                          >
                            {day}
                          </div>
                        );
                      }
                      
                      return days;
                    })()}
                  </div>
                  
                  <button 
                    onClick={() => setShowEventModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Event
                  </button>
                </div>

                {/* Events for Selected Date */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Events</h3>
                      <p className="text-sm text-gray-600">
                        {selectedDate.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowEventModal(true)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {(() => {
                      const selectedDateString = selectedDate.toISOString().split('T')[0];
                      const filteredEvents = events.filter(event => event.date === selectedDateString);
                      
                      return filteredEvents.length > 0 ? (
                        filteredEvents.map((event, index) => {
                        const eventDate = new Date(event.date);
                        const colors = [
                          { bg: 'bg-gray-50', border: 'border-gray-500' },
                          { bg: 'bg-green-50', border: 'border-green-500' },
                          { bg: 'bg-purple-50', border: 'border-purple-500' },
                          { bg: 'bg-yellow-50', border: 'border-yellow-500' }
                        ];
                        const colorSet = colors[index % colors.length];
                        
                        return (
                          <div key={event.id} className="flex gap-3 group">
                            <div className="text-xs text-gray-500 w-16 mt-1">
                              {event.time || 'All Day'}
                            </div>
                            <div className={`flex-1 ${colorSet.bg} border-l-4 ${colorSet.border} p-3 rounded relative`}>
                              <div className="font-medium text-gray-900">{event.title}</div>
                              <div className="text-sm text-gray-600">
                                {eventDate.toLocaleDateString('en-US', { 
                                  weekday: 'short', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                                {event.time && ` • ${event.time}`}
                              </div>
                              {event.description && (
                                <div className="text-xs text-gray-500 mt-1">{event.description}</div>
                              )}
                              <button 
                                onClick={() => deleteEvent(event.id)}
                                className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete event"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        );
                        })
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-gray-600 mb-2">No events for this date</div>
                          <button 
                            onClick={() => setShowEventModal(true)}
                            className="text-sm text-gray-600 hover:text-gray-700"
                          >
                            Add an event
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Modal */}
      {showProjectModal && (
        <ProjectModal 
          onClose={() => setShowProjectModal(false)}
          onSubmit={addProject}
        />
      )}

      {/* Work Experience Modal */}
      {showWorkModal && (
        <WorkExperienceModal 
          onClose={() => setShowWorkModal(false)}
          onSubmit={addWorkExperience}
        />
      )}

      {/* Event Modal */}
      {showEventModal && (
        <EventModal 
          onClose={() => setShowEventModal(false)}
          onSubmit={addEvent}
        />
      )}

      {/* Semester Modal */}
      {showSemesterModal && (
        <SemesterModal 
          onClose={() => setShowSemesterModal(false)}
          onSubmit={addSemester}
        />
      )}
    </div>
  );
}

// Project Modal Component
function ProjectModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({ title: title.trim(), link: link.trim() });
      setTitle("");
      setLink("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add Project</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub Link (Optional)
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://github.com/username/project"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Work Experience Modal Component
function WorkExperienceModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [certificate, setCertificate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({ 
        title: title.trim(), 
        link: link.trim(), 
        certificate: certificate.trim() 
      });
      setTitle("");
      setLink("");
      setCertificate("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add Work Experience</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (Intern/Job) *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Software Intern at Google"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repository Link (Optional)
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://github.com/username/work-repo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate (Optional)
            </label>
            <input
              type="text"
              value={certificate}
              onChange={(e) => setCertificate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Certificate name or link"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors"
            >
              Add Experience
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Event Modal Component
function EventModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && date) {
      onSubmit({ 
        title: title.trim(), 
        date, 
        time: time.trim(),
        description: description.trim() 
      });
      setTitle("");
      setDate("");
      setTime("");
      setDescription("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add Event</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter event title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time (Optional)
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Event description"
              rows="3"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Semester Modal Component
function SemesterModal({ onClose, onSubmit }) {
  const [semesterNumber, setSemesterNumber] = useState("");
  const [sgpa, setSgpa] = useState("");
  const [credits, setCredits] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (semesterNumber && sgpa && credits) {
      const sgpaValue = parseFloat(sgpa);
      const creditsValue = parseInt(credits);
      
      if (sgpaValue < 0 || sgpaValue > 10) {
        alert('SGPA must be between 0 and 10');
        return;
      }
      
      if (creditsValue <= 0) {
        alert('Credits must be a positive number');
        return;
      }
      
      onSubmit({ 
        semester_number: parseInt(semesterNumber),
        sgpa: sgpaValue,
        credits: creditsValue
      });
      setSemesterNumber("");
      setSgpa("");
      setCredits("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add Semester</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semester Number *
            </label>
            <input
              type="number"
              value={semesterNumber}
              onChange={(e) => setSemesterNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 1, 2, 3..."
              min="1"
              max="12"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SGPA (out of 10) *
            </label>
            <input
              type="number"
              step="0.01"
              value={sgpa}
              onChange={(e) => setSgpa(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 8.5"
              min="0"
              max="10"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Credits *
            </label>
            <input
              type="number"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 20, 24, 18..."
              min="1"
              required
            />
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-600">
              <strong>Note:</strong> Your overall CGPA will be calculated as: 
              (Sum of SGPA × Credits) ÷ Total Credits
            </p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors"
            >
              Add Semester
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}