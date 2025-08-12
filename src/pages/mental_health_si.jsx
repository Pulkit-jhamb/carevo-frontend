import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from '../config';
import axios from "axios";
import Sidebar from "./sidebar"; // Import the Sidebar component
// import QuizModal from '../components/QuizModal';

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

  // For bot messages, format plan/bullets
  return (
    <div className="text-black leading-relaxed font-sans" style={{ fontFamily: "Inter, sans-serif" }}>
      {formatBotMessage(text)}
      {showSaveButton && (
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
  // Replace Markdown bold (**HEADING**) with <strong>
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Split into lines
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
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
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
  const [isCollapsed, setIsCollapsed] = useState(false); // State for sidebar collapse
  // const [showQuizModal, setShowQuizModal] = useState(false);
  const [showChatPage, setShowChatPage] = useState(false); // NEW: controls which page is shown
  const [fadeOutPrompt, setFadeOutPrompt] = useState(false); // NEW: for fade animation
  const [inputDisabled, setInputDisabled] = useState(false); // NEW: controls input field
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

  // Replace handleSuggestedPrompt for Career Exploration to navigate to quiz
  const handleSuggestedPrompt = (prompt) => {
    if (prompt.includes("career exploration quiz")) {
      navigate("/quiz");
      return;
    }
    if (prompt.includes("academic journey")) {
      // Do nothing here, handled directly in the button
      return;
    }
    setInputMessage(prompt);
    setShowSuggestedPrompts(false);
    setShowChatPage(true);
  };

  const handleAcademicPlanningClick = async () => {
    setShowSuggestedPrompts(false);
    setShowChatPage(true);
    setLoading(true);
    setInputDisabled(true); // Disable input while loading plan
    try {
      const res = await axios.post(
        "/mental_health_chat",
        { message: "academic planning" },
        { withCredentials: true }
      );
      const reply = res.data.reply;
      setMessages((prev) => [...prev, { text: reply, sender: "bot" }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Could not generate academic plan. Please try again.", sender: "bot" }
      ]);
    } finally {
      setLoading(false);
      setInputDisabled(false); // Enable input after plan is shown
    }
  };

  // Save plan to backend
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
      {/* Use the imported Sidebar component */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
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
                  onClick={handleAcademicPlanningClick}
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
                      showSaveButton={message.sender === "bot" && index === messages.length - 1 && !planSaved}
                      onSave={handleSavePlan}
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
      {/* Quiz Modal */}
      {/* <QuizModal isOpen={showQuizModal} onClose={() => setShowQuizModal(false)} /> */}

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