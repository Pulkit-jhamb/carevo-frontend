import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar_dark"; // Import dark sidebar

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

// Enhanced results display component - Dark Mode
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
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
          Your Personality Profile
        </h1>
        {results.headline && (
          <h2 className="text-2xl font-semibold text-gray-400 mb-6">
            <EnhancedAnimatedText text={stripMarkdownBold(results.headline)} />
          </h2>
        )}
      </div>

      {/* Summary */}
      {results.summary && (
        <div className="mb-10 w-full bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">Executive Summary</h3>
          <EnhancedAnimatedText 
            text={stripMarkdownBold(results.summary)} 
            className="text-base text-gray-300 leading-relaxed"
            delay={5}
          />
        </div>
      )}

      <hr className="w-full border-t border-gray-700 mb-8" />

      {/* Top Capabilities */}
      {results.topCapabilities && results.topCapabilities.length > 0 && (
        <div className="mb-10 w-full">
          <h3 className="text-xl font-semibold text-white mb-4">Your Top Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.topCapabilities.map((capability, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-300 font-medium">
                    <EnhancedAnimatedText text={stripMarkdownBold(capability)} delay={20} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <hr className="w-full border-t border-gray-700 mb-8" />

      {/* Recommended Path */}
      {results.recommendedPath && (
        <div className="mb-10 w-full">
          <h3 className="text-xl font-semibold text-white mb-4">
            <EnhancedAnimatedText text={stripMarkdownBold("Recommended Career Path")} delay={10} />
          </h3>
          <div className="bg-green-900 rounded-lg p-6 border border-green-700">
            <EnhancedAnimatedText 
              text={stripMarkdownBold(results.recommendedPath.split('*')[0].trim())} 
              className="text-base text-green-300 leading-relaxed mb-4"
              delay={10}
            />
            <ul className="list-disc pl-6 text-green-300">
              {extractBullets(results.recommendedPath).map((item, idx) => (
                <li key={idx}>
                  <EnhancedAnimatedText text={stripMarkdownBold(item)} delay={10} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <hr className="w-full border-t border-gray-700 mb-8" />

      {/* Strengths */}
      {results.strengths && (
        <div className="mb-10 w-full">
          <h3 className="text-xl font-semibold text-white mb-4">Your Key Strengths</h3>
          <div className="bg-yellow-900 rounded-lg p-6 border border-yellow-700">
            <EnhancedAnimatedText 
              text={stripMarkdownBold(results.strengths)} 
              className="text-base text-yellow-300 leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Growth Areas */}
      {results.growthAreas && results.growthAreas.length > 0 && (
        <div className="mb-10 w-full">
          <h3 className="text-xl font-semibold text-white mb-4">Areas for Growth</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.growthAreas.map((area, idx) => (
              <div key={idx} className="bg-orange-900 rounded-lg p-4 border border-orange-700">
                <span className="text-orange-300 font-medium capitalize">
                  <EnhancedAnimatedText text={stripMarkdownBold(area)} delay={20} />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <hr className="w-full border-t border-gray-700 mb-8" />

      {/* Suggested Next Steps */}
      {results.suggestedSteps && results.suggestedSteps.length > 0 && (
        <div className="mb-10 w-full">
          <h3 className="text-xl font-semibold text-white mb-4">Suggested Next Steps</h3>
          <div className="space-y-4">
            {results.suggestedSteps.map((step, idx) => (
              <div key={idx} className="bg-purple-900 rounded-lg p-4 border border-purple-700">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{idx + 1}</span>
                    </div>
                  </div>
                  <span className="text-purple-300 text-sm leading-relaxed">
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
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Assessment Confidence:</span>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              results.confidence === 'high' ? 'bg-green-800 text-green-300' :
              results.confidence === 'medium' ? 'bg-yellow-800 text-yellow-300' :
              'bg-red-800 text-red-300'
            }`}>
              {results.confidence.toUpperCase()}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-start space-x-4 mt-16 w-full">
        <button
          className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
          onClick={onRetake}
        >
          Retake Quiz
        </button>
        <button
          className="px-8 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-500 transition"
          onClick={handleSaveResults}
        >
          Save Results
        </button>
      </div>
    </div>
  );
}

export default function QuizDark() {
  const [questions, setQuestions] = useState([]);
  const [quizId, setQuizId] = useState("");
  const [answers, setAnswers] = useState({});
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  // Theme toggle handler
  const handleToggleTheme = () => {
    navigate("/quiz");
  };

  useEffect(() => {
    const getUserInfoAndQuiz = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS);
        
        console.log("Auth response:", response.data);
        
        if (response.data.authenticated && response.data.user) {
          setUserName(response.data.user.name || "User");
          setUserEmail(response.data.user.email);
  
          const quizRes = await axios.post(`${API_ENDPOINTS.BACKEND}/quiz/generate`, {
            studentId: response.data.user.email
          });
          
          console.log("Quiz response:", quizRes.data);
          
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
      const res = await axios.post(`${API_ENDPOINTS.BACKEND}/quiz/submit`, {
        studentId: userEmail,
        quizId,
        answers,
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
        const res = await axios.get(`${API_ENDPOINTS.BACKEND}/quiz/result`, {
          params: { studentId: userEmail }
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
    <div className="flex bg-black min-h-screen">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className={`flex-1 flex flex-col transition-all duration-300 bg-black ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header with theme toggle */}
        <div className="border-b border-gray-700 px-8 py-5 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">Quiz</h1>
          <button
            onClick={handleToggleTheme}
            className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            title="Switch to Light Mode"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="flex-1 pb-16 pt-8 overflow-y-auto bg-black flex items-center justify-center">
          {loading ? (
            <span className="text-gray-400 text-lg">Loading quiz...</span>
          ) : error ? (
            <span className="text-red-400 text-lg">{error}</span>
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
                  <h1 className="text-2xl font-bold text-white mb-10 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                    Personalized Psychometric Quiz
                  </h1>
                  {questions.length === 0 ? (
                    <div className="text-gray-400 text-lg">Loading personalized questions...</div>
                  ) : (
                    <div>
                      <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <p className="text-gray-300 text-sm">
                          <strong>Note:</strong> This quiz has been personalized based on your academic profile and background. 
                          Your responses will help us provide tailored career guidance and insights.
                        </p>
                      </div>
                      {questions.map((q, idx) => (
                        <div key={q.id} className="mb-8">
                          <div className="font-medium mb-3 flex items-center text-white">
                            <span className="mr-2 text-gray-400">{idx + 1}.</span> {q.text}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {q.options.map((opt) => {
                              const isSelected = answers[q.id] === opt.id;
                              return (
                                <label
                                  key={opt.id}
                                  className={`flex items-center rounded-lg px-4 py-3 cursor-pointer border transition
                                    ${isSelected
                                      ? "bg-white text-black border-white"
                                      : "bg-gray-800 text-white border-gray-700 hover:border-white hover:bg-gray-700"
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
                      className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50"
                    >
                      {loading ? "Analyzing..." : "Get My Personality Profile"}
                    </button>
                  </div>
                  {Object.keys(answers).length > 0 && (
                    <div className="mt-4 text-sm text-gray-400">
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
