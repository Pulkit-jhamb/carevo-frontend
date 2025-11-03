import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../config";
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
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes
  const navigate = useNavigate();

  // Theme toggle handler
  const handleToggleTheme = () => {
    navigate("/quiz-college-light");
  };

  // Timer effect for quiz
  useEffect(() => {
    let timer;
    if (quizStarted && !quizCompleted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted, timeRemaining]);

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateQuiz = async () => {
    if (!user?.email) {
      setError("User email not found");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Use the existing AI endpoint that was working before
      const prompt = `Generate a 30-question psychometric assessment for a college student with the following profile:
      
      Name: ${user.name}
      Major: ${user.major || 'Not specified'}
      Year: ${user.year || 'Not specified'}
      Institute: ${user.institute || 'Not specified'}
      
      Please create exactly 30 multiple-choice questions that assess:
      1. Personality traits (Big Five personality model)
      2. Career interests and preferences
      3. Learning styles
      4. Work environment preferences
      5. Leadership and teamwork tendencies
      6. Problem-solving approaches
      7. Communication styles
      8. Stress management and resilience
      
      Format each question as a JSON object with:
      - question: "The question text"
      - options: ["Option A", "Option B", "Option C", "Option D"]
      
      Return the response as a JSON array of 30 question objects. Make the questions relevant to a ${user.major || 'college'} student.`;

      const response = await axios.post(API_ENDPOINTS.AI, {
        prompt: prompt,
        email: user.email
      });

      if (response.data && response.data.response) {
        try {
          // Parse the AI response to extract questions
          let aiResponse = response.data.response;
          
          // Clean up the response if it has markdown formatting
          if (aiResponse.includes('```json')) {
            aiResponse = aiResponse.split('```json')[1].split('```')[0];
          } else if (aiResponse.includes('```')) {
            aiResponse = aiResponse.split('```')[1].split('```')[0];
          }
          
          const questions = JSON.parse(aiResponse.trim());
          
          if (Array.isArray(questions) && questions.length > 0) {
            setQuizQuestions(questions.slice(0, 30)); // Ensure exactly 30 questions
            setQuizStarted(true);
            setTimeRemaining(30 * 60); // Reset timer
          } else {
            throw new Error("Invalid question format received");
          }
        } catch (parseError) {
          console.error("Error parsing AI response:", parseError);
          setError("Failed to parse quiz questions. Please try again.");
        }
      } else {
        setError("No response received from AI service");
      }
    } catch (err) {
      console.error("Error generating quiz:", err);
      setError("Failed to generate personalized quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setLoading(true);
    setError("");

    try {
      // Prepare answers summary for the AI
      const answersText = Object.entries(answers).map(([questionIndex, answer]) => {
        const question = quizQuestions[parseInt(questionIndex)];
        return `Q${parseInt(questionIndex) + 1}: ${question?.question}\nAnswer: ${answer}`;
      }).join('\n\n');

      const prompt = `Based on the following psychometric assessment responses from ${user.name}, a ${user.major || 'college'} student at ${user.institute || 'their institute'}, generate a comprehensive career and personality analysis report.

Assessment Responses:
${answersText}

Student Profile:
- Name: ${user.name}
- Major: ${user.major || 'Not specified'}
- Year: ${user.year || 'Not specified'}
- Institute: ${user.institute || 'Not specified'}
- Time Spent: ${Math.round(((30 * 60) - timeRemaining) / 60)} minutes

Please provide a detailed analysis in JSON format with the following structure:
{
  "headline": "Brief headline about their personality type or career fit",
  "summary": "Comprehensive summary of their personality and career potential",
  "top_capabilities": ["capability1", "capability2", "capability3", "capability4", "capability5"],
  "recommended_path": "Detailed career path recommendation based on their responses",
  "strengths": "Key strengths identified from the assessment",
  "growth_areas": ["area1", "area2", "area3"],
  "suggested_next_steps": ["step1", "step2", "step3", "step4"],
  "confidence": "high"
}

Make the analysis specific to their major (${user.major || 'their field of study'}) and provide actionable insights.`;

      const response = await axios.post(API_ENDPOINTS.AI, {
        prompt: prompt,
        email: user.email
      });

      if (response.data && response.data.response) {
        try {
          let aiResponse = response.data.response;
          
          // Clean up the response if it has markdown formatting
          if (aiResponse.includes('```json')) {
            aiResponse = aiResponse.split('```json')[1].split('```')[0];
          } else if (aiResponse.includes('```')) {
            aiResponse = aiResponse.split('```')[1].split('```')[0];
          }
          
          const reportData = JSON.parse(aiResponse.trim());
          const reportText = JSON.stringify(reportData);
          
          setReport(reportText);
          const parsed = parseEnhancedReport(reportText);
          setParsedReport(parsed);
          setQuizCompleted(true);
        } catch (parseError) {
          console.error("Error parsing AI report:", parseError);
          // Fallback to raw response
          setReport(response.data.response);
          const parsed = parseEnhancedReport(response.data.response);
          setParsedReport(parsed);
          setQuizCompleted(true);
        }
      } else {
        setError("No response received from AI service");
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setError("Failed to submit quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = () => {
    if (!quizQuestions.length) return 0;
    return ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
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
            <h1 className="text-3xl font-bold text-white">
              {quizStarted && !quizCompleted ? "Psychometric Quiz" : "Psychometric Assessment"}
            </h1>
            <p className="text-gray-400 mt-1">
              {quizStarted && !quizCompleted 
                ? `Question ${currentQuestionIndex + 1} of ${quizQuestions.length} • Time: ${formatTime(timeRemaining)}`
                : "Discover your career potential and strengths"
              }
            </p>
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
            {!quizStarted && !parsedReport ? (
              <div className="text-center py-12">
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
                  <div className="w-24 h-24 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">30-Question Psychometric Assessment</h2>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    Take a personalized 30-question assessment based on your profile: {user?.major} at {user?.institute}. 
                    Get insights about your personality, career preferences, and growth opportunities.
                  </p>
                  
                  {/* Assessment Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-blue-900 p-4 rounded-lg">
                      <div className="text-blue-400 font-semibold">Duration</div>
                      <div className="text-gray-300">30 Minutes</div>
                    </div>
                    <div className="bg-green-900 p-4 rounded-lg">
                      <div className="text-green-400 font-semibold">Questions</div>
                      <div className="text-gray-300">30 Personalized</div>
                    </div>
                    <div className="bg-purple-900 p-4 rounded-lg">
                      <div className="text-purple-400 font-semibold">Analysis</div>
                      <div className="text-gray-300">Detailed Report</div>
                    </div>
                  </div>

                  <button
                    onClick={generateQuiz}
                    disabled={loading}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Generating Your Quiz..." : "Start Psychometric Assessment"}
                  </button>
                  {error && (
                    <div className="mt-4 p-4 bg-red-900 border border-red-800 rounded-lg">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : quizStarted && !quizCompleted ? (
              // Quiz Interface
              <div>
                {/* Quiz Header with Timer */}
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Question {currentQuestionIndex + 1} of {quizQuestions.length}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {getAnsweredCount()} / {quizQuestions.length} answered
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-orange-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                </div>

                {/* Current Question */}
                {quizQuestions[currentQuestionIndex] && (
                  <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
                    <h2 className="text-xl font-bold text-white mb-6">
                      {quizQuestions[currentQuestionIndex].question}
                    </h2>
                    
                    {/* Answer Options */}
                    <div className="space-y-3 mb-8">
                      {quizQuestions[currentQuestionIndex].options?.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(currentQuestionIndex, option)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            answers[currentQuestionIndex] === option
                              ? 'border-blue-500 bg-blue-900 text-blue-100'
                              : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800 text-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              answers[currentQuestionIndex] === option
                                ? 'border-blue-400 bg-blue-400'
                                : 'border-gray-500'
                            }`}>
                              {answers[currentQuestionIndex] === option && (
                                <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                              )}
                            </div>
                            <span>{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between">
                      <button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>

                      {currentQuestionIndex === quizQuestions.length - 1 ? (
                        <button
                          onClick={handleSubmitQuiz}
                          disabled={loading || getAnsweredCount() < quizQuestions.length}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {loading ? "Submitting..." : "Submit Assessment"}
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuestion}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                )}
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
