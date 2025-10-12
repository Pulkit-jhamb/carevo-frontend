import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config";
import axios from "axios";
import Sidebar from "./sidebar"; // Import the Sidebar component
import { Search, Settings, Bell, ChevronDown, MoreHorizontal, Calendar, Clock } from "lucide-react";

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
  const [isCollapsed, setIsCollapsed] = useState(false); // State for sidebar collapse
  const [selectedPeriod, setSelectedPeriod] = useState('Month');
  const [selectedAttendancePeriod, setSelectedAttendancePeriod] = useState('Last Week');
  const location = useLocation();
  const navigate = useNavigate();

  // Mock data for the new dashboard components
  const [dashboardStats, setDashboardStats] = useState({
    totalClasses: 965,
    attended: 128,
    percentage: 315
  });

  const [teacherInfo, setTeacherInfo] = useState([
    { name: "Dr. Petra Winsburry", subject: "General Medicine", time: "09:00 AM - 12:00 PM", status: "Available", avatar: "PW" },
    { name: "Dr. Ameena Karim", subject: "Orthopedics", time: "", status: "Unavailable", avatar: "AK" },
    { name: "Dr. Olivia Martinez", subject: "Cardiology", time: "10:00 AM - 01:00 PM", status: "Available", avatar: "OM" },
    { name: "Dr. Damian Sanchez", subject: "Pediatrics", time: "11:00 AM - 02:00 PM", status: "Available", avatar: "DS" }
  ]);

  const [dailySchedule, setDailySchedule] = useState([
    { time: "08:00AM", subject: "Mathematics", duration: "08:00 AM - 09:00 AM" },
    { time: "10:00AM", subject: "Science", duration: "10:00 AM - 12:00 PM" },
    { time: "01:00PM", subject: "English", duration: "01:00 PM - 03:00 PM" },
    { time: "04:00PM", subject: "Training Session", duration: "04:00 PM - 05:00 PM" }
  ]);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      setIsLoading(false);
      return;
    }

    fetch(`${API_ENDPOINTS.USER}?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);

        // If no termData, initialize with 4 empty terms
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

        // Remove default values, show update prompt if empty
        setExtracurricularActivities(data.extracurricularActivities || []);
        setCertifications(data.certifications || []);
        setSubjects(data.subjects || []);
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

  // Helper to get a clean preview up to a character limit
  function getConclusionPreview(text, limit = 120) {
    if (!text) return "";
    if (text.length <= limit) return text;
    // Find the last space before the limit to avoid breaking words
    const trimmed = text.slice(0, limit);
    const lastSpace = trimmed.lastIndexOf(" ");
    return trimmed.slice(0, lastSpace) + "... more";
  }

  // Helper to get average percentage
  function getAveragePercentage(termData) {
    if (!termData.length) return 0;
    // Only consider terms that have actual percentage values
    const validTerms = termData.filter(item => item.percentage && item.percentage !== "");
    if (validTerms.length === 0) return 0;
    
    const sum = validTerms.reduce((acc, item) => acc + parseFloat(item.percentage), 0);
    return Math.round(sum / validTerms.length);
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
      await axios.patch(
        API_ENDPOINTS.TERM_DATA_UPDATE,
        {
          email: user.email,
          termData: editTermData,
        }
      );
      setTermData(editTermData);
      setShowTermModal(false);
    } catch (err) {
      alert('Failed to update term data');
    }
  };

  const handleOpenExtracurricularModal = () => {
    setEditExtracurricularActivities(extracurricularActivities.length ? [...extracurricularActivities] : [
      { activity: "", role: "" }
    ]);
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
      await axios.patch(
        API_ENDPOINTS.EXTRACURRICULAR_UPDATE,
        {
          email: user.email,
          extracurricularActivities: editExtracurricularActivities.filter(item => item.activity.trim() !== ""),
        }
      );
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
      await axios.patch(
        API_ENDPOINTS.CERTIFICATIONS_UPDATE,
        {
          email: user.email,
          certifications: editCertifications.filter(cert => cert.trim() !== ""),
        }
      );
      setCertifications(editCertifications.filter(cert => cert.trim() !== ""));
      setShowCertificationsModal(false);
    } catch (err) {
      alert('Failed to update certifications');
    }
  };

  const handleOpenSubjectsModal = () => {
    setEditSubjects(subjects.length ? [...subjects] : [
      { name: "", marks: "" }
    ]);
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
        .map(item => ({
          name: item.name.trim(),
          marks: parseInt(item.marks)
        }))
        .sort((a, b) => b.marks - a.marks); // Sort by marks in descending order

      await axios.patch(
        API_ENDPOINTS.SUBJECTS_UPDATE,
        {
          email: user.email,
          subjects: validSubjects,
        }
      );
      setSubjects(validSubjects);
      setShowSubjectsModal(false);
    } catch (err) {
      alert('Failed to update subjects');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Loading State */}
        {isLoading && (
          <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading your dashboard...</p>
            </div>
          </div>
        )}
        
        {/* Top Header Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search anything"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <span className="text-sm font-medium text-gray-700">{userName || "Student"}</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* About Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">About</div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {user?.name || userName || "Harshit Dua"}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  School: {user?.institute || "Abc Public School"}
                </div>
                <div className="text-sm text-gray-600">
                  Grade: {user?.class || "XII"}
                </div>
              </div>

              {/* Total Classes */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-500">Total Classes</div>
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{dashboardStats.totalClasses}</div>
                <div className="text-sm text-gray-600">45 more than yesterday</div>
              </div>

              {/* Attended */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-500">Attended</div>
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{dashboardStats.attended}</div>
                <div className="text-sm text-gray-600">15 less than yesterday</div>
              </div>

              {/* Percentage */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-500">Percentage</div>
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{dashboardStats.percentage}</div>
                <div className="text-sm text-gray-600">56 more than yesterday</div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Student Report */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Student Report</h2>
                    <div className="flex items-center gap-2">
                      <button 
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          selectedPeriod === 'Month' 
                            ? 'bg-gray-900 text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        onClick={() => setSelectedPeriod('Month')}
                      >
                        Month
                      </button>
                      <button 
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          selectedPeriod === 'Year' 
                            ? 'bg-gray-900 text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        onClick={() => setSelectedPeriod('Year')}
                      >
                        Year
                      </button>
                    </div>
                  </div>
                  
                  {/* Bar Chart */}
                  <div className="h-64 flex items-end justify-between gap-4 mb-4">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
                      const heights = [60, 80, 85, 70, 90, 75];
                      const colors = ['bg-gray-400', 'bg-teal-500', 'bg-gray-400', 'bg-gray-400', 'bg-gray-400', 'bg-gray-400'];
                      return (
                        <div key={month} className="flex flex-col items-center flex-1">
                          <div 
                            className={`w-full ${colors[index]} rounded-t-lg transition-all duration-300 hover:opacity-80`}
                            style={{ height: `${heights[index]}%` }}
                          ></div>
                          <div className="text-xs text-gray-600 mt-2">{month}</div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm">
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

                {/* Student Attendance */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Student Attendance</h2>
                    <div className="flex items-center gap-2">
                      <button 
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          selectedAttendancePeriod === 'Last Week' 
                            ? 'bg-gray-900 text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        onClick={() => setSelectedAttendancePeriod('Last Week')}
                      >
                        Last Week
                      </button>
                    </div>
                  </div>
                  
                  {/* Line Chart */}
                  <div className="h-48 relative">
                    <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-400">
                      <div>75%</div>
                      <div>50%</div>
                      <div>25%</div>
                      <div>0%</div>
                    </div>
                    
                    <div className="ml-8 h-full flex items-end justify-between">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
                        const values = [65, 70, 68, 72, 69, 71, 67];
                        return (
                          <div key={day} className="flex flex-col items-center flex-1">
                            <div className="relative h-32 flex items-end">
                              <div 
                                className="w-2 bg-blue-500 rounded-full"
                                style={{ height: `${values[index]}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-600 mt-2">{day}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span className="text-gray-600">Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-300 rounded"></div>
                      <span className="text-gray-600">Absent</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Academic Performance */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Academic Performance</h2>
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-sm text-gray-600 mb-4">by Subjects</div>
                  {/* Circular Progress Chart */}
                  <div className="flex justify-center mb-6">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18" cy="18" r="15.5"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="2"
                        />
                        <circle
                          cx="18" cy="18" r="15.5"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          strokeDasharray="88.5 11.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl font-bold text-gray-900">91%</div>
                        <div className="text-xs text-gray-500">This Year</div>
                      </div>
                    </div>
                  </div>
                
                  {/* Subject Performance List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Maths</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">35%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Science</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">28%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">English</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">20%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-700">Social Studies</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">17%</span>
                    </div>
                  </div>
                </div>

                {/* Teacher Info */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Teacher Info</h2>
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="space-y-4">
                    {teacherInfo.map((teacher, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">{teacher.avatar}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                            <div className="text-xs text-gray-500">{teacher.subject}</div>
                            {teacher.time && <div className="text-xs text-gray-500">{teacher.time}</div>}
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          teacher.status === 'Available' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {teacher.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calendar */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">July 2028</h3>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <ChevronDown className="w-4 h-4 text-gray-400 rotate-90" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
                    <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {Array.from({ length: 35 }, (_, i) => {
                      const day = i - 6 + 1;
                      const isCurrentMonth = day > 0 && day <= 31;
                      const isToday = day === 12;
                      return (
                        <div
                          key={i}
                          className={`h-8 flex items-center justify-center rounded ${
                            isToday
                              ? 'bg-gray-900 text-white'
                              : isCurrentMonth
                              ? 'text-gray-900 hover:bg-gray-100'
                              : 'text-gray-300'
                          }`}
                        >
                          {isCurrentMonth ? day : ''}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Wednesday, 12 July</span>
                    </div>
                  </div>
                </div>

                {/* Daily Schedule */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="space-y-4">
                    {dailySchedule.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="text-sm font-medium text-gray-500 w-16">{item.time}</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{item.subject}</div>
                          <div className="text-xs text-gray-500">{item.duration}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modals */}
            {showTermModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative m-4">
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                    onClick={() => setShowTermModal(false)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <h4 className="text-xl font-semibold mb-6 text-gray-900">Edit Term Performance</h4>
                  <div className="space-y-3">
                    {editTermData.map((row, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <input
                          type="text"
                          className="border border-gray-300 rounded-lg px-3 py-2 w-24 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                          placeholder="Term"
                          value={row.term}
                          onChange={e => handleTermChange(idx, 'term', e.target.value)}
                        />
                        <input
                          type="number"
                          className="border border-gray-300 rounded-lg px-3 py-2 w-24 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                          placeholder="Percentage"
                          value={row.percentage}
                          onChange={e => handleTermChange(idx, 'percentage', e.target.value)}
                          min="0"
                          max="100"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
                      onClick={handleSaveTermData}
                    >
                      Save
                    </button>
                    <button
                      className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                      onClick={() => setShowTermModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showConclusionModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative m-4">
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                    onClick={() => setShowConclusionModal(false)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <h4 className="text-xl font-semibold mb-4 text-gray-900">Conclusion</h4>
                  <div className="text-gray-800 whitespace-pre-line leading-relaxed">
                    {user?.conclusion}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
                    subjects.map((subject, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-gray-700 font-medium">{subject.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 bg-white px-3 py-1 rounded-full">{subject.marks}%</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm italic text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
                      Please update your profile to add your subjects.
                    </div>
                  )}
                </div>
                
                {/* Subjects Modal */}
                {showSubjectsModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative m-4">
                      <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                        onClick={() => setShowSubjectsModal(false)}
                        aria-label="Close"
                      >
                        &times;
                      </button>
                      <h4 className="text-xl font-semibold mb-6 text-gray-900">Add Marks to Gain Better Insight</h4>
                      <div className="space-y-3">
                        {editSubjects.map((subject, idx) => (
                          <div key={idx} className="flex gap-3 items-center">
                            <input
                              type="text"
                              className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                              placeholder="Subject name"
                              value={subject.name}
                              onChange={e => handleSubjectChange(idx, 'name', e.target.value)}
                            />
                            <input
                              type="number"
                              className="border border-gray-300 rounded-lg px-3 py-2 w-20 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                              placeholder="Marks %"
                              value={subject.marks}
                              onChange={e => handleSubjectChange(idx, 'marks', e.target.value)}
                              min="0"
                              max="100"
                            />
                            <button
                              className="text-red-500 hover:text-red-700 text-xl p-1"
                              onClick={() => handleRemoveSubjectRow(idx)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          onClick={handleAddSubjectRow}
                        >
                          Add Subject
                        </button>
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
                          onClick={handleSaveSubjects}
                        >
                          Save
                        </button>
                        <button
                          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                          onClick={() => setShowSubjectsModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Extracurricular Activities Section */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Extracurricular Activities</h2>
                  <button className="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm" onClick={handleOpenExtracurricularModal}>
                    Update
                  </button>
                </div>
                <div className="space-y-4">
                  {extracurricularActivities.length > 0 ? (
                    extracurricularActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                        <div className="w-3 h-3 bg-gray-400 rounded-full mt-1 flex-shrink-0"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                          <p className="text-xs text-gray-600 mt-1">- {activity.role}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm italic text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
                      Please update your profile to add extracurricular activities.
                    </div>
                  )}
                </div>

                {/* Extracurricular Activities Modal */}
                {showExtracurricularModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative m-4">
                      <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                        onClick={() => setShowExtracurricularModal(false)}
                        aria-label="Close"
                      >
                        &times;
                      </button>
                      <h4 className="text-xl font-semibold mb-6 text-gray-900">Edit Extracurricular Activities</h4>
                      <div className="space-y-3">
                        {editExtracurricularActivities.map((row, idx) => (
                          <div key={idx} className="flex gap-3 items-center">
                            <input
                              type="text"
                              className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                              placeholder="Activity"
                              value={row.activity}
                              onChange={e => handleExtracurricularChange(idx, 'activity', e.target.value)}
                            />
                            <input
                              type="text"
                              className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                              placeholder="Role"
                              value={row.role}
                              onChange={e => handleExtracurricularChange(idx, 'role', e.target.value)}
                            />
                            <button
                              className="text-red-500 hover:text-red-700 text-xl p-1"
                              onClick={() => handleRemoveExtracurricularRow(idx)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          onClick={handleAddExtracurricularRow}
                        >
                          Add Activity
                        </button>
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
                          onClick={handleSaveExtracurricularActivities}
                        >
                          Save
                        </button>
                        <button
                          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                          onClick={() => setShowExtracurricularModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Certifications Section */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 lg:col-span-2 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Certifications</h2>
                  <button className="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm" onClick={handleOpenCertificationsModal}>
                    Update
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certifications.length > 0 ? (
                    certifications.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                        <div className="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-gray-700 font-medium">{cert}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm italic text-center py-8 bg-gray-50 rounded-lg border border-gray-100 md:col-span-2">
                      Please update your profile to add certifications.
                    </div>
                  )}
                </div>

                {/* Certifications Modal */}
                {showCertificationsModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative m-4">
                      <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                        onClick={() => setShowCertificationsModal(false)}
                        aria-label="Close"
                      >
                        &times;
                      </button>
                      <h4 className="text-xl font-semibold mb-6 text-gray-900">Edit Certifications</h4>
                      <div className="space-y-3">
                        {editCertifications.map((cert, idx) => (
                          <div key={idx} className="flex gap-3 items-center">
                            <input
                              type="text"
                              className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                              placeholder="Certification name"
                              value={cert}
                              onChange={e => handleCertificationChange(idx, e.target.value)}
                            />
                            <button
                              className="text-red-500 hover:text-red-700 text-xl p-1"
                              onClick={() => handleRemoveCertificationRow(idx)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          onClick={handleAddCertificationRow}
                        >
                          Add Certification
                        </button>
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
                          onClick={handleSaveCertifications}
                        >
                          Save
                        </button>
                        <button
                          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                          onClick={() => setShowCertificationsModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}