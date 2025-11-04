import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from '../../config';
import axios from "axios";
import CollegeSidebarLight from "./sidebar_college_light"; // Import college sidebar

// Message component for user and AI messages
function Message({ text, isUser, animate, showSaveButton, onSave }) {
  const [visibleWords, setVisibleWords] = useState(animate ? 0 : text.split(" ").length);
  const words = text.split(" ");
  const timerRef = useRef();

  useEffect(() => {
    if (!animate) return;
    setVisibleWords(0);
    timerRef.current = setInterval(() => {
      setVisibleWords((v) => {
        if (v < words.length) return v + 1;
        clearInterval(timerRef.current);
        return v;
      });
    }, 100); // Optimal timing for readability
    return () => clearInterval(timerRef.current);
  }, [text, animate, words.length]);

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-gray-200 text-black rounded-lg px-4 py-2 max-w-xs ml-auto font-sans" style={{ fontFamily: "Inter, sans-serif" }}>
          {text}
        </div>
      </div>
    );
  }

  // For bot messages with word-by-word animation
  return (
    <div className="text-black leading-relaxed font-sans" style={{ fontFamily: "Inter, sans-serif" }}>
      {animate ? (
        <div>
          {words.map((word, index) => (
            <span 
              key={index} 
              className="inline opacity-0"
              style={{
                animation: index < visibleWords ? 'fadeInWord 0.4s ease-out forwards' : 'none',
                animationDelay: `${index * 100}ms`
              }}
            >
              {word}{index < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </div>
      ) : (
        formatBotMessage(text)
      )}
      {showSaveButton && visibleWords >= words.length && (
        <div className="mt-4 flex gap-2">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            onClick={() => onSave(text)}
          >
            Yes, Save This Plan
          </button>
        </div>
      )}
    </div>
  );
}

function formatBotMessage(text) {
  // First preserve proper formatting, then remove standalone asterisks
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold formatting
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic formatting
  
  // Remove remaining standalone asterisks that aren't part of formatting
  formatted = formatted.replace(/\*{3,}/g, ''); // Remove 3+ asterisks
  formatted = formatted.replace(/(?<!<[^>]*?)\*(?![^<]*?>)/g, ''); // Remove standalone asterisks not in HTML tags
  
  const lines = formatted.split('\n');
  const mainText = [];
  const bullets = [];
  let inBullets = false;
  
  for (const line of lines) {
    if (line.trim().startsWith('- ')) {
      inBullets = true;
      bullets.push(line.trim().replace(/^- /, ''));
    } else if (line.trim() !== '') {
      if (!inBullets) mainText.push(line);
    }
  }
  
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: mainText.join(' ') }} />
      {bullets.length > 0 && (
        <ul className="list-disc pl-6 mt-2">
          {bullets.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Chat_light() {
  const navigate = useNavigate();

  // Theme toggle handler
  const handleToggleTheme = () => {
    navigate("/mental-health-college-dark");
  };
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showSuggestedPrompts, setShowSuggestedPrompts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showChatPage, setShowChatPage] = useState(false);
  const [fadeOutPrompt, setFadeOutPrompt] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [planSaved, setPlanSaved] = useState(false);
  const messagesEndRef = useRef(null);

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
        navigate("/login");
      }
    };
    getUserInfo();
  }, [navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePromptSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;
    setFadeOutPrompt(true);
    setTimeout(() => {
      setShowSuggestedPrompts(false);
      setShowChatPage(true);
      setFadeOutPrompt(false);
      sendMessage(e);
    }, 400);
  };

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = { sender: "user", text: inputMessage };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      
      // Build conversation context
      const conversationHistory = updatedMessages.map(msg => 
        `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`
      ).join('\n');
      
      const contextualPrompt = `Previous conversation:\n${conversationHistory}\n\nCurrent message: ${inputMessage}`;
      
      const res = await fetch(API_ENDPOINTS.AI, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: contextualPrompt }),
      });

      const data = await res.json();
      const botMessage = { sender: "bot", text: data.response || data.error || "Sorry, I couldn't process that.", isAcademicPlan: false };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = { sender: "bot", text: "Sorry, there was an error processing your request.", isAcademicPlan: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedPrompt = async (prompt) => {
    setShowSuggestedPrompts(false);
    setShowChatPage(true);
    setLoading(true);
    setInputDisabled(true);

    try {
      const token = localStorage.getItem('authToken');
      
      // Build conversation context if there are existing messages
      let contextualPrompt = prompt;
      if (messages.length > 0) {
        const conversationHistory = messages.map(msg => 
          `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`
        ).join('\n');
        contextualPrompt = `Previous conversation:\n${conversationHistory}\n\nNew request: ${prompt}`;
      }
      
      const res = await fetch(API_ENDPOINTS.AI, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: contextualPrompt }),
      });

      const data = await res.json();
      const botMessage = { sender: "bot", text: data.response || data.error || "Sorry, I couldn't process that.", isAcademicPlan: false };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = { sender: "bot", text: "Sorry, there was an error processing your request.", isAcademicPlan: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setInputDisabled(false);
    }
  };

  const handleAcademicPlanningClick = async () => {
    setShowSuggestedPrompts(false);
    setShowChatPage(true);
    setLoading(true);
    setInputDisabled(true);
    try {
      const res = await axios.post(
        "/mental_health_chat",
        { message: "academic planning" },
        { withCredentials: true }
      );
      const reply = res.data.reply;
      setMessages((prev) => [
        ...prev,
        { text: reply, sender: "bot", isAcademicPlan: true }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Could not generate academic plan. Please try again.", sender: "bot", isAcademicPlan: true }
      ]);
    } finally {
      setLoading(false);
      setInputDisabled(false);
    }
  };

  const handleSavePlan = async (planText) => {
    try {
      await axios.post(
        "http://localhost:5001/user/save-academic-plan",
        { email: userEmail, academic_plan: planText },
        { withCredentials: true }
      );
      setPlanSaved(true);
    } catch (error) {
      alert("Could not save your plan. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-white font-sans" style={{ fontFamily: "Inter, sans-serif" }}>
      <CollegeSidebarLight isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="flex-1 flex flex-col">
          {/* Top Header with Theme Toggle */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Assistant</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleToggleTheme}
                className="p-2 rounded-full bg-gray-100 text-black hover:bg-gray-200 transition-colors"
                title="Switch to Dark Mode"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              </button>
            </div>
          </div>
          {showSuggestedPrompts && !showChatPage && (
            <div
              className={`flex-1 flex flex-col items-center justify-center p-6 transition-opacity duration-400 ${fadeOutPrompt ? "opacity-0" : "opacity-100"}`}
              style={{ opacity: fadeOutPrompt ? 0 : 1 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Hi {userName}, how can I help you?</h2>
                <p className="text-lg text-gray-600 mb-8">I'm here to assist you with academic guidance, career planning, and more.</p>
              </div>

              <div className="w-full max-w-2xl mb-8">
                <form onSubmit={handlePromptSend}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ask or find anything from your workspace..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handlePromptSend(e)}
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition"
                      aria-label="Send"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
                <div 
                  className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={() => handleSuggestedPrompt("Based on my college profile, academic performance, projects, internships, and extracurricular activities, analyze my strengths and capabilities. Suggest specific activities, skills to develop, and areas where I can excel. Provide actionable recommendations to refine and enhance my abilities for career growth and professional development.")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">Enhance Your Skills</h3>
                  </div>
                  <p className="text-sm text-gray-600">Get personalized suggestions on skills and activities to excel in based on your college profile and achievements.</p>
                </div>

                <div 
                  className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={() => handleSuggestedPrompt("Based on my current college major, CGPA, projects, and career interests, provide career path recommendations. Suggest specific job roles, companies to target, skills to develop, and steps to take for successful placement. Include guidance on internships, certifications, and networking strategies.")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">Career Guidance</h3>
                  </div>
                  <p className="text-sm text-gray-600">Get personalized career guidance based on your major, interests, and professional goals.</p>
                </div>

                <div 
                  className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={() => handleSuggestedPrompt("I'm feeling stressed about my college workload, placements, and future career. Help me manage this stress and anxiety. Give me consolation and practical strategies for maintaining mental well-being during college. Ask me what specific challenges I'm facing and provide supportive guidance.")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 text-lg">😰</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">Feeling Stressed?</h3>
                  </div>
                  <p className="text-sm text-gray-600">Get support for managing college stress, placement anxiety, and maintaining mental well-being.</p>
                </div>
              </div>
            </div>
          )}

          {showChatPage && (
            <div className="flex-1 flex flex-col animate-fade-in">
              {/* Back Button */}
              <div className="bg-white px-6 py-4 flex items-center">
                <button 
                  onClick={() => {
                    setShowChatPage(false);
                    setShowSuggestedPrompts(true);
                    setMessages([]);
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="font-medium">Back</span>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-0 py-6" style={{ background: "#fff" }}>
                <div className="max-w-2xl mx-auto flex flex-col gap-6">
                  {messages.map((message, index) => (
                    <Message
                      key={index}
                      text={message.text}
                      isUser={message.sender === "user"}
                      animate={message.sender === "bot" && index === messages.length - 1}
                      showSaveButton={
                        message.sender === "bot" &&
                        index === messages.length - 1 &&
                        !planSaved &&
                        message.isAcademicPlan
                      }
                      onSave={handleSavePlan}
                    />
                  ))}
                  {loading && (
                    <Message text="Thinking..." isUser={false} animate={false} />
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="border-t border-gray-200 p-4 bg-white sticky bottom-0 left-0 w-full">
                <div className="max-w-2xl mx-auto">
                  <form onSubmit={sendMessage} className="flex gap-3">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-sans"
                      style={{ fontFamily: "Inter, sans-serif" }}
                      disabled={inputDisabled || loading}
                    />
                    <button
                      type="submit"
                      disabled={inputDisabled || loading || !inputMessage.trim()}
                      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.4s;
          }
          @keyframes fadeIn {
            from { opacity: 0 }
            to { opacity: 1 }
          }
          @keyframes fadeInWord {
            from { 
              opacity: 0;
              transform: translateY(8px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}