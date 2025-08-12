import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from '../config';
import axios from 'axios';

export default function StudyPlan() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [studyPlan, setStudyPlan] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [activeTab, setActiveTab] = useState("today");
  const [loading, setLoading] = useState(false);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [editedPlanContent, setEditedPlanContent] = useState("");
  const [showFullPlan, setShowFullPlan] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS, {
          withCredentials: true
        });
        if (response.data.authenticated && response.data.user) {
          setUserName(response.data.user.name || "User");
          setUserEmail(response.data.user.email);
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Failed to get user info:", error);
        navigate("/login");
      }
    };
    getUserInfo();
  }, [navigate]);

  useEffect(() => {
    if (userEmail) {
      fetchUserData();
    }
  }, [userEmail]);

  // Add sample data if no study plan exists
  useEffect(() => {
    if (!studyPlan && userEmail) {
      const sampleStudyPlan = {
        created_at: new Date().toISOString(),
        goals: "Improve Mathematics and English Grammar",
        current_performance: { "CGPA": "8.5" },
        plan_content: `STUDY PLAN - MATHEMATICS & ENGLISH

This comprehensive study plan focuses on improving Mathematics and English Grammar skills. The Mathematics Enhancement Plan includes daily schedule tasks: morning theory review (6:00-8:00 AM), afternoon practice problems (2:00-4:00 PM), and evening advanced problems (7:00-9:00 PM). Weekly goals include completing 2 chapters per week, solving 50 practice problems daily, and taking weekly assessment tests. Primary resources include NCERT Textbook, RD Sharma for practice, and RS Aggarwal for advanced problems.

The English Grammar Improvement plan features daily grammar study (8:00-9:00 AM), practice exercises (4:00-5:00 PM), and writing practice (9:00-10:00 PM). Weekly goals include learning 5 new grammar rules, completing 30 exercises daily, and writing 2 essays per week. Recommended resources are Wren & Martin High School Grammar, Oxford Practice Grammar, and NCERT English Textbook.

Study techniques include active recall methods, mind mapping for complex topics, practicing with previous year questions, joining study groups for doubt clearing, and maintaining a progress journal. This structured approach ensures systematic improvement in both subjects while maintaining a balanced study routine.`,
        tasks: [
          {
            id: "1",
            title: "Complete Chapter 1 - Number Systems",
            completed: false,
            category: "mathematics"
          },
          {
            id: "2",
            title: "Solve 20 RD Sharma problems",
            completed: false,
            category: "practice"
          },
          {
            id: "3",
            title: "Learn Parts of Speech rules",
            completed: false,
            category: "english"
          },
          {
            id: "4",
            title: "Complete Grammar Exercise 1-10",
            completed: false,
            category: "practice"
          },
          {
            id: "5",
            title: "Write essay on 'My School'",
            completed: false,
            category: "writing"
          },
          {
            id: "6",
            title: "Review theory and concepts (6:00-8:00 AM)",
            completed: false,
            category: "routine"
          },
          {
            id: "7",
            title: "Solve practice problems (2:00-4:00 PM)",
            completed: false,
            category: "routine"
          },
          {
            id: "8",
            title: "Study grammar rules (8:00-9:00 AM)",
            completed: false,
            category: "routine"
          },
          {
            id: "9",
            title: "Create mind map for Number Systems",
            completed: false,
            category: "organization"
          },
          {
            id: "10",
            title: "Join study group for doubt clearing",
            completed: false,
            category: "implementation"
          }
        ]
      };
      
      setStudyPlan(sampleStudyPlan);
      setTasks(sampleStudyPlan.tasks);
    }
  }, [studyPlan, userEmail]);

  const fetchUserData = async () => {
    try {
      // Get study plan and tasks from backend
      const response = await fetch(`${API_ENDPOINTS.STUDY_PLAN}?email=${encodeURIComponent(userEmail)}`);
      const data = await response.json();

      // Set overall percentage
      if (data.overall_percentage !== undefined && data.overall_percentage !== null) {
        setStudyPlan(prev => ({
          ...prev,
          current_performance: { "Overall Percentage": `${data.overall_percentage}%` }
        }));
      }

      // Set study plan content
      if (data.study_plan) {
        setStudyPlan(prev => ({
          ...prev,
          plan_content: data.study_plan
        }));
      }

      // Merge tasks from quiz_results with existing tasks
      if (Array.isArray(data.tasks) && data.tasks.length > 0) {
        setTasks(prevTasks => {
          // Avoid duplicates by id
          const existingIds = new Set(prevTasks.map(t => t.id));
          const newTasks = data.tasks.filter(t => !existingIds.has(t.id));
          return [...prevTasks, ...newTasks];
        });
      }
    } catch (error) {
      console.error("Error fetching study plan data:", error);
    }
  };

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

  const addTask = async () => {
    if (!newTask.trim()) return;

    const task = {
      id: Date.now().toString(),
      title: newTask.trim(),
      completed: false,
      category: "custom",
      created_at: new Date().toISOString()
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    setNewTask("");

    // For now, just update local state without backend
    console.log("Task added locally:", task);
    
    // Update study plan locally
    if (studyPlan) {
      const updatedStudyPlan = {
        ...studyPlan,
        tasks: updatedTasks
      };
      setStudyPlan(updatedStudyPlan);
    }
  };

  const toggleTask = async (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    // For now, just update local state without backend
    console.log("Task toggled locally:", taskId);
    
    // Update study plan locally
    if (studyPlan) {
      const updatedStudyPlan = {
        ...studyPlan,
        tasks: updatedTasks
      };
      setStudyPlan(updatedStudyPlan);
    }
  };

  const deleteTask = async (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);

    // For now, just update local state without backend
    console.log("Task deleted locally:", taskId);
    
    // Update study plan locally
    if (studyPlan) {
      const updatedStudyPlan = {
        ...studyPlan,
        tasks: updatedTasks
      };
      setStudyPlan(updatedStudyPlan);
    }
  };

  const startEditingPlan = () => {
    if (studyPlan && studyPlan.plan_content) {
      setEditedPlanContent(studyPlan.plan_content);
      setIsEditingPlan(true);
    } else {
      alert("No study plan content to edit.");
    }
  };

  const saveEditedPlan = async () => {
    // For now, just update local state without backend
    const updatedStudyPlan = {
      ...studyPlan,
      plan_content: editedPlanContent
    };
    
    console.log("Plan saved locally:", updatedStudyPlan);
    setStudyPlan(updatedStudyPlan);
    setIsEditingPlan(false);
  };

  const cancelEditingPlan = () => {
    setIsEditingPlan(false);
    setEditedPlanContent("");
  };

  const getFilteredTasks = () => {
    switch (activeTab) {
      case "today":
        return tasks.filter(task => !task.completed);
      case "completed":
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };

  const getCurrentPerformance = () => {
    if (!user) return null;
    
    if (user.studentType === "college" && user.cgpa) {
      return { type: "CGPA", value: user.cgpa };
    } else if (user.studentType === "school") {
      if (user.termData && user.termData.length > 0) {
        const validTerms = user.termData.filter(term => term.percentage && term.percentage !== "");
        if (validTerms.length > 0) {
          const avg = validTerms.reduce((sum, term) => sum + parseFloat(term.percentage), 0) / validTerms.length;
          return { type: "Average Percentage", value: avg.toFixed(1) + "%" };
        }
      }
      if (user.subjects && user.subjects.length > 0) {
        const avg = user.subjects.reduce((sum, subject) => sum + subject.marks, 0) / user.subjects.length;
        return { type: "Average Marks", value: avg.toFixed(1) };
      }
    }
    return null;
  };

  const currentPerformance = getCurrentPerformance();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
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
            <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              Dashboard
            </a>
            <a href="/quiz" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Quiz
            </a>
            <a href="/chat" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Chat
            </a>
            <a href="/study-plan" className="flex items-center gap-3 px-3 py-2 bg-gray-100 text-black rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Study Plan
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
          <h1 className="text-2xl font-bold text-gray-900">Study Plan</h1>
          <div className="flex items-center gap-3">
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
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Performance Overview */}
            {currentPerformance && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Academic Performance</h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{currentPerformance.type}</p>
                    <p className="text-2xl font-bold text-gray-900">{currentPerformance.value}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Study Plan Content */}
            {studyPlan ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Your Study Plan</h2>
                  {!isEditingPlan && (
                    <button
                      onClick={startEditingPlan}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Plan
                    </button>
                  )}
                </div>
                <div className="prose max-w-none">
                  {isEditingPlan ? (
                    <textarea
                      className="w-full min-h-[400px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                      value={editedPlanContent}
                      onChange={(e) => setEditedPlanContent(e.target.value)}
                    />
                  ) : (
                    <div className="text-gray-700">
                      <div className={`${!showFullPlan ? 'line-clamp-3' : ''}`}>
                        {studyPlan.plan_content}
                      </div>
                      {studyPlan.plan_content.length > 200 && (
                        <button
                          onClick={() => setShowFullPlan(!showFullPlan)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                        >
                          {showFullPlan ? 'Show Less' : 'View More'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {studyPlan.goals && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Academic Goals</h3>
                    <p className="text-blue-800">{studyPlan.goals}</p>
                  </div>
                )}
                {isEditingPlan && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={saveEditedPlan}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={cancelEditingPlan}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="text-center py-8">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Study Plan Yet</h3>
                  <p className="text-gray-600 mb-4">
                    You haven't created a study plan yet. Visit the Chat page and use the "Academic Planning" feature to create your personalized study plan.
                  </p>
                  <a
                    href="/chat"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Go to Chat
                  </a>
                </div>
              </div>
            )}

            {/* To-Do List */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Study Tasks & Goals
                  </h2>
                </div>
              </div>

              {/* Add New Task */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new study task..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  />
                  <button
                    onClick={addTask}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Task
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: "today", label: "Active Tasks", icon: null },
                    { id: "completed", label: "Completed", icon: null },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-1 ${
                        activeTab === tab.id
                          ? "border-orange-500 text-orange-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab.label}
                      {tab.icon && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tasks List */}
              <div className="p-6">
                {getFilteredTasks().length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {activeTab === "today" ? "No active tasks" : "No completed tasks"}
                    </p>
                    <p className="text-gray-600">
                      {activeTab === "today" 
                        ? "Add a new task above to get started with your study plan." 
                        : "Complete some tasks to see them here."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getFilteredTasks().map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 ${
                          task.completed ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                            task.completed
                              ? "bg-green-500 border-green-500"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {task.completed && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                        <span
                          className={`flex-1 text-sm ${
                            task.completed ? "line-through text-gray-500" : "text-gray-900"
                          }`}
                        >
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            task.category === "analysis" ? "bg-blue-100 text-blue-800" :
                            task.category === "planning" ? "bg-purple-100 text-purple-800" :
                            task.category === "scheduling" ? "bg-green-100 text-green-800" :
                            task.category === "implementation" ? "bg-yellow-100 text-yellow-800" :
                            task.category === "tracking" ? "bg-indigo-100 text-indigo-800" :
                            task.category === "exam-prep" ? "bg-red-100 text-red-800" :
                            task.category === "organization" ? "bg-pink-100 text-pink-800" :
                            task.category === "routine" ? "bg-teal-100 text-teal-800" :
                            task.category === "mathematics" ? "bg-blue-100 text-blue-800" :
                            task.category === "practice" ? "bg-green-100 text-green-800" :
                            task.category === "english" ? "bg-purple-100 text-purple-800" :
                            task.category === "writing" ? "bg-orange-100 text-orange-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {task.category}
                          </span>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
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