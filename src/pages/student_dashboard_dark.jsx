import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config";
import axios from "axios";
import SidebarDark from "./sidebar_dark"; // <-- Import the dark sidebar

export default function StudentDashboardDark() {
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
  const navigate = useNavigate();
  
  // Sample tasks for calendar overlay
  const [calendarTasks] = useState([
    { day: 5, task: 'Math Test', color: 'bg-blue-500' },
    { day: 12, task: 'Science Project', color: 'bg-green-500' },
    { day: 18, task: 'History Essay', color: 'bg-purple-500' },
    { day: 25, task: 'Physics Lab', color: 'bg-red-500' },
    { day: 28, task: 'English Exam', color: 'bg-yellow-500' }
  ]);

  // Get current date for calendar and schedule
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const currentDayName = currentDate.toLocaleString('default', { weekday: 'long' });

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      setIsLoading(false);
      return;
    }

    fetch(`${API_ENDPOINTS.USER}?email=${encodeURIComponent(email)}`) // <-- use backticks here
      .then((res) => res.json())
      .then((data) => {
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
        setIsLoading(false);
      });
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
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <SidebarDark isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading your dashboard...</p>
            </div>
          </div>
        )}

        {/* REMOVE: Toggle Button - Sun icon, top right */}
        {/* <div className="absolute top-6 right-32 z-50">
          <button
            onClick={handleToggleTheme}
            className="p-2 rounded-full bg-[#23283b] text-white hover:bg-[#181a20] transition-colors"
            title="Switch to Light Mode"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" />
              <g stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </g>
            </svg>
          </button>
        </div> */}

        {/* Top Header */}
        <div className="bg-black px-6 py-4 flex items-center justify-between">
          <div></div>
          <div className="flex items-center gap-4">
            {/* Sun icon toggle button - move to left of settings */}
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-full bg-[#23283b] text-white hover:bg-[#181a20] transition-colors"
              title="Switch to Light Mode"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" />
                <g stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </g>
              </svg>
            </button>
            {/* Settings icon */}
            <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            {/* Notification icon */}
            <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors relative">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {/* Username */}
            <div className="flex items-center gap-2 px-3 py-2 bg-black cursor-pointer hover:bg-black">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-white">{userName || 'Harshit Dua'}</span>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left/Center Content - 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                {/* Summary Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    {/* About Card */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-white">About</h3>
                      <button className="text-gray-400 hover:text-white">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">{user?.name || userName || "Harshit Dua"}</h2>
                    <p className="text-sm text-white mb-1">School: {user?.institute || "Abc Public School"}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-white">Grade:</span>
                      <span className="text-sm font-medium text-white">{user?.class ? `${user.class}th` : user?.year ? `${user.year}` : "Xth"}</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Total Classes */}
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-white">Total Classes</h3>
                      <button className="text-gray-400 hover:text-white">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-1">{getTotalClasses()}</h2>
                    <p className="text-sm text-white">
                      {getTotalClasses() === 0 
                      ? "No class data available"
                      : schedule.length > 0 
                        ? `${schedule.length} classes/day × 40 weeks`
                        : subjects.length > 0
                          ? `${subjects.length} subjects × 40 weeks`
                          : "Add subjects to calculate"
                    }</p>
                  </div>

                  {/* Attended */}
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-white">Attended</h3>
                      <button className="text-gray-400 hover:text-white">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-1">{getAttendedClasses()}</h2>
                    <p className="text-sm text-white">
  {getAttendedClasses() === 0 
    ? "No attendance data"
    : `${getAttendancePercentage()}% attendance rate`
  }
