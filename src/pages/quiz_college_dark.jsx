import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CollegeSidebarDark from "./sidebar_college_dark"; // College dark sidebar

// Enhanced parsing function for new JSON structure
function parseEnhancedReport(report) {
  try {
    // Try to parse as JSON first (new format)
    const parsed = JSON.parse(report);
    if (parsed.headline && parsed.summary) {
      return {
        headline: parsed.headline,
        summary: parsed.summary,
        topCapabilities: parsed.top_capabilities || [],
        recommendedPath: parsed.recommended_path || "",
        strengths: parsed.strengths || "",
        growthAreas: parsed.growth_areas || [],
        suggestedSteps: parsed.suggested_next_steps || [],
        confidence: parsed.confidence || "medium"
      };
    }
  } catch (e) {
    // Fallback to old parsing method
    console.log("Using fallback parsing");
  }
  
  // Fallback parsing for old format
  const lines = report.split('\n').filter(line => line.trim());
  const result = {
    headline: "Career Assessment Report",
    summary: "",
    topCapabilities: [],
    recommendedPath: "",
    strengths: "",
    growthAreas: [],
    suggestedSteps: [],
    confidence: "medium"
  };

  let currentSection = "";
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().includes('headline') || trimmed.toLowerCase().includes('summary')) {
      currentSection = "summary";
      result.summary += trimmed.replace(/headline:?/i, '').replace(/summary:?/i, '').trim() + " ";
    } else if (trimmed.toLowerCase().includes('top capabilities') || trimmed.toLowerCase().includes('strengths')) {
      currentSection = "capabilities";
    } else if (trimmed.toLowerCase().includes('recommended') || trimmed.toLowerCase().includes('path')) {
      currentSection = "path";
    } else if (currentSection === "capabilities" && trimmed.startsWith('-')) {
      result.topCapabilities.push(trimmed.substring(1).trim());
    } else if (currentSection === "path") {
      result.recommendedPath += trimmed + " ";
    }
  }
  
  return result;
}

export default function QuizCollegeDark() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [parsedReport, setParsedReport] = useState(null);
  const navigate = useNavigate();

  // Theme toggle handler
  const handleToggleTheme = () => {
    navigate("/quiz-college-light");
  };

  useEffect(() => {
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
        navigate("/login");
      }
    };
    getUserInfo();
  }, [navigate]);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    // Fetch existing report
    fetch(`${API_ENDPOINTS.USER}?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        if (data.report) {
          setReport(data.report);
          const parsed = parseEnhancedReport(data.report);
          setParsedReport(parsed);
        }
      })
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  const handleGenerateReport = async () => {
    if (!user?.email) {
      setError("User email not found");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(API_ENDPOINTS.GENERATE_REPORT, {
        email: user.email
      });

      if (response.data.success) {
        const newReport = response.data.report;
        setReport(newReport);
        const parsed = parseEnhancedReport(newReport);
        setParsedReport(parsed);
      } else {
        setError(response.data.message || "Failed to generate report");
      }
    } catch (err) {
      console.error("Error generating report:", err);
      setError("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence?.toLowerCase()) {
      case 'high': return 'text-green-400 bg-green-900';
      case 'medium': return 'text-yellow-400 bg-yellow-900';
      case 'low': return 'text-red-400 bg-red-900';
      default: return 'text-gray-400 bg-gray-800';
    }
  };

  return (
    <div className="flex bg-black min-h-screen">
      <CollegeSidebarDark isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <div className="bg-black border-b border-gray-800 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Psychometric Assessment</h1>
            <p className="text-gray-400 mt-1">Discover your career potential and strengths</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Theme toggle button */}
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              title="Switch to Light Mode"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="flex items-center gap-2 px-3 py-2 bg-black">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-white">{userName}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-black">
          <div className="max-w-4xl mx-auto">
            {!parsedReport ? (
              <div className="text-center py-12">
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
                  <div className="w-24 h-24 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Ready for Your Assessment?</h2>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    Get personalized insights about your career potential, strengths, and recommended paths based on your profile and interests.
                  </p>
                  <button
                    onClick={handleGenerateReport}
                    disabled={loading}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Generating Report..." : "Generate Assessment Report"}
                  </button>
                  {error && (
                    <div className="mt-4 p-4 bg-red-900 border border-red-800 rounded-lg">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header Card */}
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">{parsedReport.headline}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(parsedReport.confidence)}`}>
                      {parsedReport.confidence?.toUpperCase() || 'MEDIUM'} Confidence
                    </span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{parsedReport.summary}</p>
                </div>

                {/* Top Capabilities */}
                {parsedReport.topCapabilities.length > 0 && (
                  <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
                    <h3 className="text-xl font-bold text-white mb-4">Top Capabilities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {parsedReport.topCapabilities.map((capability, index) => (
                        <div key={index} className="flex items-center p-4 bg-blue-900 rounded-lg">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                          <span className="text-gray-200 font-medium">{capability}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Path */}
                {parsedReport.recommendedPath && (
                  <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
                    <h3 className="text-xl font-bold text-white mb-4">Recommended Career Path</h3>
                    <p className="text-gray-300 leading-relaxed">{parsedReport.recommendedPath}</p>
                  </div>
                )}

                {/* Strengths */}
                {parsedReport.strengths && (
                  <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
                    <h3 className="text-xl font-bold text-white mb-4">Key Strengths</h3>
                    <p className="text-gray-300 leading-relaxed">{parsedReport.strengths}</p>
                  </div>
                )}

                {/* Growth Areas */}
                {parsedReport.growthAreas.length > 0 && (
                  <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
                    <h3 className="text-xl font-bold text-white mb-4">Areas for Growth</h3>
                    <ul className="space-y-2">
                      {parsedReport.growthAreas.map((area, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-300">{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggested Next Steps */}
                {parsedReport.suggestedSteps.length > 0 && (
                  <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
                    <h3 className="text-xl font-bold text-white mb-4">Suggested Next Steps</h3>
                    <ul className="space-y-3">
                      {parsedReport.suggestedSteps.map((step, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-6 h-6 bg-green-900 text-green-400 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <span className="text-gray-300">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Regenerate Button */}
                <div className="text-center">
                  <button
                    onClick={handleGenerateReport}
                    disabled={loading}
                    className="px-8 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Regenerating..." : "Regenerate Report"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
