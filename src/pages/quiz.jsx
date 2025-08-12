import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

// After your imports, add:
axios.defaults.baseURL = 'http://localhost:5001';
axios.defaults.withCredentials = true;

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
  return parseReport(report);
}

function parseReport(report) {
  const sections = report.split(/###\s+/);
  let conclusion = "", recommendations = "";
  for (const section of sections) {
    if (/Conclusion/i.test(section)) {
      conclusion = section.replace(/Conclusion/i, "").trim();
    } else if (/Career Recommendations/i.test(section)) {
      recommendations = section.replace(/Career Recommendations/i, "").trim();
    }
  }
  return { conclusion, recommendations };
}

function extractRecommendationTitles(recommendationsRaw) {
  return recommendationsRaw
    .split(/\n+/)
    .filter((r) => r.trim() !== "")
    .map(line => {
      const cleaned = line.replace(/\*\*/g, "").trim();
      const [titlePart] = cleaned.split(":");
      return titlePart.trim();
    });
}

// Enhanced AnimatedText component with better performance
function AnimatedText({ text, className = "" }) {
  const [visibleWords, setVisibleWords] = useState(0);
  const paragraphs = text
    ? text.split(/\n+/).flatMap(p => p.split(/(?<=\.)\s+/g))
    : [];
  const allWords = paragraphs.flatMap(p => p.split(" "));
  useEffect(() => {
    setVisibleWords(0);
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleWords(i);
      if (i >= allWords.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [text]);
  let wordCount = 0;
  return (
    <div className={className}>
      {paragraphs.map((para, pIdx) => {
        const words = para.split(" ");
        const start = wordCount;
        wordCount += words.length;
        return (
          <p key={pIdx} style={{ marginBottom: "1em", wordBreak: "break-word" }}>
            {words.map((word, idx) => (
              <span
                key={idx}
                style={{
                  opacity: start + idx < visibleWords ? 1 : 0,
                  transition: "opacity 0.3s",
                  marginRight: "0.25em"
                }}
              >
                {word}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

// Enhanced AnimatedText component with character-by-character animation
function EnhancedAnimatedText({ text, className = "", delay = 10 }) {
  const [visibleChars, setVisibleChars] = useState(0);
  
  useEffect(() => {
    setVisibleChars(0);
    if (!text) return;
    
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleChars(i);
      if (i >= text.length) clearInterval(interval);
    }, delay);
    
    return () => clearInterval(interval);
  }, [text, delay]);

  return (
    <div className={className}>
      {text.split('').map((char, idx) => (
        <span
          key={idx}
          style={{
            opacity: idx < visibleChars ? 1 : 0,
            transition: "opacity 0.1s",
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

// Enhanced results display component
function EnhancedResultsDisplay({ report, onRetake, userEmail }) {
  const results = parseEnhancedReport(report);

  // Utility to remove Markdown bold (**text**) for display
  const stripMarkdownBold = (text) =>
    typeof text === "string" ? text.replace(/\*\*(.*?)\*\*/g, "$1") : text;

  // Utility to extract bullet points (lines starting with * or -)
  function extractBullets(text) {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => /^(\*|-)\s+/.test(line))
      .map(line => line.replace(/^(\*|-)\s+/, ''));
  }

  const handleSaveResults = async () => {
    try {
      const resultData = {
        email: userEmail,
        quiz_result: results
      };
      await axios.post('/user/quiz-result', resultData);
      alert('Results saved to your profile!');
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Failed to save results. Please try again.');
    }
  };
  
  return (
    <div className="mt-16 mb-24 w-full flex flex-col items-start">
      {/* Header */}
      <div className="mb-12 w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          Your Personality Profile
        </h1>
        {results.headline && (
          <h2 className="text-2xl font-semibold text-blue-600 mb-6">
            <EnhancedAnimatedText text={stripMarkdownBold(results.headline)} />
          </h2>
        )}
      </div>

      {/* Summary */}
      {results.summary && (
        <div className="mb-10 w-full bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Executive Summary</h3>
          <EnhancedAnimatedText 
            text={stripMarkdownBold(results.summary)} 
            className="text-base text-gray-800 leading-relaxed"
            delay={5}
          />
        </div>
      )}

      <hr className="w-full border-t border-gray-200 mb-8" />

      {/* Top Capabilities */}
      {results.topCapabilities && results.topCapabilities.length > 0 && (
        <div className="mb-10 w-full">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Top Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.topCapabilities.map((capability, idx) => (
              <div key={idx} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-800 font-medium">
                    <EnhancedAnimatedText text={stripMarkdownBold(capability)} delay={20} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <hr className="w-full border-t border-gray-200 mb-8" />

      {/* Recommended Path */}
      {results.recommendedPath && (
        <div className="mb-10 w-full">
          {/* Fix heading: strip ** and animate */}
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            <EnhancedAnimatedText text={stripMarkdownBold("Recommended Career Path")} delay={10} />
          </h3>
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            {/* Show the intro sentence animated */}
            <EnhancedAnimatedText 
              text={stripMarkdownBold(results.recommendedPath.split('*')[0].trim())} 
              className="text-base text-green-800 leading-relaxed mb-4"
              delay={10}
            />
            {/* Show bullet points animated */}
            <ul className="list-disc pl-6 text-green-800">
              {extractBullets(results.recommendedPath).map((item, idx) => (
                <li key={idx}>
                  <EnhancedAnimatedText text={stripMarkdownBold(item)} delay={10} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <hr className="w-full border-t border-gray-200 mb-8" />

      {/* Strengths */}
      {results.strengths && (
        <div className="mb-10 w-full">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Key Strengths</h3>
          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <EnhancedAnimatedText 
              text={stripMarkdownBold(results.strengths)} 
              className="text-base text-yellow-800 leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Growth Areas */}
      {results.growthAreas && results.growthAreas.length > 0 && (
        <div className="mb-10 w-full">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Areas for Growth</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.growthAreas.map((area, idx) => (
              <div key={idx} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <span className="text-orange-800 font-medium capitalize">
                  <EnhancedAnimatedText text={stripMarkdownBold(area)} delay={20} />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <hr className="w-full border-t border-gray-200 mb-8" />

      {/* Suggested Next Steps */}
      {results.suggestedSteps && results.suggestedSteps.length > 0 && (
        <div className="mb-10 w-full">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Suggested Next Steps</h3>
          <div className="space-y-4">
            {results.suggestedSteps.map((step, idx) => (
              <div key={idx} className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{idx + 1}</span>
                    </div>
                  </div>
                  <span className="text-purple-800 text-sm leading-relaxed">
                    <EnhancedAnimatedText text={stripMarkdownBold(step)} delay={15} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confidence Indicator */}
      {results.confidence && (
        <div className="mb-10 w-full">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Assessment Confidence:</span>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              results.confidence === 'high' ? 'bg-green-100 text-green-800' :
              results.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {results.confidence.toUpperCase()}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-start space-x-4 mt-16 w-full">
        <button
          className="px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
          onClick={onRetake}
        >
          Retake Quiz
        </button>
        <button
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          onClick={handleSaveResults}
        >
          Save Results
        </button>
      </div>
    </div>
  );
}

function extractCapabilities(conclusion) {
  const strengths = [];
  if (/organized|precise|dependable/i.test(conclusion)) strengths.push("Organized & Precise");
  if (/creative|curious|imaginative/i.test(conclusion)) strengths.push("Creative & Curious");
  if (/supportive|caring|empathetic/i.test(conclusion)) strengths.push("Supportive & Caring");
  if (/goal-oriented|driven|ambitious/i.test(conclusion)) strengths.push("Goal-Oriented & Driven");
  if (strengths.length === 0) strengths.push("Adaptable");
  return strengths;
}

function extractRecommendedPath(recommendations) {
  const lines = recommendations.split("\n").filter(l => l.trim());
  const first = lines[0] || "";
  return first.replace(/\*\*/g, "").trim();
}

function extractBullets(text) {
  // Match lines starting with * or - and trim them
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => /^(\*|-)\s+/.test(line))
    .map(line => line.replace(/^(\*|-)\s+/, ''));
}

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [quizId, setQuizId] = useState("");
  const [answers, setAnswers] = useState({});
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(true); // Start as loading
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserInfoAndQuiz = async () => {
      setLoading(true);
      setError("");
      try {
        // Use full URL for auth check
        const response = await axios.get("http://localhost:5001/auth/status", {
          withCredentials: true
        });
        
        console.log("Auth response:", response.data); // Debug log
        
        if (response.data.authenticated && response.data.user) {
          setUserName(response.data.user.name || "User");
          setUserEmail(response.data.user.email);
  
          // Use full URL for quiz generation
          const quizRes = await axios.post("http://localhost:5001/quiz/generate", {
            studentId: response.data.user.email
          }, {
            withCredentials: true  // Add this!
          });
          
          console.log("Quiz response:", quizRes.data); // Debug log
          
          setQuestions(quizRes.data.questions || []);
          setQuizId(quizRes.data.quizId || "");
        } else {
          setError("Not authenticated. Please login.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Full error details:", error);
        console.error("Error response:", error.response?.data);
        
        const errorMessage = error.response?.data?.error || 
                            error.response?.data?.message || 
                            error.message || 
                            "Unknown error occurred";
        
        setError(`Failed to load quiz: ${errorMessage}`);
      }
      setLoading(false);
    };
    getUserInfoAndQuiz();
  }, [navigate]);

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

  const handleChange = (qId, optId) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: optId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setReport("");
    setLoading(true);
  
    try {
      const res = await axios.post("http://localhost:5001/quiz/submit", {
        studentId: userEmail,
        quizId,
        answers,
      }, {
        withCredentials: true  // Add this!
      });
      
      setReport(JSON.stringify(res.data));
    } catch (err) {
      console.error("Error submitting quiz:", err);
      console.error("Submit error response:", err.response?.data);
      setReport("Server error. Try again.");
    }
  
    setLoading(false);
  };

  // Parse report if available
  let parsed = { conclusion: "", recommendations: "" };
  try {
    parsed = report ? JSON.parse(report) : { conclusion: "", recommendations: "" };
  } catch {
    parsed = parseReport(report);
  }
  const { conclusion, recommendations } = parsed;
  const showConclusionPage = !!report;

  useEffect(() => {
    const fetchQuizResult = async () => {
      if (!userEmail) return;
      try {
        const res = await axios.get("http://localhost:5001/quiz/result", {
          params: { studentId: userEmail },
          withCredentials: true
        });
        if (res.data) {
          setReport(JSON.stringify(res.data));
        }
      } catch (err) {
        // Ignore error, just show quiz
      }
    };
    fetchQuizResult();
  }, [userEmail]);

  return (
    <div className="flex bg-white min-h-screen">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300 flex flex-col ${isCollapsed ? 'w-16' : 'w-64'}`} style={{ backgroundColor: '#fafafa' }}>
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
              const isActive = window.location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-200 text-black'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={isCollapsed ? item.label : ""}
                >
                  {item.icon}
                  {!isCollapsed && item.label}
                </Link>
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
        <div className="p-4 border-t border-gray-200" style={{ backgroundColor: '#fafafa' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-gray-600 font-semibold">{userName.charAt(0).toUpperCase()}</span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`flex-1 flex flex-col transition-all duration-300 bg-white ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Logout Button - Notion style, top-right */}
        <div className="flex justify-end px-8 pt-8">
          <button 
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 flex items-center gap-2"
          >
            Logout
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        <div className="flex-1 pb-16 pt-4 overflow-y-auto bg-white flex items-center justify-center">
          {loading ? (
            <span className="text-gray-500 text-lg">Loading quiz...</span>
          ) : error ? (
            <span className="text-red-500 text-lg">{error}</span>
          ) : (
            <div
              className="w-full"
              style={{
                maxWidth: showConclusionPage ? "1050px" : "1200px",
                paddingLeft: "2rem",
                paddingRight: "2rem",
                boxSizing: "border-box",
                overflowX: showConclusionPage ? "auto" : "visible",
              }}
            >
              {showConclusionPage ? (
                <EnhancedResultsDisplay 
                  report={report} 
                  onRetake={() => { 
                    setReport(""); 
                    setAnswers({}); 
                  }}
                  userEmail={userEmail}
                />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-12 w-full">
                  <h1 className="text-2xl font-bold text-gray-900 mb-10 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                    Personalized Psychometric Quiz
                  </h1>
                  {/* Render AI-generated questions */}
                  {questions.length === 0 ? (
                    <div className="text-gray-500 text-lg">Loading personalized questions...</div>
                  ) : (
                    <div>
                      <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-blue-800 text-sm">
                          <strong>Note:</strong> This quiz has been personalized based on your academic profile and background. 
                          Your responses will help us provide tailored career guidance and insights.
                        </p>
                      </div>
                      {questions.map((q, idx) => (
                        <div key={q.id} className="mb-8">
                          <div className="font-medium mb-3 flex items-center text-gray-900">
                            <span className="mr-2 text-gray-500">{idx + 1}.</span> {q.text}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {q.options.map((opt) => {
                              const isSelected = answers[q.id] === opt.id;
                              return (
                                <label
                                  key={opt.id}
                                  className={`flex items-center rounded-lg px-4 py-3 cursor-pointer border transition
                                    ${isSelected
                                      ? "bg-black text-white border-black"
                                      : "bg-white text-black border-gray-200 hover:border-black hover:bg-gray-50"
                                    }`}
                                  style={{ boxShadow: "none" }}
                                >
                                  <input
                                    type="radio"
                                    name={q.id}
                                    value={opt.id}
                                    checked={isSelected}
                                    onChange={() => handleChange(q.id, opt.id)}
                                    className="sr-only"
                                  />
                                  <span className="text-sm">{opt.text}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-start mt-8">
                    <button
                      type="submit"
                      disabled={loading || Object.keys(answers).length !== questions.length}
                      className="px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                    >
                      {loading ? "Analyzing..." : "Get My Personality Profile"}
                    </button>
                  </div>
                  {Object.keys(answers).length > 0 && (
                    <div className="mt-4 text-sm text-gray-600">
                      Progress: {Object.keys(answers).length}/{questions.length} questions answered
                    </div>
                  )}
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}