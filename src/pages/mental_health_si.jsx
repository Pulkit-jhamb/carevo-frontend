import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from '../config';
import axios from "axios";
import QuizModal from '../components/QuizModal';

// Message component for user and AI messages
function Message({ text, isUser, animate }) {
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
    }, 50);
    return () => clearInterval(timerRef.current);
  }, [text, animate]);

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-gray-200 text-black rounded-lg px-4 py-2 max-w-xs ml-auto font-sans" style={{ fontFamily: "Inter, sans-serif" }}>
          {text}
        </div>
      </div>
    );
  }

  // AI message with animation, plain left-aligned text
  return (
    <div className="text-black leading-relaxed font-sans" style={{ fontFamily: "Inter, sans-serif" }}>
      {words.map((word, idx) => (
        <span
          key={idx}
          className={`inline-block transition-opacity duration-300 ${idx < visibleWords ? "opacity-100" : "opacity-0"}`}
          style={{ marginRight: "0.25em" }}
        >
          {word}
        </span>
      ))}
    </div>
  );
}

export default function MentalHealthSI() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showSuggestedPrompts, setShowSuggestedPrompts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showChatPage, setShowChatPage] = useState(false); // NEW: controls which page is shown
  const [fadeOutPrompt, setFadeOutPrompt] = useState(false); // NEW: for fade animation
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // When user sends a message from prompt page, fade out and show chat page
  const handlePromptSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;
    setFadeOutPrompt(true);
    setTimeout(() => {
      setShowSuggestedPrompts(false);
      setShowChatPage(true);
      setFadeOutPrompt(false);
      sendMessage(e);
    }, 400); // 400ms fade duration
  };

  // Normal chat send
  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = { sender: "user", text: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.AI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputMessage }),
      });

      const data = await res.json();
      const botMessage = { sender: "bot", text: data.response || data.error || "Sorry, I couldn't process that." };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = { sender: "bot", text: "Sorry, there was an error processing your request." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedPrompt = (prompt) => {
    setInputMessage(prompt);
    setShowSuggestedPrompts(false);
    setShowChatPage(true);
  };

  return (
    <div className="flex h-screen bg-white font-sans" style={{ fontFamily: "Inter, sans-serif" }}>
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
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Logout Button - Top Right */}
        <div className="absolute top-4 right-4 z-10">
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

        {/* Chat Content */}
        <div className="flex-1 flex flex-col">
          {/* Prompt Page */}
          {showSuggestedPrompts && !showChatPage && (
            <div
              className={`flex-1 flex flex-col items-center justify-center p-6 transition-opacity duration-400 ${fadeOutPrompt ? "opacity-0" : "opacity-100"}`}
              style={{ opacity: fadeOutPrompt ? 0 : 1 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Hi {userName}, how can I help you?</h2>
                <p className="text-lg text-gray-600 mb-8">I'm here to assist you with academic guidance, career planning, and more.</p>
              </div>

              {/* Search Bar */}
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
                      {/* Send icon */}
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-8">
                <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Ask
                </button>
                <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Research
                </button>
                <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Build
                </button>
              </div>

              {/* Suggested Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
                <div 
                  className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={() => handleSuggestedPrompt("I want to take a career exploration quiz to understand my strengths and interests better.")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">Career Exploration</h3>
                  </div>
                  <p className="text-sm text-gray-600">Take our comprehensive career quiz to discover your strengths, interests, and potential career paths.</p>
                </div>

                <div 
                  className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={() => handleSuggestedPrompt("I need help planning my academic journey and creating a study plan.")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">Academic Planning</h3>
                  </div>
                  <p className="text-sm text-gray-600">Get personalized guidance for your academic journey and create effective study plans.</p>
                </div>

                <div 
                  className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={() => handleSuggestedPrompt("I'm feeling anxious about my studies and need help managing stress.")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 text-lg">😰</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">Feeling Anxious?</h3>
                  </div>
                  <p className="text-sm text-gray-600">Get support for managing academic stress, anxiety, and maintaining mental well-being.</p>
                </div>
              </div>
            </div>
          )}

          {/* Chat Page */}
          {showChatPage && (
            <div className="flex-1 flex flex-col animate-fade-in">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-0 py-6" style={{ background: "#fff" }}>
                <div className="max-w-2xl mx-auto flex flex-col gap-6">
                  {messages.map((message, index) => (
                    <Message
                      key={index}
                      text={message.text}
                      isUser={message.sender === "user"}
                      animate={message.sender === "bot" && index === messages.length - 1}
                    />
                  ))}
                  {loading && (
                    <Message text="Thinking..." isUser={false} animate={false} />
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input - fixed at bottom */}
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
                    />
                    <button
                      type="submit"
                      disabled={loading || !inputMessage.trim()}
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
      {/* Quiz Modal */}
      <QuizModal isOpen={showQuizModal} onClose={() => setShowQuizModal(false)} />

      {/* Fade-in animation for chat page */}
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.4s;
          }
          @keyframes fadeIn {
            from { opacity: 0 }
            to { opacity: 1 }
          }
        `}
      </style>
    </div>
  );
}