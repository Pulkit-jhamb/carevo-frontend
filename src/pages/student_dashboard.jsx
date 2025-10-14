import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config";
import axios from "axios";
import Sidebar from "./sidebar";

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showConclusionModal, setShowConclusionModal] = useState(false);
  const [showTermModal, setShowTermModal] = useState(false);
  const [showExtracurricularModal, setShowExtracurricularModal] = useState(false);
  const [showCertificationsModal, setShowCertificationsModal] = useState(false);
  const [termData, setTermData] = useState([]);
  const [editTermData, setEditTermData] = useState([]);
  const [extracurricularActivities, setExtracurricularActivities] = useState([]);
  const [editExtracurricularActivities, setEditExtracurricularActivities] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [editCertifications, setEditCertifications] = useState([]);
  const [showSubjectsModal, setShowSubjectsModal] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [editSubjects, setEditSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [reportView, setReportView] = useState('Month');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [editTasks, setEditTasks] = useState([]);
  const navigate = useNavigate();
  
  // Tasks for calendar overlay - now editable
  const [calendarTasks, setCalendarTasks] = useState([
    { day: 5, task: 'Math Test', color: 'bg-blue-500', time: '10:00 AM' },
    { day: 12, task: 'Science Project', color: 'bg-green-500', time: '2:00 PM' },
    { day: 18, task: 'History Essay', color: 'bg-purple-500', time: '11:30 AM' },
    { day: 25, task: 'Physics Lab', color: 'bg-red-500', time: '1:00 PM' },
    { day: 28, task: 'English Exam', color: 'bg-yellow-500', time: '9:00 AM' }
  ]);

  // Get current date for calendar and schedule
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const currentDayName = currentDate.toLocaleString('default', { weekday: 'long' });

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    
    // Always set loading to false after a short delay to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    if (!email) {
      clearTimeout(loadingTimeout);
      setIsLoading(false);
      return;
    }

    fetch(`${API_ENDPOINTS.USER}?email=${encodeURIComponent(email)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        clearTimeout(loadingTimeout);
        setUser(data);
        setTermData(
          data.termData && data.termData.length === 4
            ? data.termData
            : [
                { term: "Term 1", percentage: "" },
                { term: "Term 2", percentage: "" },
                { term: "Term 3", percentage: "" },
                { term: "Term 4", percentage: "" }
              ]
        );
        setExtracurricularActivities(data.extracurricularActivities || []);
        setCertifications(data.certifications || []);
        setSubjects(data.subjects || []);
        setTeachers(data.teachers || []);
        setSchedule(data.schedule || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        clearTimeout(loadingTimeout);
        setIsLoading(false);
      });

    return () => clearTimeout(loadingTimeout);
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS, {
          withCredentials: true
        });
        if (response.data.authenticated && response.data.user) {
          setUserName(response.data.user.name || "");
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
      await axios.post(API_ENDPOINTS.LOGOUT, {}, { withCredentials: true });
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("userType");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  function getConclusionPreview(text, limit = 120) {
    if (!text) return "";
    if (text.length <= limit) return text;
    const trimmed = text.slice(0, limit);
    const lastSpace = trimmed.lastIndexOf(" ");
    return trimmed.slice(0, lastSpace) + "... more";
  }

  function getAveragePercentage(termData) {
    if (!termData.length) return 0;
    const validTerms = termData.filter(item => item.percentage && item.percentage !== "");
    if (validTerms.length === 0) return 0;
    const sum = validTerms.reduce((acc, item) => acc + parseFloat(item.percentage), 0);
    return Math.round(sum / validTerms.length);
  }

  // Calculate total classes based on schedule and subjects
  function getTotalClasses() {
    if (schedule.length > 0) {
      // If schedule data exists, calculate based on weekly schedule * weeks
      return schedule.length * 52; // Assume weekly schedule for a year
    }
    if (subjects.length > 0) {
      // Fallback: estimate based on subjects (assume 3 classes per week per subject)
      return subjects.length * 3 * 52;
    }
    return 0;
  }

  // Calculate attended classes based on performance
  function getAttendedClasses() {
    const totalClasses = getTotalClasses();
    if (totalClasses === 0) return 0;
    
    if (subjects.length > 0) {
      const avgPerformance = subjects.reduce((sum, subject) => sum + (subject.marks || 0), 0) / subjects.length;
      // Estimate attendance based on performance (higher performance suggests better attendance)
      const attendanceRate = Math.min(0.95, Math.max(0.60, (avgPerformance / 100) * 0.85 + 0.15));
      return Math.round(totalClasses * attendanceRate);
    }
    
    if (termData.length > 0) {
      const avgTermPerformance = getAveragePercentage(termData);
      if (avgTermPerformance > 0) {
        const attendanceRate = Math.min(0.95, Math.max(0.60, (avgTermPerformance / 100) * 0.80 + 0.20));
        return Math.round(totalClasses * attendanceRate);
      }
    }
    
    return 0;
  }

  // Calculate attendance percentage
  function getAttendancePercentage() {
    const total = getTotalClasses();
    const attended = getAttendedClasses();
    return total > 0 ? Math.round((attended / total) * 100) : 0;
  }

  // Calculate overall percentage from term data or subjects
  function getOverallPercentage() {
    const termAvg = getAveragePercentage(termData);
    if (termAvg > 0) return termAvg;
    
    if (subjects.length > 0) {
      const subjectAvg = subjects.reduce((sum, subject) => sum + (subject.marks || 0), 0) / subjects.length;
      return Math.round(subjectAvg);
    }
    return 0;
  }

  // Generate chart data for Student Report
  function getChartData() {
    if (termData.length >= 4) {
      return termData.map((term, i) => ({
        x: 60 + i * 60,
        h1: term.percentage ? Math.max(10, parseFloat(term.percentage) * 1.5) : 10, // Mid term (scaled)
        h2: term.percentage ? Math.max(10, parseFloat(term.percentage) * 1.2) : 10, // End term (scaled)
        label: term.term.replace('Term ', 'T')
      }));
    }
    
    if (subjects.length > 0) {
      // Use top 4 subjects for chart
      return subjects.slice(0, 4).map((subject, i) => ({
        x: 60 + i * 60,
        h1: Math.max(10, (subject.marks || 0) * 1.5),
        h2: Math.max(10, (subject.marks || 0) * 1.2),
        label: subject.name.substring(0, 3)
      }));
    }
    
    // Empty state
    return [
      {x: 60, h1: 10, h2: 10, label: 'T1'},
      {x: 120, h1: 10, h2: 10, label: 'T2'},
      {x: 180, h1: 10, h2: 10, label: 'T3'},
      {x: 240, h1: 10, h2: 10, label: 'T4'}
    ];
  }

  const handleOpenTermModal = () => {
    setEditTermData(termData.length === 4 ? [...termData] : [
      { term: "Term 1", percentage: "" },
      { term: "Term 2", percentage: "" },
      { term: "Term 3", percentage: "" },
      { term: "Term 4", percentage: "" }
    ]);
    setShowTermModal(true);
  };

  const handleTermChange = (idx, field, value) => {
    const updated = [...editTermData];
    updated[idx][field] = value;
    setEditTermData(updated);
  };

  const handleSaveTermData = async () => {
    try {
      await axios.patch(API_ENDPOINTS.TERM_DATA_UPDATE, {
        email: user.email,
        termData: editTermData,
      });
      setTermData(editTermData);
      setShowTermModal(false);
    } catch (err) {
      alert('Failed to update term data');
    }
  };

  const handleOpenExtracurricularModal = () => {
    setEditExtracurricularActivities(extracurricularActivities.length ? [...extracurricularActivities] : [{ activity: "", role: "" }]);
    setShowExtracurricularModal(true);
  };

  const handleExtracurricularChange = (idx, field, value) => {
    const updated = [...editExtracurricularActivities];
    updated[idx][field] = value;
    setEditExtracurricularActivities(updated);
  };

  const handleAddExtracurricularRow = () => {
    setEditExtracurricularActivities([...editExtracurricularActivities, { activity: "", role: "" }]);
  };

  const handleRemoveExtracurricularRow = (idx) => {
    const updated = editExtracurricularActivities.filter((_, index) => index !== idx);
    setEditExtracurricularActivities(updated);
  };

  const handleSaveExtracurricularActivities = async () => {
    try {
      await axios.patch(API_ENDPOINTS.EXTRACURRICULAR_UPDATE, {
        email: user.email,
        extracurricularActivities: editExtracurricularActivities.filter(item => item.activity.trim() !== ""),
      });
      setExtracurricularActivities(editExtracurricularActivities.filter(item => item.activity.trim() !== ""));
      setShowExtracurricularModal(false);
    } catch (err) {
      alert('Failed to update extracurricular activities');
    }
  };

  const handleOpenCertificationsModal = () => {
    setEditCertifications(certifications.length ? [...certifications] : [""]);
    setShowCertificationsModal(true);
  };

  const handleCertificationChange = (idx, value) => {
    const updated = [...editCertifications];
    updated[idx] = value;
    setEditCertifications(updated);
  };

  const handleAddCertificationRow = () => {
    setEditCertifications([...editCertifications, ""]);
  };

  const handleRemoveCertificationRow = (idx) => {
    const updated = editCertifications.filter((_, index) => index !== idx);
    setEditCertifications(updated);
  };

  const handleSaveCertifications = async () => {
    try {
      await axios.patch(API_ENDPOINTS.CERTIFICATIONS_UPDATE, {
        email: user.email,
        certifications: editCertifications.filter(cert => cert.trim() !== ""),
      });
      setCertifications(editCertifications.filter(cert => cert.trim() !== ""));
      setShowCertificationsModal(false);
    } catch (err) {
      alert('Failed to update certifications');
    }
  };

  const handleOpenSubjectsModal = () => {
    setEditSubjects(subjects.length ? [...subjects] : [{ name: "", marks: "" }]);
    setShowSubjectsModal(true);
  };

  const handleSubjectChange = (idx, field, value) => {
    const updated = [...editSubjects];
    updated[idx][field] = value;
    setEditSubjects(updated);
  };

  const handleAddSubjectRow = () => {
    setEditSubjects([...editSubjects, { name: "", marks: "" }]);
  };

  const handleRemoveSubjectRow = (idx) => {
    const updated = editSubjects.filter((_, index) => index !== idx);
    setEditSubjects(updated);
  };

  const handleSaveSubjects = async () => {
    try {
      const validSubjects = editSubjects
        .filter(item => item.name.trim() !== "" && item.marks !== "")
        .map(item => ({ name: item.name.trim(), marks: parseInt(item.marks) }))
        .sort((a, b) => b.marks - a.marks);
      await axios.patch(API_ENDPOINTS.SUBJECTS_UPDATE, {
        email: user.email,
        subjects: validSubjects,
      });
      setSubjects(validSubjects);
      setShowSubjectsModal(false);
    } catch (err) {
      alert('Failed to update subjects');
    }
  };

  // Theme toggle handler
  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Tasks handlers
  const handleOpenTasksModal = () => {
    setEditTasks(calendarTasks.length ? [...calendarTasks] : [{ day: currentDay, task: '', color: 'bg-blue-500', time: '' }]);
    setShowTasksModal(true);
  };

  const handleTaskChange = (idx, field, value) => {
    const updated = [...editTasks];
    updated[idx][field] = value;
    setEditTasks(updated);
  };

  const handleAddTaskRow = () => {
    setEditTasks([...editTasks, { day: currentDay, task: '', color: 'bg-blue-500', time: '' }]);
  };

  const handleRemoveTaskRow = (idx) => {
    const updated = editTasks.filter((_, index) => index !== idx);
    setEditTasks(updated);
  };

  const handleSaveTasks = () => {
    const validTasks = editTasks.filter(item => item.task.trim() !== '');
    setCalendarTasks(validTasks);
    setShowTasksModal(false);
  };

  // Helper function for card styling
  const getCardClasses = () => {
    return `rounded-xl p-6 shadow-md border transition-colors ${
      isDarkMode 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-gray-200'
    }`;
  };

  // Helper function for text styling
  const getTextClasses = (variant = 'primary') => {
    if (variant === 'secondary') {
      return isDarkMode ? 'text-gray-400' : 'text-gray-500';
    }
    if (variant === 'muted') {
      return isDarkMode ? 'text-gray-500' : 'text-gray-600';
    }
    return isDarkMode ? 'text-white' : 'text-gray-900';
  };

  // Helper function for modal styling
  const getModalClasses = () => {
    return `rounded-xl shadow-2xl p-8 max-w-lg w-full relative m-4 transition-colors ${
      isDarkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-white text-gray-900'
    }`;
  };

  // Fallback render in case of issues
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">If this takes too long, please refresh the page</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isDarkMode={isDarkMode} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>

        {/* Top Header */}
        <div className={`px-6 py-4 flex items-center justify-between border-b transition-colors ${
          isDarkMode 
            ? 'bg-black border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-6">
            <div className="relative flex-1 max-w-md">
              <input 
                type="text" 
                placeholder="Search anything" 
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                }`}
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={handleToggleTheme}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode 
                  ? 'bg-gray-800 text-white hover:bg-gray-700' 
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                // Sun icon for dark mode
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                // Moon icon for light mode
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <button className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}>
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
        <div className={`flex-1 p-6 overflow-y-auto transition-colors ${
          isDarkMode ? 'bg-black' : 'bg-white'
        }`}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left/Center Content - 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Summary Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* About Card */}
                  <div className={getCardClasses()}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`text-sm font-medium ${getTextClasses('secondary')}`}>About</h3>
                      <button className={`${getTextClasses('muted')} hover:${getTextClasses('primary')}`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                    <h2 className={`text-xl font-bold mb-2 ${getTextClasses('primary')}`}>{user?.name || userName || "Harshit Dua"}</h2>
                    <p className={`text-sm mb-1 ${getTextClasses('muted')}`}>School: {user?.institute || "Abc Public School"}</p>
                    <div className="flex items-center gap-1">
                      <span className={`text-sm ${getTextClasses('muted')}`}>Grade:</span>
                      <span className={`text-sm font-medium ${getTextClasses('primary')}`}>{user?.class ? `${user.class}th` : user?.year ? `${user.year}` : "Xth"}</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Total Classes */}
                  <div className={getCardClasses()}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`text-sm font-medium ${getTextClasses('secondary')}`}>Total Classes</h3>
                      <button className={`${getTextClasses('muted')} hover:${getTextClasses('primary')}`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                    <h2 className={`text-3xl font-bold mb-1 ${getTextClasses('primary')}`}>{getTotalClasses()}</h2>
                    <p className={`text-sm ${getTextClasses('secondary')}`}>
                      {getTotalClasses() === 0 
                        ? "No class data available"
                        : schedule.length > 0 
                          ? `${schedule.length} classes/day × 40 weeks`
                          : subjects.length > 0
                            ? `${subjects.length} subjects × 40 weeks`
                            : "Add subjects to calculate"
                      }
                    </p>
                  </div>

                  {/* Attended */}
                  <div className={getCardClasses()}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`text-sm font-medium ${getTextClasses('secondary')}`}>Attended</h3>
                      <button className={`${getTextClasses('muted')} hover:${getTextClasses('primary')}`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                    <h2 className={`text-3xl font-bold mb-1 ${getTextClasses('primary')}`}>{getAttendedClasses()}</h2>
                    <p className={`text-sm ${getTextClasses('secondary')}`}>
                      {getAttendedClasses() === 0 
                        ? "No attendance data"
                        : `${getAttendancePercentage()}% attendance rate`
                      }
                    </p>
                  </div>

                  {/* Percentage */}
                  <div className={getCardClasses()}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`text-sm font-medium ${getTextClasses('secondary')}`}>Percentage</h3>
                      <button className={`${getTextClasses('muted')} hover:${getTextClasses('primary')}`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                    <h2 className={`text-3xl font-bold mb-1 ${getTextClasses('primary')}`}>{getOverallPercentage()}%</h2>
                    <p className={`text-sm ${getTextClasses('secondary')}`}>
                      {getOverallPercentage() === 0 
                        ? "No performance data"
                        : "Overall academic performance"
                      }
                    </p>
                  </div>
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Student Report */}
                  <div className={getCardClasses()}>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className={`text-lg font-semibold ${getTextClasses('primary')}`}>Student Report</h2>
                      <div className="flex gap-2">
                        <button onClick={() => setReportView('Month')} className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${reportView === 'Month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Month</button>
                        <button onClick={() => setReportView('Year')} className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${reportView === 'Year' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Year</button>
                      </div>
                    </div>
                    <div className="relative h-48">
                      <svg className="w-full h-full" viewBox="0 0 400 200">
                        <text x="10" y="20" className="text-xs fill-gray-400">100</text>
                        <text x="10" y="70" className="text-xs fill-gray-400">75</text>
                        <text x="10" y="120" className="text-xs fill-gray-400">50</text>
                        <text x="10" y="170" className="text-xs fill-gray-400">25</text>
                        <text x="10" y="195" className="text-xs fill-gray-400">0</text>
                        <line x1="40" y1="180" x2="380" y2="180" stroke="#e5e7eb" strokeWidth="1" />
                        {getChartData().map((bar, i) => (
                          <g key={i}>
                            <rect x={bar.x} y={180-bar.h1} width="16" height={bar.h1} fill="#1e3a8a" rx="2" />
                            <rect x={bar.x+18} y={180-bar.h2} width="16" height={bar.h2} fill="#60a5fa" rx="2" />
                            <text x={bar.x+8} y="195" className="text-xs fill-gray-600">{bar.label}</text>
                          </g>
                        ))}
                      </svg>
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-900"></div>
                        <span className="text-xs text-gray-600">Mid Term</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                        <span className="text-xs text-gray-600">End Term</span>
                      </div>
                    </div>
                  </div>

                  {/* Student Attendance */}
                  <div className={getCardClasses()}>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className={`text-lg font-semibold ${getTextClasses('primary')}`}>Student Attendance</h2>
                      <select className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Last Week</option>
                        <option>Last Month</option>
                      </select>
                    </div>
                    <div className="relative h-48">
                      <svg className="w-full h-full" viewBox="0 0 400 200">
                        <text x="10" y="30" className="text-xs fill-gray-400">75%</text>
                        <text x="10" y="80" className="text-xs fill-gray-400">60%</text>
                        <text x="10" y="130" className="text-xs fill-gray-400">25%</text>
                        <text x="10" y="180" className="text-xs fill-gray-400">0%</text>
                        <line x1="50" y1="20" x2="50" y2="180" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="50" y1="180" x2="380" y2="180" stroke="#e5e7eb" strokeWidth="1" />
                        {subjects.length > 0 || termData.length > 0 ? (
                          <>
                            <polyline fill="none" stroke="#1e3a8a" strokeWidth="2" points={
                              ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day, i) => {
                                const attendanceRate = getAttendancePercentage();
                                const variance = Math.random() * 20 - 10; // ±10% variance
                                const dayAttendance = Math.max(0, Math.min(100, attendanceRate + variance));
                                const y = 180 - (dayAttendance * 1.6); // Scale to chart height
                                return `${60 + i * 50},${y}`;
                              }).join(' ')
                            } />
                            <polyline fill="none" stroke="#60a5fa" strokeWidth="2" points={
                              ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day, i) => {
                                const attendanceRate = getAttendancePercentage();
                                const variance = Math.random() * 15 - 7.5; // ±7.5% variance
                                const dayPresent = Math.max(0, Math.min(100, attendanceRate + variance + 5));
                                const y = 180 - (dayPresent * 1.6); // Scale to chart height
                                return `${60 + i * 50},${y}`;
                              }).join(' ')
                            } />
                          </>
                        ) : (
                          <>
                            <polyline fill="none" stroke="#1e3a8a" strokeWidth="2" points="60,180 110,180 160,180 210,180 260,180 310,180 360,180" />
                            <polyline fill="none" stroke="#60a5fa" strokeWidth="2" points="60,180 110,180 160,180 210,180 260,180 310,180 360,180" />
                          </>
                        )}
                        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day, i) => (
                          <text key={i} x={60+i*50} y="195" className="text-xs fill-gray-600">{day}</text>
                        ))}
                      </svg>
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-900"></div>
                        <span className="text-xs text-gray-600">Absent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                        <span className="text-xs text-gray-600">Present</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Academic Performance by Subjects */}
                  <div className={getCardClasses()}>
                    <h2 className={`text-lg font-semibold ${getTextClasses('primary')}`}>Academic Performance</h2>
                    <p className={`text-sm ${getTextClasses('muted')} mb-6`}>by Subjects</p>
                    <div className="flex items-center justify-center mb-6">
                      <div className="relative w-40 h-40">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                          {(() => {
                            const percentage = getOverallPercentage();
                            const circumference = 2 * Math.PI * 40; // radius = 40
                            const strokeDasharray = circumference;
                            const strokeDashoffset = circumference - (percentage / 100) * circumference;
                            const color = percentage >= 80 ? '#22c55e' : percentage >= 60 ? '#3b82f6' : percentage >= 40 ? '#eab308' : '#ef4444';
                            
                            return (
                              <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="none" 
                                stroke={color}
                                strokeWidth="8" 
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round" 
                              />
                            );
                          })()}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-sm text-gray-500">Overall</span>
                          <span className="text-3xl font-bold text-gray-900">{getOverallPercentage()}%</span>
                          <span className="text-sm text-gray-500">This Year</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {subjects.length > 0 ? (
                        subjects.slice(0, 4).map((subject, i) => {
                          const colors = ['#1e3a8a', '#14b8a6', '#5eead4', '#d1d5db'];
                          const totalMarks = subjects.reduce((sum, s) => sum + (s.marks || 0), 0);
                          const subjectPercentage = totalMarks > 0 ? Math.round((subject.marks / totalMarks) * 100) : 0;
                          
                          return (
                            <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: colors[i % colors.length]}}></div>
                                <span className="text-sm text-gray-700">{subject.name}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-semibold text-gray-900">{subjectPercentage}%</span>
                                <div className="text-xs text-gray-500">{subject.marks}% score</div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-sm">No subjects data available</p>
                          <p className="text-xs mt-1">Add subjects to see performance breakdown</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Teacher Info */}
                  <div className={getCardClasses()}>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className={`text-lg font-semibold ${getTextClasses('primary')}`}>Teacher Info</h2>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-4">
                      {teachers.length > 0 ? (
                        teachers.map((teacher, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-medium text-gray-600">
                                {teacher.name ? teacher.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'T'}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900">{teacher.name || 'Teacher'}</div>
                              <div className="text-sm text-gray-500">{teacher.subject || teacher.specialty || 'Subject'}</div>
                              {teacher.time && <div className="text-sm text-gray-500">{teacher.time}</div>}
                            </div>
                            <div className="flex-shrink-0">
                              <span className={`text-sm px-3 py-1 rounded-full font-medium ${teacher.status === 'Available' || teacher.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {teacher.status || (teacher.available ? 'Available' : 'Unavailable')}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-sm">No teacher information available</p>
                          <p className="text-xs mt-1">Teacher data will appear here when available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Existing Sections - Preserved */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Top Subjects */}
                  {/* REMOVE THIS CONTAINER */}
                  {/* Extracurricular Activities */}
                  {/* REMOVE THIS CONTAINER */}
                </div>
                {/* REMOVE Certifications container below */}
                {/* <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Certifications</h2>
                    <button onClick={handleOpenCertificationsModal} className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Update</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {certifications.length > 0 ? (
                      certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-700 font-medium">{cert}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400 text-sm italic text-center py-8 bg-gray-50 rounded-lg md:col-span-2">
                        Please update your profile to add certifications.
                      </div>
                    )}
                  </div>
                </div> */}
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-1 space-y-0">
                {/* Calendar */}
                <div className={`rounded-t-xl rounded-b-none p-6 shadow-md border border-b-0 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-gray-100 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${getTextClasses('primary')}`}>{currentMonth} {currentYear}</h3>
                    <div className="flex items-center gap-1">
                      <button className={`p-1.5 rounded transition-colors ${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}>
                        <svg className={`w-4 h-4 ${getTextClasses('muted')}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button className={`p-1.5 rounded transition-colors ${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}>
                        <svg className={`w-4 h-4 ${getTextClasses('muted')}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className={`grid grid-cols-7 gap-1 text-center text-sm mb-3 ${getTextClasses('muted')}`}>
                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (<div key={d} className="font-medium py-2">{d}</div>))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-sm">
                    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31].map(day => {
                      const dayTask = calendarTasks.find(task => task.day === day);
                      return (
                        <div key={day} className={`aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors relative ${day === currentDay ? 'bg-blue-600 text-white' : `${getTextClasses('primary')} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}`}>
                          <span className="text-sm font-medium">{day}</span>
                          {dayTask && (
                            <div className={`absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${dayTask.color}`} title={dayTask.task}></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Task Legend */}
                  <div className={`mt-4 pt-4 border-t transition-colors ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <h4 className={`text-xs font-medium uppercase tracking-wider mb-2 ${getTextClasses('muted')}`}>Upcoming Tasks</h4>
                    <div className="space-y-1">
                      {calendarTasks.slice(0, 3).map((task, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <div className={`w-2 h-2 rounded-full ${task.color}`}></div>
                          <span className={getTextClasses('muted')}>{task.day} - {task.task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upcoming Tasks */}
                <div className={`rounded-t-none rounded-b-xl p-6 shadow-md border border-t-0 -mt-4 relative z-10 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-900 border-gray-800' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-lg font-semibold ${getTextClasses('primary')}`}>Upcoming Tasks</h3>
                    <button 
                      onClick={handleOpenTasksModal}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      title="Edit Tasks"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-3">
                    {calendarTasks.length > 0 ? (
                      calendarTasks
                        .sort((a, b) => a.day - b.day)
                        .map((task, i) => (
                          <div key={i} className={`p-4 rounded-lg border hover:border-blue-200 transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-700' 
                              : 'bg-gray-50 border-gray-200'
                          }`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-3 h-3 rounded-full ${task.color} mt-1.5 flex-shrink-0`}></div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className={`text-base font-semibold ${getTextClasses('primary')}`}>{task.task}</h4>
                                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                                    isDarkMode 
                                      ? 'text-gray-400 bg-gray-700' 
                                      : 'text-gray-500 bg-gray-100'
                                  }`}>{currentMonth} {task.day}</span>
                                </div>
                                {task.time && (
                                  <div className={`text-sm flex items-center gap-1 ${getTextClasses('muted')}`}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {task.time}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className={`text-center py-8 ${getTextClasses('muted')}`}>
                        <p className="text-sm">No upcoming tasks</p>
                        <p className="text-xs mt-1">Click the edit button to add tasks</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Modals - All preserved from original */}
      {showConclusionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative m-4">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowConclusionModal(false)}>&times;</button>
            <h4 className="text-xl font-semibold mb-4 text-gray-900">Conclusion</h4>
            <div className="text-gray-800 whitespace-pre-line leading-relaxed">{user?.conclusion}</div>
          </div>
        </div>
      )}

      {showTermModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative m-4">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowTermModal(false)}>&times;</button>
            <h4 className="text-xl font-semibold mb-6 text-gray-900">Edit Term Performance</h4>
            <div className="space-y-3">
              {editTermData.map((row, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 w-24 focus:ring-2 focus:ring-gray-500" placeholder="Term" value={row.term} onChange={e => handleTermChange(idx, 'term', e.target.value)} />
                  <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-24 focus:ring-2 focus:ring-gray-500" placeholder="%" value={row.percentage} onChange={e => handleTermChange(idx, 'percentage', e.target.value)} min="0" max="100" />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleSaveTermData}>Save</button>
              <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300" onClick={() => setShowTermModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showSubjectsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative m-4">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowSubjectsModal(false)}>&times;</button>
            <h4 className="text-xl font-semibold mb-6 text-gray-900">Add Marks to Gain Better Insight</h4>
            <div className="space-y-3">
              {editSubjects.map((subject, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-gray-500" placeholder="Subject name" value={subject.name} onChange={e => handleSubjectChange(idx, 'name', e.target.value)} />
                  <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-20 focus:ring-2 focus:ring-gray-500" placeholder="%" value={subject.marks} onChange={e => handleSubjectChange(idx, 'marks', e.target.value)} min="0" max="100" />
                  <button className="text-red-500 hover:text-red-700 text-xl p-1" onClick={() => handleRemoveSubjectRow(idx)}>×</button>
                </div>
              ))}
              <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600" onClick={handleAddSubjectRow}>Add Subject</button>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleSaveSubjects}>Save</button>
              <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300" onClick={() => setShowSubjectsModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showExtracurricularModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative m-4">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowExtracurricularModal(false)}>&times;</button>
            <h4 className="text-xl font-semibold mb-6 text-gray-900">Edit Extracurricular Activities</h4>
            <div className="space-y-3">
              {editExtracurricularActivities.map((row, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-gray-500" placeholder="Activity" value={row.activity} onChange={e => handleExtracurricularChange(idx, 'activity', e.target.value)} />
                  <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-gray-500" placeholder="Role" value={row.role} onChange={e => handleExtracurricularChange(idx, 'role', e.target.value)} />
                  <button className="text-red-500 hover:text-red-700 text-xl p-1" onClick={() => handleRemoveExtracurricularRow(idx)}>×</button>
                </div>
              ))}
              <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600" onClick={handleAddExtracurricularRow}>Add Activity</button>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleSaveExtracurricularActivities}>Save</button>
              <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300" onClick={() => setShowExtracurricularModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showCertificationsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative m-4">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowCertificationsModal(false)}>&times;</button>
            <h4 className="text-xl font-semibold mb-6 text-gray-900">Edit Certifications</h4>
            <div className="space-y-3">
              {editCertifications.map((cert, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-gray-500" placeholder="Certification name" value={cert} onChange={e => handleCertificationChange(idx, e.target.value)} />
                  <button className="text-red-500 hover:text-red-700 text-xl p-1" onClick={() => handleRemoveCertificationRow(idx)}>×</button>
                </div>
              ))}
              <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600" onClick={handleAddCertificationRow}>Add Certification</button>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleSaveCertifications}>Save</button>
              <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300" onClick={() => setShowCertificationsModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showTasksModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full relative m-4 max-h-[90vh] overflow-y-auto">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowTasksModal(false)}>&times;</button>
            <h4 className="text-xl font-semibold mb-6 text-gray-900">Edit Upcoming Tasks</h4>
            <div className="space-y-3">
              {editTasks.map((task, idx) => (
                <div key={idx} className="flex gap-3 items-center p-4 bg-gray-50 rounded-lg">
                  <input 
                    type="number" 
                    className="border border-gray-300 rounded-lg px-3 py-2 w-20 focus:ring-2 focus:ring-blue-500" 
                    placeholder="Day" 
                    value={task.day} 
                    onChange={e => handleTaskChange(idx, 'day', e.target.value)} 
                    min="1" 
                    max="31"
                  />
                  <input 
                    type="text" 
                    className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-500" 
                    placeholder="Task name" 
                    value={task.task} 
                    onChange={e => handleTaskChange(idx, 'task', e.target.value)} 
                  />
                  <input 
                    type="time" 
                    className="border border-gray-300 rounded-lg px-3 py-2 w-32 focus:ring-2 focus:ring-blue-500" 
                    value={task.time ? task.time.replace(/\s?(AM|PM)/i, '') : ''} 
                    onChange={e => {
                      const time24 = e.target.value;
                      if (time24) {
                        const [hours, minutes] = time24.split(':');
                        const hour = parseInt(hours);
                        const ampm = hour >= 12 ? 'PM' : 'AM';
                        const hour12 = hour % 12 || 12;
                        handleTaskChange(idx, 'time', `${hour12}:${minutes} ${ampm}`);
                      } else {
                        handleTaskChange(idx, 'time', '');
                      }
                    }}
                  />
                  <select 
                    className="border border-gray-300 rounded-lg px-3 py-2 w-32 focus:ring-2 focus:ring-blue-500" 
                    value={task.color} 
                    onChange={e => handleTaskChange(idx, 'color', e.target.value)}
                  >
                    <option value="bg-blue-500">Blue</option>
                    <option value="bg-green-500">Green</option>
                    <option value="bg-purple-500">Purple</option>
                    <option value="bg-red-500">Red</option>
                    <option value="bg-yellow-500">Yellow</option>
                    <option value="bg-pink-500">Pink</option>
                    <option value="bg-indigo-500">Indigo</option>
                  </select>
                  <button className="text-red-500 hover:text-red-700 text-xl p-1" onClick={() => handleRemoveTaskRow(idx)}>×</button>
                </div>
              ))}
              <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2" onClick={handleAddTaskRow}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Task
              </button>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleSaveTasks}>Save</button>
              <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300" onClick={() => setShowTasksModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
