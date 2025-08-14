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
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Imported Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Student Dashboard</h1>
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
                      {user?.name || "Aanya Mehra"}
                    </h3>
                    <p className="text-gray-700 font-medium mb-1 text-lg">
                      {user?.institute || "SPRINGDALE HIGH SCHOOL"}
                    </p>
                    <p className="text-gray-600 mb-4">
                      {user?.year ? `Year ${user.year}` : "10TH GRADE"}
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

              {/* Academic Performance Section */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Academic Performance</h2>
                  <button className="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm" onClick={handleOpenTermModal}>
                    Update
                  </button>
                </div>
                
                {/* Dynamic Donut Chart */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-36 h-36">
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
                        <svg className="w-36 h-36" viewBox="0 0 36 36">
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
                </div>
                
                {/* Performance Data - FIXED TO SHOW 4 TERMS */}
                <div className="flex justify-between gap-4">
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 flex-1">
                    <div className="w-3 h-3 bg-gray-600 rounded-full flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Term 1</p>
                      <p className="text-sm text-gray-600">{termData[0]?.percentage || "--"}%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 flex-1">
                    <div className="w-3 h-3 bg-gray-500 rounded-full flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Term 2</p>
                      <p className="text-sm text-gray-600">{termData[1]?.percentage || "--"}%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 flex-1">
                    <div className="w-3 h-3 bg-gray-700 rounded-full flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Term 3</p>
                      <p className="text-sm text-gray-600">{termData[2]?.percentage || "--"}%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 flex-1">
                    <div className="w-3 h-3 bg-gray-800 rounded-full flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Term 4</p>
                      <p className="text-sm text-gray-600">{termData[3]?.percentage || "--"}%</p>
                    </div>
                  </div>
                </div>
                
                {/* Term Modal */}
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
              </div>

              {/* Top Subjects Section */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Top Subjects</h2>
                  <button className="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm" onClick={handleOpenSubjectsModal}>
                    Update
                  </button>
                </div>
                <div className="space-y-4">
                  {subjects.length > 0 ? (
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