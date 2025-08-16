import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from '../config';
import axios from "axios";
import Sidebar from "./sidebar"; // Import the Sidebar component

// Move formatBotText here, and make it return HTML string (not JSX)
function formatBotText(rawText) {
  let formatted = rawText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  formatted = formatted.replace(/\*{3,}/g, '');
  formatted = formatted.replace(/(?<!<[^>]*?)\*(?![^<]*?>)/g, '');

  const lines = formatted.split('\n');
  let html = '';
  let inUl = false;
  let inOl = false;
  let justClosedList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Heading (supports #, ##, ###)
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
      const level = headingMatch[1].length;
      const content = headingMatch[2];
      html += `<h${level} class="font-bold mt-4 mb-2">${content}</h${level}>`;
      justClosedList = false;
      continue;
    }

    // Bullet list (handle lines that are just "-" or "•" and merge with next line)
    if (/^\s*[\-\u2022]\s*$/.test(line) && lines[i + 1] && lines[i + 1].trim() !== '') {
      // Merge this bullet marker with the next line as the content
      if (!inUl) {
        if (inOl) { html += '</ol>'; inOl = false; }
        html += '<ul class="list-disc pl-6 mt-2">';
        inUl = true;
      }
      html += `<li>${lines[i + 1]}</li>`;
      i++; // Skip the next line since we've used it
      justClosedList = false;
      continue;
    }
    // Bullet list (normal case)
    if (/^\s*[\-\u2022]\s+/.test(line)) {
      if (!inUl) {
        if (inOl) { html += '</ol>'; inOl = false; }
        html += '<ul class="list-disc pl-6 mt-2">';
        inUl = true;
      }
      html += `<li>${line.replace(/^\s*[\-\u2022]\s+/, '')}</li>`;
      justClosedList = false;
      continue;
    }
    // Numbered list (handle lines that are just "1." and merge with next line)
    if (/^\s*\d+\.\s*$/.test(line) && lines[i + 1] && lines[i + 1].trim() !== '') {
      if (!inOl) {
        if (inUl) { html += '</ul>'; inUl = false; }
        html += '<ol class="list-decimal pl-6 mt-2">';
        inOl = true;
      }
      html += `<li>${lines[i + 1]}</li>`;
      i++;
      justClosedList = false;
      continue;
    }
    // Numbered list (normal case)
    if (/^\s*\d+\.\s+/.test(line)) {
      if (!inOl) {
        if (inUl) { html += '</ul>'; inUl = false; }
        html += '<ol class="list-decimal pl-6 mt-2">';
        inOl = true;
      }
      html += `<li>${line.replace(/^\s*\d+\.\s+/, '')}</li>`;
      justClosedList = false;
      continue;
    }
    // Normal text
    if (line.trim() !== '') {
      if (inUl) { html += '</ul>'; inUl = false; justClosedList = true; }
      if (inOl) { html += '</ol>'; inOl = false; justClosedList = true; }
      html += `<div>${line}</div>`;
      justClosedList = false;
      continue;
    }
    // Empty line
    if (inUl) { html += '</ul>'; inUl = false; justClosedList = true; }
    if (inOl) { html += '</ol>'; inOl = false; justClosedList = true; }
    // Only add <br/> if previous line was not empty and not just after closing a list
    if (!justClosedList && i > 0 && lines[i - 1].trim() !== '') {
      html += '<br/>';
    }
    justClosedList = false;
  }
  if (inUl) html += '</ul>';
  if (inOl) html += '</ol>';
  return html;
}

// Helper to split HTML into tokens (tags, words, and <br/>)
function splitHtmlToTokens(html) {
  const regex = /(<br\s*\/?>|<[^>]+>|[^<>\s]+|\s+)/g;
  return html.match(regex) || [];
}

// Message component for user and AI messages
function Message({ text, isUser, animate, showSaveButton, onSave }) {
  const formattedHtml = !isUser ? formatBotText(text) : text;
  const tokens = !isUser ? splitHtmlToTokens(formattedHtml) : [text];
  const [visibleTokens, setVisibleTokens] = useState(animate ? 0 : tokens.length);
  const timerRef = useRef();

  useEffect(() => {
    if (!animate) return;
    setVisibleTokens(0);
    timerRef.current = setInterval(() => {
      setVisibleTokens((v) => {
        if (v < tokens.length) return v + 1;
        clearInterval(timerRef.current);
        return v;
      });
    }, 40);
    return () => clearInterval(timerRef.current);
  }, [text, animate, tokens.length]);

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-gray-200 text-black rounded-lg px-4 py-2 max-w-xs ml-auto font-sans" style={{ fontFamily: "Inter, sans-serif" }}>
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="text-black leading-relaxed font-sans" style={{ fontFamily: "Inter, sans-serif" }}>
      {animate ? (
        <span>
          {tokens.slice(0, visibleTokens).map((token, idx) => {
            if (token.match(/^<br\s*\/?>$/)) {
              return <br key={idx} />;
            } else if (token.match(/^<[^>]+>$/)) {
              return <span key={idx} dangerouslySetInnerHTML={{ __html: token }} />;
            } else {
              return (
                <span
                  key={idx}
                  className="inline opacity-0"
                  style={{
                    animation: 'fadeInWord 0.4s ease-out forwards',
                    animationDelay: `0ms`
                  }}
                >
                  {token}
                </span>
              );
            }
          })}
        </span>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: formattedHtml }} />
      )}
      {showSaveButton && visibleTokens >= tokens.length && (
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

export default function MentalHealthSI() {
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
      const botMessage = { 
        sender: "bot", 
        text: data.response || data.error || "Sorry, I couldn't process that.", 
        isAcademicPlan: false 
      };
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
      const botMessage = { 
        sender: "bot", 
        text: data.response || data.error || "Sorry, I couldn't process that.", 
        isAcademicPlan: false 
      };
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
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="flex-1 flex flex-col">
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
                  onClick={() => handleSuggestedPrompt("Based on my profile, academic performance, projects, certifications, and extracurricular activities, analyze my strengths and capabilities. Suggest specific activities, skills to develop, and areas where I can excel. Provide actionable recommendations to refine and enhance my abilities for personal and professional growth.")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">Refine Your Capabilities</h3>
                  </div>
                  <p className="text-sm text-gray-600">Get personalized suggestions on activities and skills you'll excel at based on your profile and achievements.</p>
                </div>

                <div 
                  className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={() => handleSuggestedPrompt("Based on my current academic level and grade, provide career path recommendations. If I'm below 10th grade, suggest whether I should choose Science, Commerce, or Arts stream you have to specifically choose 1 out of the three for me. If I'm in 11th/12th grade, first ask about my current stream (Science/Commerce/Arts) and then recommend specific career options, colleges, and future prospects aligned with my interests and academic performance.")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">Career Path Recommendations</h3>
                  </div>
                  <p className="text-sm text-gray-600">Get personalized career guidance based on your grade level, stream, and academic performance.</p>
                </div>

                <div 
                  className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={() => handleSuggestedPrompt("I'm feeling anxious . Help me manage this stress and anxiety.give me consolation . Provide practical strategies for maintaining mental well-being and building confidence. ask me what is wrong with my life and try to help me in less than 100 words and give constant formating and dont use * or ** for formatting")}
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

          {showChatPage && (
            <div className="flex-1 flex flex-col animate-fade-in">
              {/* Back Button */}
              <div className="sticky top-0 z-10 bg-white px-6 py-4 flex items-center">
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
