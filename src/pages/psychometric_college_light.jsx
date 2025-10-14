import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CollegeSidebarLight from "./sidebar_college_light";
import { ChevronLeft, ChevronRight, Clock, User, BookOpen, Target, Brain, CheckCircle, AlertCircle } from "lucide-react";

export default function PsychometricCollegeLight() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes
  const navigate = useNavigate();

  // Theme toggle handler
  const handleToggleTheme = () => {
    navigate("/psychometric-college-dark");
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

  // Timer effect
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
      const response = await axios.post(API_ENDPOINTS.GENERATE_PSYCHOMETRIC_QUIZ, {
        email: user.email,
        userProfile: {
          name: user.name,
          major: user.major,
          year: user.year,
          institute: user.institute,
          interests: user.interests || [],
          skills: user.skills || [],
          careerGoals: user.careerGoals || ""
        }
      });

      if (response.data.success) {
        setQuizData(response.data.quiz);
        setQuizStarted(true);
        setTimeRemaining(30 * 60); // Reset timer
      } else {
        setError(response.data.message || "Failed to generate quiz");
      }
    } catch (err) {
      console.error("Error generating quiz:", err);
      setError("Failed to generate personalized quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
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
      const response = await axios.post(API_ENDPOINTS.SUBMIT_PSYCHOMETRIC_QUIZ, {
        email: user.email,
        quizId: quizData.quizId,
        answers: answers,
        timeSpent: (30 * 60) - timeRemaining
      });

      if (response.data.success) {
        setResults(response.data.results);
        setQuizCompleted(true);
      } else {
        setError(response.data.message || "Failed to submit quiz");
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setError("Failed to submit quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = () => {
    if (!quizData) return 0;
    return ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  if (!quizStarted) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <CollegeSidebarLight isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Psychometric Assessment</h1>
                  <p className="text-sm text-gray-600">Personalized career and personality analysis</p>
                </div>
              </div>
              <button
                onClick={handleToggleTheme}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Dark Mode
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              {/* Welcome Section */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Brain className="w-10 h-10 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Welcome to Your Personalized Assessment
                  </h2>
                  <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    This assessment is tailored specifically for you based on your profile: {user?.major} student at {user?.institute}. 
                    Get insights into your personality, career preferences, and growth opportunities.
                  </p>
                </div>

                {/* Assessment Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900">Duration</h3>
                    <p className="text-gray-600">30 Minutes</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900">Questions</h3>
                    <p className="text-gray-600">30 Personalized</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900">Analysis</h3>
                    <p className="text-gray-600">Comprehensive Report</p>
                  </div>
                </div>

                {/* User Profile Preview */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Your Profile
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium">Name:</span> {user?.name}</div>
                    <div><span className="font-medium">Major:</span> {user?.major}</div>
                    <div><span className="font-medium">Year:</span> {user?.year}</div>
                    <div><span className="font-medium">Institute:</span> {user?.institute}</div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3">Instructions</h3>
                  <ul className="space-y-2 text-yellow-700">
                    <li>• Answer all questions honestly for the most accurate results</li>
                    <li>• You have 30 minutes to complete the assessment</li>
                    <li>• You can navigate between questions using the navigation buttons</li>
                    <li>• Your progress is automatically saved</li>
                    <li>• Once submitted, you cannot change your answers</li>
                  </ul>
                </div>

                {/* Start Button */}
                <div className="text-center">
                  <button
                    onClick={generateQuiz}
                    disabled={loading}
                    className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
                  >
                    {loading ? "Generating Your Personalized Quiz..." : "Start Assessment"}
                  </button>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="w-5 h-5" />
                      <span>{error}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted && results) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <CollegeSidebarLight isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Assessment Complete</h1>
                  <p className="text-sm text-gray-600">Your personalized results are ready</p>
                </div>
              </div>
              <button
                onClick={handleToggleTheme}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Dark Mode
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete!</h2>
                  <p className="text-gray-600">Your personalized psychometric analysis is ready</p>
                </div>

                {/* Results Display */}
                <div className="space-y-6">
                  {results.personalityType && (
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-blue-900 mb-3">Personality Type</h3>
                      <p className="text-blue-800 text-lg font-medium">{results.personalityType}</p>
                      <p className="text-blue-700 mt-2">{results.personalityDescription}</p>
                    </div>
                  )}

                  {results.careerRecommendations && (
                    <div className="bg-green-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-green-900 mb-3">Career Recommendations</h3>
                      <div className="space-y-2">
                        {results.careerRecommendations.map((career, index) => (
                          <div key={index} className="flex items-center gap-2 text-green-800">
                            <Target className="w-4 h-4" />
                            <span>{career}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.strengths && (
                    <div className="bg-purple-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-purple-900 mb-3">Key Strengths</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {results.strengths.map((strength, index) => (
                          <div key={index} className="flex items-center gap-2 text-purple-800">
                            <CheckCircle className="w-4 h-4" />
                            <span>{strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.developmentAreas && (
                    <div className="bg-yellow-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-yellow-900 mb-3">Development Areas</h3>
                      <div className="space-y-2">
                        {results.developmentAreas.map((area, index) => (
                          <div key={index} className="flex items-center gap-2 text-yellow-800">
                            <Target className="w-4 h-4" />
                            <span>{area}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Take Assessment Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz in progress
  const currentQuestion = quizData?.questions[currentQuestionIndex];
  const progress = getProgressPercentage();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CollegeSidebarLight isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header with Timer */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">Psychometric Assessment</h1>
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {quizData?.questions.length}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-orange-600">
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
              </div>
              <button
                onClick={handleToggleTheme}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Dark Mode
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{getAnsweredCount()} / {quizData?.questions.length} answered</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              {currentQuestion && (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {currentQuestion.question}
                    </h2>
                    {currentQuestion.description && (
                      <p className="text-gray-600 mb-6">{currentQuestion.description}</p>
                    )}
                  </div>

                  {/* Answer Options */}
                  <div className="space-y-3 mb-8">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(currentQuestion.id, option.value)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          answers[currentQuestion.id] === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-900'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            answers[currentQuestion.id] === option.value
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {answers[currentQuestion.id] === option.value && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                          <span className="font-medium">{option.text}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between">
                    <button
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    {currentQuestionIndex === quizData.questions.length - 1 ? (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={loading || getAnsweredCount() < quizData.questions.length}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? "Submitting..." : "Submit Assessment"}
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        disabled={currentQuestionIndex === quizData.questions.length - 1}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
