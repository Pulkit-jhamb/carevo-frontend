import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config";
import axios from "axios";
import Sidebar from "./sidebar"; // Import the Sidebar component

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
  const [isCollapsed, setIsCollapsed] = useState(false); // State for sidebar collapse
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
      {/* Imported Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {userName}</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="px-6 py-3 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm"
            >
              LOGOUT
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* About Section */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">About</h2>
                <div className="flex items-start space-x-6">
                  <div className="w-28 h-28 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-inner">
                    <svg className="w-14 h-14 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {user?.name || "Pulkit Jhamb"}
                    </h3>
                    <p className="text-gray-700 font-medium mb-1 text-lg">
                      {user?.institute || "THAPAR INSTITUTE"}
                    </p>
                    <p className="text-gray-600 mb-4">
                      {user?.year ? `Year ${user.year}` : "SEM 5"}
                    </p>
                    {user?.conclusion ? (
                      <>
                        <div
                          className="bg-gray-50 rounded-lg p-4 text-gray-800 text-sm cursor-pointer border border-gray-100 hover:bg-gray-100 transition-colors"
                          style={{
                            whiteSpace: 'pre-line',
                          }}
                          title="Click to view full conclusion"
                          onClick={() => setShowConclusionModal(true)}
                        >
                          {getConclusionPreview(user.conclusion)}
                        </div>
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
                                {user.conclusion}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4 text-gray-400 text-sm border border-gray-100">
                        No conclusion available yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CGPA Section */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">CGPA</h2>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm" onClick={handleOpenCgpaModal}>
                      Update CGPA
                    </button>
                  </div>
                </div>
                {/* Single Progress Ring for Average CGPA - LeetCode Style (fixed arc start) */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-36 h-36 flex items-center justify-center">
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
                        <svg className="w-36 h-36" viewBox="0 0 36 36">
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
                            fontSize="0.5em"
                            fontWeight="700"
                            fill="#374151"
                            style={{ fontFamily: 'Inter, Arial, sans-serif', letterSpacing: '-0.04em' }}
                          >
                            {avg || '—'}
                          </text>
                        </svg>
                      );
                    })()}
                  </div>
                  {/* Year labels and values below the ring */}
                  <div className="flex justify-between w-full mt-6 px-4 gap-4">
                    {[1,2,3,4].map((year) => (
                      <div key={year} className="flex flex-col items-center bg-gray-50 rounded-lg p-3">
                        <span className="text-xs text-gray-500 font-medium">Year {year}</span>
                        <span className="text-base font-semibold text-gray-900 mt-1">
                          {getCgpaForYear(cgpaData, year) || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* CGPA Modal */}
                {showCgpaModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative m-4">
                      <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                        onClick={() => setShowCgpaModal(false)}
                        aria-label="Close"
                      >
                        &times;
                      </button>
                      <h4 className="text-xl font-semibold mb-6 text-gray-900">Edit CGPA</h4>
                      <div className="space-y-3">
                        {editCgpa.map((row, idx) => (
                          <div key={idx} className="flex gap-3 items-center">
                            <input
                              type="text"
                              className="border border-gray-300 rounded-lg px-3 py-2 w-24 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                              placeholder="Year"
                              value={row.year}
                              onChange={e => handleCgpaChange(idx, 'year', e.target.value)}
                            />
                            <input
                              type="number"
                              className="border border-gray-300 rounded-lg px-3 py-2 w-24 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                              placeholder="CGPA"
                              value={row.value}
                              onChange={e => handleCgpaChange(idx, 'value', e.target.value)}
                              min="0"
                              max="10"
                              step="0.01"
                            />
                            <button
                              className="text-red-500 hover:text-red-700 text-xl p-1"
                              onClick={() => handleRemoveCgpaRow(idx)}
                              title="Remove"
                            >
                              &minus;
                            </button>
                          </div>
                        ))}
                        <button
                          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          onClick={handleAddCgpaRow}
                        >
                          + Add Year
                        </button>
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
                          onClick={handleSaveCgpa}
                        >
                          Save
                        </button>
                        <button
                          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
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
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
                  <button className="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm" onClick={handleOpenProjectsModal}>
                    Add/Update Projects
                  </button>
                </div>
                <div className="space-y-4">
                  {projects.length === 0 ? (
                    <div className="text-gray-400 text-sm italic text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
                      No projects added yet. Click above to add your first project.
                    </div>
                  ) : (
                    projects.map((project, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                        <div className="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-gray-700 font-medium">
                          {project.link ? (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 transition-colors">{project.name}</a>
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
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative m-4">
                      <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                        onClick={() => setShowProjectsModal(false)}
                        aria-label="Close"
                      >
                        &times;
                      </button>
                      <h4 className="text-xl font-semibold mb-6 text-gray-900">Edit Projects</h4>
                      <div className="space-y-3">
                        {editProjects.map((row, idx) => (
                          <div key={idx} className="flex gap-3 items-center">
                            <input
                              type="text"
                              className="border border-gray-300 rounded-lg px-3 py-2 w-40 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                              placeholder="Project Name"
                              value={row.name}
                              onChange={e => handleProjectChange(idx, 'name', e.target.value)}
                            />
                            <input
                              type="url"
                              className="border border-gray-300 rounded-lg px-3 py-2 w-56 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                              placeholder="Project Link (optional)"
                              value={row.link}
                              onChange={e => handleProjectChange(idx, 'link', e.target.value)}
                            />
                            <button
                              className="text-red-500 hover:text-red-700 text-xl p-1"
                              onClick={() => handleRemoveProjectRow(idx)}
                              title="Remove"
                            >
                              &minus;
                            </button>
                          </div>
                        ))}
                        <button
                          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          onClick={handleAddProjectRow}
                        >
                          + Add Project
                        </button>
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
                          onClick={handleSaveProjects}
                        >
                          Save
                        </button>
                        <button
                          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
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
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Experiences</h2>
                  <button className="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm" onClick={handleOpenExperiencesModal}>
                    Update
                  </button>
                </div>
                <div className="space-y-4" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                  {experiences.length === 0 ? (
                    <div className="text-gray-400 text-sm italic text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
                      Update your experience to showcase your journey.
                    </div>
                  ) : (
                    experiences.map((exp, index) => {
                      const isLong = exp.content && exp.content.length > 120;
                      return (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                          <span className="text-sm font-semibold text-gray-800 block mb-2">
                            {exp.link ? (
                              <a href={exp.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 transition-colors">{exp.heading}</a>
                            ) : (
                              exp.heading
                            )}
                          </span>
                          <span className="text-xs text-gray-600" style={{
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
                              <button className="text-blue-500 ml-2 text-xs underline hover:text-blue-700 transition-colors" onClick={() => setShowExperienceDetail({ open: true, exp })}>
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
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative m-4">
                      <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                        onClick={() => setShowExperienceDetail({ open: false, exp: null })}
                        aria-label="Close"
                      >
                        &times;
                      </button>
                      <h4 className="text-xl font-semibold mb-4 text-gray-900">
                        {showExperienceDetail.exp?.link ? (
                          <a href={showExperienceDetail.exp.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 transition-colors">{showExperienceDetail.exp.heading}</a>
                        ) : (
                          showExperienceDetail.exp?.heading
                        )}
                      </h4>
                      <div className="text-gray-800 whitespace-pre-line leading-relaxed">
                        {showExperienceDetail.exp?.content}
                      </div>
                    </div>
                  </div>
                )}
                {/* Experiences Modal */}
                {showExperiencesModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full relative m-4">
                      <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                        onClick={() => setShowExperiencesModal(false)}
                        aria-label="Close"
                      >
                        &times;
                      </button>
                      <h4 className="text-xl font-semibold mb-6 text-gray-900">Edit Experiences</h4>
                      <div className="space-y-3">
                        {editExperiences.map((row, idx) => (
                          <div key={idx} className="flex gap-3 items-center">
                            <input
                              type="text"
                              className="border border-gray-300 rounded-lg px-3 py-2 w-40 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                              placeholder="Heading"
                              value={row.heading}
                              onChange={e => handleExperienceChange(idx, 'heading', e.target.value)}
                            />
                            <input
                              type="text"
                              className="border border-gray-300 rounded-lg px-3 py-2 w-56 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                              placeholder="Content"
                              value={row.content}
                              onChange={e => handleExperienceChange(idx, 'content', e.target.value)}
                            />
                            <input
                              type="url"
                              className="border border-gray-300 rounded-lg px-3 py-2 w-72 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                              placeholder="Certificate/Link (optional)"
                              value={row.link}
                              onChange={e => handleExperienceChange(idx, 'link', e.target.value)}
                            />
                            <button
                              className="text-red-500 hover:text-red-700 text-xl p-1"
                              onClick={() => handleRemoveExperienceRow(idx)}
                              title="Remove"
                            >
                              &minus;
                            </button>
                          </div>
                        ))}
                        <button
                          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          onClick={handleAddExperienceRow}
                        >
                          + Add Experience
                        </button>
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
                          onClick={handleSaveExperiences}
                        >
                          Save
                        </button>
                        <button
                          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
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
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 lg:col-span-2 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Certifications</h2>
                  <button className="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm" onClick={handleOpenCertificationsModal}>
                    Update
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certifications.length === 0 ? (
                    <div className="text-gray-400 text-sm italic text-center py-8 bg-gray-50 rounded-lg border border-gray-100 md:col-span-2">
                      No certifications added yet. Click above to add your certifications.
                    </div>
                  ) : (
                    certifications.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                        <div className="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-gray-700 font-medium">
                          {cert.link ? (
                            <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 transition-colors">{cert.name}</a>
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
                        {editCertifications.map((row, idx) => (
                          <div key={idx} className="flex gap-3 items-center">
                            <input
                              type="text"
                              className="border border-gray-300 rounded-lg px-3 py-2 w-40 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                              placeholder="Certification Name"
                              value={row.name}
                              onChange={e => handleCertificationChange(idx, 'name', e.target.value)}
                            />
                            <input
                              type="url"
                              className="border border-gray-300 rounded-lg px-3 py-2 w-56 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                              placeholder="Certificate Link (optional)"
                              value={row.link}
                              onChange={e => handleCertificationChange(idx, 'link', e.target.value)}
                            />
                            <button
                              className="text-red-500 hover:text-red-700 text-xl p-1"
                              onClick={() => handleRemoveCertificationRow(idx)}
                              title="Remove"
                            >
                              &minus;
                            </button>
                          </div>
                        ))}
                        <button
                          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          onClick={handleAddCertificationRow}
                        >
                          + Add Certification
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