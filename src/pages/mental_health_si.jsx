import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import { API_ENDPOINTS } from '../config';
import axios from 'axios';
import QuizModal from '../components/QuizModal';

const BOT_AVATAR = (
  <span className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold text-sm shadow">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><rect x="4" y="16" width="16" height="4" rx="2" /></svg>
  </span>
);
const USER_AVATAR = (
  <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-black font-bold text-sm shadow">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><rect x="4" y="16" width="16" height="4" rx="2" /></svg>
  </span>
);

export default function MentalHealthChatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm Octane, your AI academic counselor. I'm here to help you with career guidance, academic planning, and personalized learning strategies. How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [showSuggestedPrompts, setShowSuggestedPrompts] = useState(true);
  const [fadeInMessage, setFadeInMessage] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // Get user info from auth status
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS, {
          withCredentials: true
        });
        if (response.data.authenticated && response.data.user) {
          setUserEmail(response.data.user.email);
          setUserName(response.data.user.name || "User");
        }
      } catch (error) {
        console.error("Failed to get user info:", error);
      }
    };
    getUserInfo();
  }, []);

  // Only scroll chat window, not the whole page
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Hide suggested prompts with fade animation
    setShowSuggestedPrompts(false);
    
    const userMsg = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.MENTAL_HEALTH_CHAT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      
      // Add fade animation for new message
      setFadeInMessage(true);
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: data.reply || data.error || "No response from AI." },
      ]);
      
      // Reset fade animation after a short delay
      setTimeout(() => {
        setFadeInMessage(false);
      }, 500);
      
      setLoading(false);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "Sorry, there was an error connecting to the assistant." },
      ]);
      setLoading(false);
    }
  };

  const handleSuggestedPrompt = (prompt) => {
    if (prompt.isQuiz) {
      setShowQuizModal(true);
    } else {
      setInput(prompt.query);
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

  const handleQuizComplete = ({ conclusion, recommendations }) => {
    // Add a message to the chat about the quiz completion
    const quizMessage = `I've completed the career assessment quiz! Here's what I discovered about myself:\n\n**Personality Summary:**\n${conclusion}\n\n**Career Recommendations:**\n${recommendations}\n\nCan you help me explore these career paths further?`;
    
    setMessages(prev => [...prev, { sender: "user", text: quizMessage }]);
    setShowQuizModal(false);
  };

  const suggestedPrompts = [
    {
      title: "Career Assessment Quiz",
      query: "Take our comprehensive career assessment quiz to discover your strengths and get personalized recommendations.",
      icon: "📋",
      color: "bg-purple-100 text-purple-600",
      isQuiz: true
    },
    {
      title: "Academic Planning",
      query: "I need help planning my academic journey and choosing the right subjects/courses.",
      icon: "📚",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Career Exploration",
      query: "I'm confused about my career path. Can you help me explore different options?",
      icon: "🎯",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Study Strategies",
      query: "I want to improve my study habits and academic performance. What strategies would work best for me?",
      icon: "🧠",
      color: "bg-yellow-100 text-yellow-600"
    }
  ];

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
            <a href="/chat" className="flex items-center gap-3 px-3 py-2 bg-gray-100 text-black rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Chat
            </a>
          </div>

          <div className="mt-8 space-y-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Settings & Help</div>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help
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
          <h1 className="text-2xl font-bold text-gray-900">Academic Counselor</h1>
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

        {/* Chat Content */}
        <div className="flex-1 flex flex-col">
          {/* Initial State - Chatbot Name and Greeting */}
          {showSuggestedPrompts && (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Octane</h2>
                <p className="text-gray-600 text-lg max-w-2xl">
                  Hello! I'm your AI academic counselor. I'm here to help you with career guidance, academic planning, and personalized learning strategies.
                </p>
              </div>
              
              {/* Suggested Prompts in Center */}
              <div className="max-w-4xl w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {suggestedPrompts.map((prompt, index) => (
                    <div 
                      key={index}
                      className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow duration-150"
                      onClick={() => handleSuggestedPrompt(prompt)}
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-3 ${prompt.color}`}>
                        {prompt.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{prompt.title}</h3>
                      <p className="text-sm text-gray-600">{prompt.query}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages - Only show when conversation starts */}
          {!showSuggestedPrompts && (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="max-w-4xl mx-auto">
                {messages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`mb-6 ${msg.sender === "user" ? "flex justify-end" : "flex justify-start"} ${
                      idx === messages.length - 1 && fadeInMessage ? "animate-fade-in" : ""
                    }`}
                  >
                    <div className={`flex items-start gap-3 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                      {msg.sender === "bot" && BOT_AVATAR}
                      <div className={`px-4 py-3 rounded-lg text-sm ${
                        msg.sender === "bot" 
                          ? "bg-gray-100 text-gray-900" 
                          : "bg-black text-white"
                      }`}>
                        {msg.sender === "bot"
                          ? <ReactMarkdown components={{p: 'span'}}>{msg.text}</ReactMarkdown>
                          : msg.text}
                      </div>
                      {msg.sender === "user" && USER_AVATAR}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start mb-6 animate-fade-in">
                    <div className="flex items-start gap-3">
                      {BOT_AVATAR}
                      <div className="px-4 py-3 rounded-lg text-sm bg-gray-100 text-gray-900">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={sendMessage} className="flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none bg-white text-gray-900"
                    rows={1}
                    maxLength={3000}
                    disabled={loading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(e);
                      }
                    }}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="p-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
              <div className="text-center mt-2">
                <p className="text-xs text-gray-500">Chatbot can make mistakes. Check important info.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>

      {/* Quiz Modal */}
      <QuizModal 
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        onQuizComplete={handleQuizComplete}
      />
    </div>
  );
}
