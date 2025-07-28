import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';

const BOT_AVATAR = (
  <span className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold text-lg shadow">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><rect x="4" y="16" width="16" height="4" rx="2" /></svg>
  </span>
);
const USER_AVATAR = (
  <span className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-black font-bold text-lg shadow">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><rect x="4" y="16" width="16" height="4" rx="2" /></svg>
  </span>
);

export default function MentalHealthChatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm your mental health assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // Only scroll chat window, not the whole page
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const email = localStorage.getItem("userEmail");
      const res = await fetch("http://localhost:5001/mental_health_chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, email }),
      });
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: data.reply || data.error || "No response from AI." },
      ]);
      setLoading(false);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "Sorry, there was an error connecting to the assistant." },
      ]);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f7f9fb] via-[#e0e7ef] to-[#c7d2fe] flex flex-col items-center justify-center relative py-12">
      {/* Decorative abstract shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-100 rounded-full opacity-40 blur-2xl -z-10 animate-fade-in" style={{ filter: 'blur(80px)', top: '-6rem', left: '-6rem' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-2xl -z-10 animate-fade-in" style={{ filter: 'blur(80px)', bottom: '-6rem', right: '-6rem' }} />
      <button
        className="absolute top-8 left-8 text-black text-4xl font-extrabold focus:outline-none bg-transparent p-0 m-0 z-20 hover:text-gray-700 transition-all duration-200"
        onClick={() => navigate("/")}
        aria-label="Back to home"
        style={{ background: 'none', border: 'none', boxShadow: 'none' }}
      >
        &larr;
      </button>
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col items-center p-0 md:p-12 animate-fade-in my-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mt-8 mb-2 text-black"> Sydney </h1>
        <p className="text-gray-500 text-center mb-6 max-w-md">Your confidential AI companion for stress, anxiety, , exam support and exam Planning . Ask anything, anytime . </p>
        <div className="w-full flex-1 flex flex-col bg-[#f7f9fb] rounded-2xl p-4 md:p-6 overflow-y-auto max-h-[50vh] md:max-h-[60vh] border border-gray-100 mb-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex items-end mb-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              {msg.sender === "bot" && BOT_AVATAR}
              <div className={`mx-3 px-5 py-3 rounded-2xl shadow text-base max-w-[70%] ${msg.sender === "bot" ? "bg-black text-white rounded-bl-none" : "bg-white text-black border border-gray-200 rounded-br-none"}`}>
                {msg.sender === "bot"
                  ? <ReactMarkdown components={{p: 'span'}}>{msg.text}</ReactMarkdown>
                  : msg.text}
              </div>
              {msg.sender === "user" && USER_AVATAR}
            </div>
          ))}
          {loading && (
            <div className="flex items-end mb-4 justify-start">
              {BOT_AVATAR}
              <div className="mx-3 px-5 py-3 rounded-2xl shadow text-base max-w-[70%] bg-black text-white rounded-bl-none opacity-70 animate-pulse">
                Typing...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={sendMessage} className="w-full flex items-center gap-3 px-4 pb-8">
          <input
            type="text"
            className="flex-1 px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-base bg-[#f7f9fb] shadow"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-full font-semibold text-base shadow hover:bg-gray-900 transition disabled:opacity-60"
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </form>
      </div>
      <style>{`
        .animate-fade-in {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.7s forwards;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
