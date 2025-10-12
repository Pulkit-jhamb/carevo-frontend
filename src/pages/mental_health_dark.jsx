import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from '../config';
import axios from "axios";
import Sidebar from "./sidebar_dark"; // Import dark sidebar

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
    }, 100);
    return () => clearInterval(timerRef.current);
  }, [text, animate, words.length]);

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-gray-700 text-white rounded-lg px-4 py-2 max-w-xs ml-auto font-sans" style={{ fontFamily: "Inter, sans-serif" }}>
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="text-white leading-relaxed font-sans" style={{ fontFamily: "Inter, sans-serif" }}>
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
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  formatted = formatted.replace(/\*{3,}/g, '');
  formatted = formatted.replace(/(?<!<[^>]*?)\*(?![^<]*?>)/g, '');
  
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

export default function MentalHealthSIDark() {
  const navigate = useNavigate();
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

  const handleToggleTheme = () => {
    navigate("/chat"); // Navigate back to light mode
  };

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
    <div className="flex h-screen bg-black font-sans" style={{ fontFamily: "Inter, sans-serif" }}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="flex-1 flex flex-col">
          {/* Top Header with Theme Toggle */}
          <div className="bg-black border-b border-gray-700 px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">AI Assistant</h1>
            </div>
            <div className="flex items-center gap-4">
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
          </div>

          {showSuggestedPrompts && !showChatPage && (
            <div
              className={`flex-1 flex flex-col items-center justify-center p-6 transition-opacity duration-400 ${fadeOutPrompt ? "opacity-0" : "opacity-100"}`}
              style={{ opacity: fadeOutPrompt ? 0 : 1 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-4">Hi {userName}, how can I help you?</h2>
                <p className="text-lg text-gray-400 mb-8">I'm here to assist you with academic guidance, career planning, and more.</p>
              </div>

              <div className="w-full max-w-2xl mb-8">
                <form onSubmit={handlePromptSend}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ask or find anything from your workspace..."
                      className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handlePromptSend(e)}
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center bg-gray-700 rounded-full p-2 hover:bg-gray-600 transition"
                      aria-label="Send"
                    >
                      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
                <div 
                  className="bg-gray-900 rounded-lg border border-gray-700 p-6 cursor-pointer hover:border-gray-600 transition-colors"
                  onClick={() => handleSuggestedPrompt("Based on my profile, academic performance, projects, certifications, and extracurricular activities, analyze my strengths and capabilities. Suggest specific activities, skills to develop, and areas where I can excel. Provide actionable recommendations to refine and enhance my abilities for personal and professional growth.")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-white">Refine Your Capabilities</h3>
                  </div>
                  <p className="text-sm text-gray-400">Get personalized suggestions on activities and skills you'll excel at based on your profile and achievements.</p>
                </div>

                <div 
                  className="bg-gray-900 rounded-lg border border-gray-700 p-6 cursor-pointer hover:border-gray-600 transition-colors"
                  onClick={() => handleSuggestedPrompt("Based on my current academic level and grade, provide career path recommendations. If I'm below 10th grade, suggest whether I should choose Science, Commerce, or Arts stream you have to specifically choose 1 out of the three for me. If I'm in 11th/12th grade, first ask about my current stream (Science/Commerce/Arts) and then recommend specific career options, colleges, and future prospects aligned with my interests and academic performance.")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-900 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-white">Career Path Recommendations</h3>
                  </div>
                  <p className="text-sm text-gray-400">Get personalized career guidance based on your grade level, stream, and academic performance.</p>
                </div>

                <div 
                  className="bg-gray-900 rounded-lg border border-gray-700 p-6 cursor-pointer hover:border-gray-600 transition-colors"
                  onClick={() => handleSuggestedPrompt("I'm feeling anxious. Help me manage this stress and anxiety. Give me consolation. Provide practical strategies for maintaining mental well-being and building confidence. Ask me what is wrong with my life and try to help me in less than 100 words and give constant formatting and dont use * or ** for formatting")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-900 rounded-lg flex items-center justify-center">
                      <span className="text-purple-400 text-lg">😰</span>
                    </div>
                    <h3 className="font-semibold text-white">Feeling Anxious?</h3>
                  </div>
                  <p className="text-sm text-gray-400">Get support for managing academic stress, anxiety, and maintaining mental well-being.</p>
                </div>
              </div>
            </div>
          )}

          {showChatPage && (
            <div className="flex-1 flex flex-col animate-fade-in">
              <div className="bg-black px-6 py-4 flex items-center border-b border-gray-700">
                <button 
                  onClick={() => {
                    setShowChatPage(false);
                    setShowSuggestedPrompts(true);
                    setMessages([]);
                  }}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="font-medium">Back</span>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-0 py-6 bg-black">
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

              <div className="border-t border-gray-700 p-4 bg-black sticky bottom-0 left-0 w-full">
                <div className="max-w-2xl mx-auto">
                  <form onSubmit={sendMessage} className="flex gap-3">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400 font-sans"
                      style={{ fontFamily: "Inter, sans-serif" }}
                      disabled={inputDisabled || loading}
                    />
                    <button
                      type="submit"
                      disabled={inputDisabled || loading || !inputMessage.trim()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
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