</p>
                  </div>

                  {/* Percentage */}
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-white">Percentage</h3>
                      <button className="text-gray-400 hover:text-white">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-1">{getOverallPercentage()}%</h2>
                    <p className="text-sm text-white">
                      {getOverallPercentage() === 0 
                        ? "No performance data"
                        : "Overall academic performance"
                      }
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Academic Performance by Subjects */}
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    {/* ...existing Academic Performance code... */}
                    <h2 className="text-lg font-semibold text-white">Academic Performance</h2>
                    {/* ...rest of card... */}
                  </div>
                  {/* Teacher Info */}
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    {/* ...existing Teacher Info code... */}
                    <h2 className="text-lg font-semibold text-white">Teacher Info</h2>
                    {/* ...rest of card... */}
                  </div>
                </div>
                {/* REMOVE Certifications container here */}
              </div>
              {/* Right Sidebar */}
              <div className="lg:col-span-1 space-y-0">
                <div className="bg-gray-900 rounded-t-xl rounded-b-none p-6 border border-gray-800">
                  {/* Calendar */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{currentMonth} {currentYear}</h3>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded hover:bg-gray-800">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button className="p-1.5 rounded hover:bg-gray-800">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-sm text-white mb-3">
                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (<div key={d} className="font-medium py-2">{d}</div>))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-sm">
                    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31].map(day => {
                      const dayTask = calendarTasks.find(task => task.day === day);
                      return (
                        <div key={day} className={`aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors relative ${day === currentDay ? 'bg-black text-white' : 'text-white hover:bg-gray-900'}`}>
                          <span className="text-sm font-medium">{day}</span>
                          {dayTask && (
                            <div className={`absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${dayTask.color}`} title={dayTask.task}></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Task Legend */}
                  <div className="mt-4 pt-4 border-t border-gray-900">
                    <h4 className="text-xs font-medium text-white uppercase tracking-wider mb-2">Upcoming Tasks</h4>
                    <div className="space-y-1">
                      {calendarTasks.slice(0, 3).map((task, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <div className={`w-2 h-2 rounded-full ${task.color}`}></div>
                          <span className="text-white">{task.day} - {task.task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-black rounded-t-none rounded-b-xl p-6 border border-gray-900 -mt-4 relative z-10">
                  {/* Daily Schedule */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">{currentDayName}, {currentDay} {currentMonth}</h3>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-4">
                    {schedule.length > 0 ? (
                      schedule.map((item, i) => (
                        <div key={i} className="p-4 rounded-lg bg-black border border-gray-900">
                          <div className="text-sm text-white mb-1">{item.time || item.startTime}</div>
<div className="text-base font-semibold text-white mb-1">{item.title || item.subject || item.class}</div>
<div className="text-sm text-white">{item.duration || `${item.startTime} - ${item.endTime}` || 'Duration not specified'}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-white">
                        <p className="text-sm">No classes scheduled for today</p>
                        <p className="text-xs mt-1">Your daily schedule will appear here</p>
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
          <div className="bg-black rounded-xl shadow-2xl p-8 border border-gray-900 max-w-lg w-full relative m-4">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl" onClick={() => setShowConclusionModal(false)}>&times;</button>
            <h4 className="text-xl font-semibold mb-4 text-white">Conclusion</h4>
            <div className="text-white whitespace-pre-line leading-relaxed">{user?.conclusion}</div>
          </div>
        </div>
      )}

      {showTermModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-black rounded-xl shadow-2xl p-8 border border-gray-900 max-w-lg w-full relative m-4">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl" onClick={() => setShowTermModal(false)}>&times;</button>
            <h4 className="text-xl font-semibold mb-6 text-white">Edit Term Performance</h4>
            <div className="space-y-3">
              {editTermData.map((row, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <input type="text" className="border border-gray-900 rounded-lg px-3 py-2 bg-black text-white w-24 focus:ring-2 focus:ring-gray-500" placeholder="Term" value={row.term} onChange={e => handleTermChange(idx, 'term', e.target.value)} />
                  <input type="number" className="border border-gray-900 rounded-lg px-3 py-2 bg-black text-white w-24 focus:ring-2 focus:ring-gray-500" placeholder="%" value={row.percentage} onChange={e => handleTermChange(idx, 'percentage', e.target.value)} min="0" max="100" />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900" onClick={handleSaveTermData}>Save</button>
              <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900" onClick={() => setShowTermModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showSubjectsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-black rounded-xl shadow-2xl p-8 border border-gray-900 max-w-lg w-full relative m-4">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl" onClick={() => setShowSubjectsModal(false)}>&times;</button>
            <h4 className="text-xl font-semibold mb-6 text-white">Add Marks to Gain Better Insight</h4>
            <div className="space-y-3">
              {editSubjects.map((subject, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <input type="text" className="border border-gray-900 rounded-lg px-3 py-2 bg-black text-white flex-1 focus:ring-2 focus:ring-gray-500" placeholder="Subject name" value={subject.name} onChange={e => handleSubjectChange(idx, 'name', e.target.value)} />
                  <input type="number" className="border border-gray-900 rounded-lg px-3 py-2 bg-black text-white w-20 focus:ring-2 focus:ring-gray-500" placeholder="%" value={subject.marks} onChange={e => handleSubjectChange(idx, 'marks', e.target.value)} min="0" max="100" />
                  <button className="text-red-500 hover:text-red-700 text-xl p-1" onClick={() => handleRemoveSubjectRow(idx)}>×</button>
                </div>
              ))}
              <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600" onClick={handleAddSubjectRow}>Add Subject</button>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900" onClick={handleSaveSubjects}>Save</button>
              <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900" onClick={() => setShowSubjectsModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showExtracurricularModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-black rounded-xl shadow-2xl p-8 border border-gray-900 max-w-lg w-full relative m-4">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl" onClick={() => setShowExtracurricularModal(false)}>&times;</button>
            <h4 className="text-xl font-semibold mb-6 text-white">Edit Extracurricular Activities</h4>
            <div className="space-y-3">
              {editExtracurricularActivities.map((row, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <input type="text" className="border border-gray-900 rounded-lg px-3 py-2 bg-black text-white flex-1 focus:ring-2 focus:ring-gray-500" placeholder="Activity" value={row.activity} onChange={e => handleExtracurricularChange(idx, 'activity', e.target.value)} />
                  <input type="text" className="border border-gray-900 rounded-lg px-3 py-2 bg-black text-white flex-1 focus:ring-2 focus:ring-gray-500" placeholder="Role" value={row.role} onChange={e => handleExtracurricularChange(idx, 'role', e.target.value)} />
                  <button className="text-red-500 hover:text-red-700 text-xl p-1" onClick={() => handleRemoveExtracurricularRow(idx)}>×</button>
                </div>
              ))}
              <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600" onClick={handleAddExtracurricularRow}>Add Activity</button>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900" onClick={handleSaveExtracurricularActivities}>Save</button>
              <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900" onClick={() => setShowExtracurricularModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showCertificationsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-black rounded-xl shadow-2xl p-8 border border-gray-900 max-w-lg w-full relative m-4">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl" onClick={() => setShowCertificationsModal(false)}>&times;</button>
            <h4 className="text-xl font-semibold mb-6 text-white">Edit Certifications</h4>
            <div className="space-y-3">
              {editCertifications.map((cert, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <input type="text" className="border border-gray-900 rounded-lg px-3 py-2 bg-black text-white flex-1 focus:ring-2 focus:ring-gray-500" placeholder="Certification name" value={cert} onChange={e => handleCertificationChange(idx, e.target.value)} />
                  <button className="text-red-500 hover:text-red-700 text-xl p-1" onClick={() => handleRemoveCertificationRow(idx)}>×</button>
                </div>
              ))}
              <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600" onClick={handleAddCertificationRow}>Add Certification</button>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900" onClick={handleSaveCertifications}>Save</button>
              <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900" onClick={() => setShowCertificationsModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}