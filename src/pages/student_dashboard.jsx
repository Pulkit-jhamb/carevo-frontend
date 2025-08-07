import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config";
import axios from "axios";

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
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
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    fetch(`${API_ENDPOINTS.USER}?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setTermData(data.termData || [
          { term: "Term 1", percentage: "" },
          { term: "Term 2", percentage: "" },
          { term: "Term 3", percentage: "" }
        ]);
        setExtracurricularActivities(data.extracurricularActivities || [
          { activity: "School Debate Team", role: "Vice Captain" },
          { activity: "Science Club", role: "Event Organizer" },
          { activity: "Dance Troupe", role: "Lead Performer" },
          { activity: "Environment Club", role: "Member" }
        ]);
                 setCertifications(data.certifications || [
           "Microsoft Office Specialist",
           "Python Basics - Code.org",
           "Creative Writing Workshop",
           "Math Olympiad Level 1"
         ]);
         setSubjects(data.subjects || [
           { name: "Mathematics", marks: 95 },
           { name: "Science", marks: 88 },
           { name: "Computer Applications", marks: 92 },
           { name: "English", marks: 85 }
         ]);
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
    setEditTermData(termData.length ? [...termData] : [
      { term: "Term 1", percentage: "" },
      { term: "Term 2", percentage: "" },
      { term: "Term 3", percentage: "" }
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
    },
    {
      label: "Study Plan",
      href: "/study-plan",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  // Sample data for the student dashboard

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
                    {user?.conclusion ? (
                      <>
                        <div
                          className="bg-gray-100 rounded p-3 text-gray-800 text-sm cursor-pointer overflow-hidden"
                          style={{
                            whiteSpace: 'pre-line',
                          }}
                          title="Click to view full conclusion"
                          onClick={() => setShowConclusionModal(true)}
                        >
                          {getConclusionPreview(user.conclusion)}
                        </div>
                        {showConclusionModal && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
                              <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                                onClick={() => setShowConclusionModal(false)}
                                aria-label="Close"
                              >
                                &times;
                              </button>
                              <h4 className="text-lg font-semibold mb-2">Conclusion</h4>
                              <div className="text-gray-800 whitespace-pre-line">
                                {user.conclusion}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="bg-gray-100 rounded p-3 text-gray-400 text-sm">
                        No conclusion available yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Academic Performance Section */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Academic Performance</h2>
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleOpenTermModal}>
                    Update
                  </button>
                </div>
                
                {/* Dynamic Donut Chart */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-32 h-32">
                    {(() => {
                      const avg = getAveragePercentage(termData);
                      const avgNum = avg || 0;
                      const percent = avgNum / 100;
                      let color = '#ef4444'; // red
                      if (avgNum > 80) color = '#22c55e'; // green
                      else if (avgNum > 60) color = '#eab308'; // yellow
                      
                      const radius = 15.5;
                      const circumference = 2 * Math.PI * radius;
                      const arcLength = circumference * percent;
                      
                      return (
                        <svg className="w-32 h-32" viewBox="0 0 36 36">
                          {/* Background ring */}
                          <circle
                            cx="18" cy="18" r={radius}
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="2.5"
                          />
                          {/* Progress arc */}
                          <circle
                            cx="18" cy="18" r={radius}
                            fill="none"
                            stroke={color}
                            strokeWidth="2.5"
                            strokeDasharray={`${arcLength} ${circumference - arcLength}`}
                            strokeDashoffset={circumference * 0.625}
                            strokeLinecap="round"
                            style={{
                              transition: 'stroke-dasharray 0.5s, stroke 0.5s',
                            }}
                          />
                          {/* Centered percentage */}
                          <text
                            x="18" y="20.5"
                            textAnchor="middle"
                            fontSize="0.45em"
                            fontWeight="700"
                            fill="#222"
                            style={{ fontFamily: 'Inter, Arial, sans-serif', letterSpacing: '-0.04em' }}
                          >
                            {avg || '—'}
                          </text>
                        </svg>
                      );
                    })()}
                  </div>
                </div>
                
                {/* Performance Data */}
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Term 1</p>
                      <p className="text-sm text-gray-600">{termData[0]?.percentage || "--"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Term 2</p>
                      <p className="text-sm text-gray-600">{termData[1]?.percentage || "--"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Term 3</p>
                      <p className="text-sm text-gray-600">{termData[2]?.percentage || "--"}</p>
                    </div>
                  </div>
                </div>
                
                                 {/* Term Modal */}
                 {showTermModal && (
                   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                     <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
                       <button
                         className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                         onClick={() => setShowTermModal(false)}
                         aria-label="Close"
                       >
                         &times;
                       </button>
                       <h4 className="text-lg font-semibold mb-4">Edit Term Performance</h4>
                       <div className="space-y-2">
                         {editTermData.map((row, idx) => (
                           <div key={idx} className="flex gap-2 items-center">
                             <input
                               type="text"
                               className="border rounded px-2 py-1 w-24"
                               placeholder="Term"
                               value={row.term}
                               onChange={e => handleTermChange(idx, 'term', e.target.value)}
                             />
                             <input
                               type="number"
                               className="border rounded px-2 py-1 w-24"
                               placeholder="Percentage"
                               value={row.percentage}
                               onChange={e => handleTermChange(idx, 'percentage', e.target.value)}
                               min="0"
                               max="100"
                             />
                           </div>
                         ))}
                       </div>
                       <div className="flex justify-end gap-2 mt-4">
                         <button
                           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                           onClick={handleSaveTermData}
                         >
                           Save
                         </button>
                         <button
                           className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                           onClick={() => setShowTermModal(false)}
                         >
                           Cancel
                         </button>
                       </div>
                     </div>
                   </div>
                 )}

                 {/* Extracurricular Activities Modal */}
                 {showExtracurricularModal && (
                   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                     <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
                       <button
                         className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                         onClick={() => setShowExtracurricularModal(false)}
                         aria-label="Close"
                       >
                         &times;
                       </button>
                       <h4 className="text-lg font-semibold mb-4">Edit Extracurricular Activities</h4>
                       <div className="space-y-3">
                         {editExtracurricularActivities.map((row, idx) => (
                           <div key={idx} className="flex gap-2 items-center">
                             <input
                               type="text"
                               className="border rounded px-2 py-1 flex-1"
                               placeholder="Activity"
                               value={row.activity}
                               onChange={e => handleExtracurricularChange(idx, 'activity', e.target.value)}
                             />
                             <input
                               type="text"
                               className="border rounded px-2 py-1 flex-1"
                               placeholder="Role"
                               value={row.role}
                               onChange={e => handleExtracurricularChange(idx, 'role', e.target.value)}
                             />
                             <button
                               className="px-2 py-1 text-red-600 hover:text-red-800"
                               onClick={() => handleRemoveExtracurricularRow(idx)}
                             >
                               ×
                             </button>
                           </div>
                         ))}
                       </div>
                       <div className="flex justify-between mt-4">
                         <button
                           className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                           onClick={handleAddExtracurricularRow}
                         >
                           Add Activity
                         </button>
                         <div className="flex gap-2">
                           <button
                             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                             onClick={handleSaveExtracurricularActivities}
                           >
                             Save
                           </button>
                           <button
                             className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                             onClick={() => setShowExtracurricularModal(false)}
                           >
                             Cancel
                           </button>
                         </div>
                       </div>
                     </div>
                   </div>
                 )}

                                   {/* Certifications Modal */}
                  {showCertificationsModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
                        <button
                          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                          onClick={() => setShowCertificationsModal(false)}
                          aria-label="Close"
                        >
                          &times;
                        </button>
                        <h4 className="text-lg font-semibold mb-4">Edit Certifications</h4>
                        <div className="space-y-3">
                          {editCertifications.map((cert, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <input
                                type="text"
                                className="border rounded px-2 py-1 flex-1"
                                placeholder="Certification name"
                                value={cert}
                                onChange={e => handleCertificationChange(idx, e.target.value)}
                              />
                              <button
                                className="px-2 py-1 text-red-600 hover:text-red-800"
                                onClick={() => handleRemoveCertificationRow(idx)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between mt-4">
                          <button
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            onClick={handleAddCertificationRow}
                          >
                            Add Certification
                          </button>
                          <div className="flex gap-2">
                            <button
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                              onClick={handleSaveCertifications}
                            >
                              Save
                            </button>
                            <button
                              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                              onClick={() => setShowCertificationsModal(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Subjects Modal */}
                  {showSubjectsModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
                        <button
                          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                          onClick={() => setShowSubjectsModal(false)}
                          aria-label="Close"
                        >
                          &times;
                        </button>
                        <h4 className="text-lg font-semibold mb-4">Add Marks to Gain Better Insight</h4>
                        <div className="space-y-3">
                          {editSubjects.map((subject, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <input
                                type="text"
                                className="border rounded px-2 py-1 flex-1"
                                placeholder="Subject name"
                                value={subject.name}
                                onChange={e => handleSubjectChange(idx, 'name', e.target.value)}
                              />
                              <input
                                type="number"
                                className="border rounded px-2 py-1 w-20"
                                placeholder="Marks %"
                                value={subject.marks}
                                onChange={e => handleSubjectChange(idx, 'marks', e.target.value)}
                                min="0"
                                max="100"
                              />
                              <button
                                className="px-2 py-1 text-red-600 hover:text-red-800"
                                onClick={() => handleRemoveSubjectRow(idx)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between mt-4">
                          <button
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            onClick={handleAddSubjectRow}
                          >
                            Add Subject
                          </button>
                          <div className="flex gap-2">
                            <button
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                              onClick={handleSaveSubjects}
                            >
                              Save
                            </button>
                            <button
                              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                              onClick={() => setShowSubjectsModal(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>

                             {/* Top Subjects Section */}
               <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                 <div className="flex items-center justify-between mb-2">
                   <h2 className="text-lg font-semibold text-gray-900">Top Subjects</h2>
                   <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleOpenSubjectsModal}>
                     Update
                   </button>
                 </div>
                 <p className="text-sm text-gray-600 mb-4">
                   Below are the student's highest scoring subjects
                 </p>
                 <div className="space-y-3">
                   {subjects.length > 0 ? (
                     subjects.map((subject, index) => (
                       <div key={index} className="flex items-center justify-between">
                         <div className="flex items-center space-x-3">
                           <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                           <span className="text-sm text-gray-700">{subject.name}</span>
                         </div>
                         <span className="text-sm font-medium text-gray-900">{subject.marks}%</span>
                       </div>
                     ))
                   ) : (
                     <div className="text-gray-500 text-sm">No subjects added yet.</div>
                   )}
                 </div>
               </div>

              {/* Extracurricular Activities Section */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-900">Extracurricular Activities</h2>
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleOpenExtracurricularModal}>
                    Update
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  The following are the student's activities and roles.
                </p>
                <div className="space-y-3">
                  {extracurricularActivities.length > 0 ? (
                    extracurricularActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-3 h-3 bg-gray-300 rounded-full mt-1"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                          <p className="text-xs text-gray-600">- {activity.role}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm">No extracurricular activities added yet.</div>
                  )}
                </div>
              </div>

              {/* Certifications Section */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 lg:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-900">Certifications</h2>
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleOpenCertificationsModal}>
                    Update
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  The following certifications have been completed
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {certifications.length > 0 ? (
                    certifications.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <span className="text-sm text-gray-700">{cert}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm">No certifications added yet.</div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 