import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config";
import axios from "axios";

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showConclusionModal, setShowConclusionModal] = useState(false);
  const [showCgpaModal, setShowCgpaModal] = useState(false);
  const [cgpaData, setCgpaData] = useState([]);
  const [editCgpa, setEditCgpa] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [editProjects, setEditProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [showExperiencesModal, setShowExperiencesModal] = useState(false);
  const [editExperiences, setEditExperiences] = useState([]);
  const [showExperienceDetail, setShowExperienceDetail] = useState({ open: false, exp: null });
  const [certifications, setCertifications] = useState([]);
  const [showCertificationsModal, setShowCertificationsModal] = useState(false);
  const [editCertifications, setEditCertifications] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    fetch(`${API_ENDPOINTS.USER}?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setCgpaData(data.cgpa || []);
        setProjects(data.projects || []);
        setExperiences(data.experiences || []);
        setCertifications(data.certifications || []);
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
          setUserName(response.data.user.name || "User");
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

  const handleOpenCgpaModal = () => {
    setEditCgpa(cgpaData.length ? [...cgpaData] : [{ year: '', value: '' }]);
    setShowCgpaModal(true);
  };

  const handleCgpaChange = (idx, field, value) => {
    const updated = [...editCgpa];
    updated[idx][field] = value;
    setEditCgpa(updated);
  };

  const handleAddCgpaRow = () => {
    setEditCgpa([...editCgpa, { year: '', value: '' }]);
  };

  const handleRemoveCgpaRow = (idx) => {
    const updated = [...editCgpa];
    updated.splice(idx, 1);
    setEditCgpa(updated);
  };

  const handleSaveCgpa = async () => {
    try {
      await axios.patch(
        API_ENDPOINTS.CGPA_UPDATE,
        {
          email: user.email,
          cgpa: editCgpa,
        }
      );
      setCgpaData(editCgpa);
      setShowCgpaModal(false);
    } catch (err) {
      alert('Failed to update CGPA');
    }
  };

  const handleOpenProjectsModal = () => {
    setEditProjects(projects.length ? [...projects] : [{ name: '', link: '' }]);
    setShowProjectsModal(true);
  };
  const handleProjectChange = (idx, field, value) => {
    const updated = [...editProjects];
    updated[idx][field] = value;
    setEditProjects(updated);
  };
  const handleAddProjectRow = () => {
    setEditProjects([...editProjects, { name: '', link: '' }]);
  };
  const handleRemoveProjectRow = (idx) => {
    const updated = [...editProjects];
    updated.splice(idx, 1);
    setEditProjects(updated);
  };
  const handleSaveProjects = async () => {
    try {
      await axios.patch(
        API_ENDPOINTS.PROJECTS_UPDATE,
        {
          email: user.email,
          projects: editProjects,
        }
      );
      setProjects(editProjects);
      setShowProjectsModal(false);
    } catch (err) {
      alert('Failed to update projects');
    }
  };

  const handleOpenExperiencesModal = () => {
    setEditExperiences(experiences.length ? [...experiences] : [{ heading: '', content: '', link: '' }]);
    setShowExperiencesModal(true);
  };
  const handleExperienceChange = (idx, field, value) => {
    const updated = [...editExperiences];
    updated[idx][field] = value;
    setEditExperiences(updated);
  };
  const handleAddExperienceRow = () => {
    setEditExperiences([...editExperiences, { heading: '', content: '', link: '' }]);
  };
  const handleRemoveExperienceRow = (idx) => {
    const updated = [...editExperiences];
    updated.splice(idx, 1);
    setEditExperiences(updated);
  };
  const handleSaveExperiences = async () => {
    try {
      await axios.patch(
        API_ENDPOINTS.EXPERIENCES_UPDATE,
        {
          email: user.email,
          experiences: editExperiences,
        }
      );
      setExperiences(editExperiences);
      setShowExperiencesModal(false);
    } catch (err) {
      alert('Failed to update experiences');
    }
  };

  const handleOpenCertificationsModal = () => {
    setEditCertifications(certifications.length ? [...certifications] : [{ name: '', link: '' }]);
    setShowCertificationsModal(true);
  };

  const handleCertificationChange = (idx, field, value) => {
    const updated = [...editCertifications];
    updated[idx][field] = value;
    setEditCertifications(updated);
  };

  const handleAddCertificationRow = () => {
    setEditCertifications([...editCertifications, { name: '', link: '' }]);
  };

  const handleRemoveCertificationRow = (idx) => {
    const updated = [...editCertifications];
    updated.splice(idx, 1);
    setEditCertifications(updated);
  };

  const handleSaveCertifications = async () => {
    try {
      await axios.patch(
        API_ENDPOINTS.CERTIFICATIONS_UPDATE,
        {
          email: user.email,
          certifications: editCertifications,
        }
      );
      setCertifications(editCertifications);
      setShowCertificationsModal(false);
    } catch (err) {
      alert('Failed to update certifications');
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
      label: "Chat",
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

  // Helper to get a clean preview up to a character limit

  function getConclusionPreview(text, limit = 120) {
    if (!text) return "";
    if (text.length <= limit) return text;
    // Find the last space before the limit to avoid breaking words
    const trimmed = text.slice(0, limit);
    const lastSpace = trimmed.lastIndexOf(" ");
    return trimmed.slice(0, lastSpace) + "... more";
  }

  // Helper to get CGPA for a given year (1-4)
  function getCgpaForYear(cgpaData, year) {
    const found = cgpaData.find(item => String(item.year) === String(year) || String(item.year) === `Year ${year}`);
    return found ? found.value : null;
  }
  // Helper to get average CGPA
  function getAverageCgpa(cgpaData) {
    if (!cgpaData.length) return null;
    const sum = cgpaData.reduce((acc, item) => acc + parseFloat(item.value || 0), 0);
    return (sum / cgpaData.length).toFixed(2);
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`} style={{ backgroundColor: '#fafafa' }}>
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200" style={{ backgroundColor: '#fafafa' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              {!isCollapsed && <span className="text-xl font-bold text-black">Carevo</span>}
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4" style={{ backgroundColor: '#fafafa' }}>
          <div className="space-y-2">
            {!isCollapsed && <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</div>}
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-200 text-black'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={isCollapsed ? item.label : ""}
                >
                  {item.icon}
                  {!isCollapsed && item.label}
                </a>
              );
            })}
          </div>

          {!isCollapsed && (
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
          )}
        </nav>

        {/* User Profile - always at bottom */}
        <div className="p-4 border-t border-gray-200 mt-auto" style={{ backgroundColor: '#fafafa' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold">{userName.charAt(0).toUpperCase()}</span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
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
        <div className="flex-1 p-6 overflow-y-auto bg-transparent">
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
                      {user?.name || "Pulkit Jhamb"}
                    </h3>
                    <p className="text-gray-700 font-medium mb-1">
                      {user?.institute || "THAPAR INSTITUTE"}
                    </p>
                    <p className="text-gray-600 mb-3">
                      {user?.year ? `Year ${user.year}` : "SEM 5"}
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

              {/* CGPA Section */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">CGPA</h2>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800" onClick={handleOpenCgpaModal}>
                      Update CGPA
                    </button>
                  </div>
                </div>
                {/* Single Progress Ring for Average CGPA - LeetCode Style (fixed arc start) */}
                <div className="flex flex-col items-center mb-4">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    {(() => {
                      const avg = getAverageCgpa(cgpaData);
                      const avgNum = avg ? parseFloat(avg) : 0;
                      const percent = avgNum / 10;
                      let color = '#ef4444'; // red
                      if (avgNum > 7.5) color = '#22c55e'; // green
                      else if (avgNum > 5) color = '#eab308'; // yellow
                      // SVG arc math
                      const radius = 15.5;
                      const circumference = 2 * Math.PI * radius;
                      const arcLength = circumference * percent;
                      return (
                        <svg className="w-32 h-32" viewBox="0 0 36 36">
                          {/* Background ring (full circle, always fixed) */}
                          <circle
                            cx="18" cy="18" r={radius}
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="2.5"
                          />
                          {/* Progress arc - always starts at 225deg (bottom left) */}
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
                          {/* Centered CGPA number only, no /10 */}
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
                  {/* Year labels and values below the ring */}
                  <div className="flex justify-between w-full mt-4 px-2 gap-2">
                    {[1,2,3,4].map((year) => (
                      <div key={year} className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">Year {year}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {getCgpaForYear(cgpaData, year) || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* CGPA Modal */}
                {showCgpaModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
                      <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                        onClick={() => setShowCgpaModal(false)}
                        aria-label="Close"
                      >
                        &times;
                      </button>
                      <h4 className="text-lg font-semibold mb-4">Edit CGPA</h4>
                      <div className="space-y-2">
                        {editCgpa.map((row, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              className="border rounded px-2 py-1 w-24"
                              placeholder="Year"
                              value={row.year}
                              onChange={e => handleCgpaChange(idx, 'year', e.target.value)}
                            />
                            <input
                              type="number"
                              className="border rounded px-2 py-1 w-24"
                              placeholder="CGPA"
                              value={row.value}
                              onChange={e => handleCgpaChange(idx, 'value', e.target.value)}
                              min="0"
                              max="10"
                              step="0.01"
                            />
                            <button
                              className="text-red-500 hover:text-red-700 text-lg"
                              onClick={() => handleRemoveCgpaRow(idx)}
                              title="Remove"
                            >
                              &minus;
                            </button>
                          </div>
                        ))}
                        <button
                          className="mt-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          onClick={handleAddCgpaRow}
                        >
                          + Add Year
                        </button>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                          onClick={handleSaveCgpa}
                        >
                          Save
                        </button>
                        <button
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                          onClick={() => setShowCgpaModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Project Section */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Projects</h2>
                  <button className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800" onClick={handleOpenProjectsModal}>
                    Add/Update Projects
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {projects.length === 0 ? 'Add your projects' : ''}
                </p>
                <div className="space-y-3">
                  {projects.length === 0 ? (
                    <div className="text-gray-400 text-sm italic">No projects added yet.</div>
                  ) : (
                    projects.map((project, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <span className="text-sm text-gray-700 font-medium">
                          {project.link ? (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">{project.name}</a>
                          ) : (
                            project.name
                          )}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                {/* Projects Modal */}
                {showProjectsModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
                      <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                        onClick={() => setShowProjectsModal(false)}
                        aria-label="Close"
                      >
                        &times;
                      </button>
                      <h4 className="text-lg font-semibold mb-4">Edit Projects</h4>
                      <div className="space-y-2">
                        {editProjects.map((row, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              className="border rounded px-2 py-1 w-40"
                              placeholder="Project Name"
                              value={row.name}
                              onChange={e => handleProjectChange(idx, 'name', e.target.value)}
                            />
                            <input
                              type="url"
                              className="border rounded px-2 py-1 w-56"
                              placeholder="Project Link (optional)"
                              value={row.link}
                              onChange={e => handleProjectChange(idx, 'link', e.target.value)}
                            />
                            <button
                              className="text-red-500 hover:text-red-700 text-lg"
                              onClick={() => handleRemoveProjectRow(idx)}
                              title="Remove"
                            >
                              &minus;
                            </button>
                          </div>
                        ))}
                        <button
                          className="mt-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          onClick={handleAddProjectRow}
                        >
                          + Add Project
                        </button>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                          onClick={handleSaveProjects}
                        >
                          Save
                        </button>
                        <button
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                          onClick={() => setShowProjectsModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Experiences Section */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Experiences</h2>
                  <button className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800" onClick={handleOpenExperiencesModal}>
                    Update
                  </button>
                </div>
                {/* Remove helper text */}
                <div className="space-y-3" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                  {experiences.length === 0 ? (
                    <div className="text-gray-400 text-sm italic">Update your experience</div>
                  ) : (
                    experiences.map((exp, index) => {
                      const isLong = exp.content && exp.content.length > 120;
                      return (
                        <div key={index} className="flex flex-col mb-2">
                          <span className="text-sm font-semibold text-gray-800">
                            {exp.link ? (
                              <a href={exp.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">{exp.heading}</a>
                            ) : (
                              exp.heading
                            )}
                          </span>
                          <span className="text-xs text-gray-600 ml-1" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'pre-line',
                            maxWidth: '100%'
                          }}>
                            {isLong ? exp.content.slice(0, 120) + '...' : exp.content}
                            {isLong && (
                              <button className="text-blue-500 ml-1 text-xs underline" onClick={() => setShowExperienceDetail({ open: true, exp })}>
                                View more
                              </button>
                            )}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
                {/* Experience Detail Modal */}
                {showExperienceDetail.open && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
                      <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                        onClick={() => setShowExperienceDetail({ open: false, exp: null })}
                        aria-label="Close"
                      >
                        &times;
                      </button>
                      <h4 className="text-lg font-semibold mb-2">
                        {showExperienceDetail.exp?.link ? (
                          <a href={showExperienceDetail.exp.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">{showExperienceDetail.exp.heading}</a>
                        ) : (
                          showExperienceDetail.exp?.heading
                        )}
                      </h4>
                      <div className="text-gray-800 whitespace-pre-line">
                        {showExperienceDetail.exp?.content}
                      </div>
                    </div>
                  </div>
                )}
                {/* Experiences Modal */}
                {showExperiencesModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative">
                      <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                        onClick={() => setShowExperiencesModal(false)}
                        aria-label="Close"
                      >
                        &times;
                      </button>
                      <h4 className="text-lg font-semibold mb-4">Edit Experiences</h4>
                      <div className="space-y-2">
                        {editExperiences.map((row, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              className="border rounded px-2 py-1 w-40"
                              placeholder="Heading"
                              value={row.heading}
                              onChange={e => handleExperienceChange(idx, 'heading', e.target.value)}
                            />
                            <input
                              type="text"
                              className="border rounded px-2 py-1 w-56"
                              placeholder="Content"
                              value={row.content}
                              onChange={e => handleExperienceChange(idx, 'content', e.target.value)}
                            />
                            <input
                              type="url"
                              className="border rounded px-2 py-1 w-72"
                              placeholder="Certificate/Link (optional)"
                              value={row.link}
                              onChange={e => handleExperienceChange(idx, 'link', e.target.value)}
                            />
                            <button
                              className="text-red-500 hover:text-red-700 text-lg"
                              onClick={() => handleRemoveExperienceRow(idx)}
                              title="Remove"
                            >
                              &minus;
                            </button>
                          </div>
                        ))}
                        <button
                          className="mt-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          onClick={handleAddExperienceRow}
                        >
                          + Add Experience
                        </button>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                          onClick={handleSaveExperiences}
                        >
                          Save
                        </button>
                        <button
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                          onClick={() => setShowExperiencesModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Certifications Section */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 lg:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-900">Certifications</h2>
                  <button className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800" onClick={handleOpenCertificationsModal}>
                    Update
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {certifications.length === 0 ? 'Add your certifications' : ''}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {certifications.length === 0 ? (
                    <div className="text-gray-400 text-sm italic">No certifications added yet.</div>
                  ) : (
                    certifications.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <span className="text-sm text-gray-700 font-medium">
                          {cert.link ? (
                            <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">{cert.name}</a>
                          ) : (
                            cert.name
                          )}
                        </span>
                      </div>
                    ))
                  )}
                </div>
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
                      <div className="space-y-2">
                        {editCertifications.map((row, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              className="border rounded px-2 py-1 w-40"
                              placeholder="Certification Name"
                              value={row.name}
                              onChange={e => handleCertificationChange(idx, 'name', e.target.value)}
                            />
                            <input
                              type="url"
                              className="border rounded px-2 py-1 w-56"
                              placeholder="Certificate Link (optional)"
                              value={row.link}
                              onChange={e => handleCertificationChange(idx, 'link', e.target.value)}
                            />
                            <button
                              className="text-red-500 hover:text-red-700 text-lg"
                              onClick={() => handleRemoveCertificationRow(idx)}
                              title="Remove"
                            >
                              &minus;
                            </button>
                          </div>
                        ))}
                        <button
                          className="mt-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          onClick={handleAddCertificationRow}
                        >
                          + Add Certification
                        </button>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
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
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}