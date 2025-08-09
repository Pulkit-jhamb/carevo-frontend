import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import Sidebar from './sidebar';


const quizSections = [
 {
   title: 'Personality & Work-Style',
   questions: [
     {
       q: 'When working in a group, I prefer to:',
       options: [
         'Lead and direct the discussion',
         'Listen and support others',
         'Focus on tasks quietly',
         'Explore different ideas and possibilities',
       ],
     },
     {
       q: 'I’m energized by (choose one):',
       options: [
         'Having clear, structured tasks',
         'A flexible, open-ended schedule',
         'Joining social events/classes',
         'Time alone to reflect or learn',
       ],
     },
     {
       q: 'On a typical day, I feel:',
       options: [
         'Very organized and on schedule',
         'Somewhat organized, but okay with flexibility',
         'Chilled and go-with-the-flow',
         'A bit scattered, lots of thoughts',
       ],
     },
     {
       q: 'I make decisions when:',
       options: [
         'I rely on established rules or data',
         'I trust my gut feelings',
         'I ask others for their viewpoints',
         'I explore all options thoroughly',
       ],
     },
   ],
 },
 {
   title: 'Interests & Motivations (RIASEC-Based)',
   questions: [
     {
       q: 'Which task fits you best?',
       options: [
         'Designing a creative project',
         'Solving logic puzzles',
         'Helping a friend with a problem',
         'Organizing an event or group',
       ],
     },
     {
       q: 'In free time, I enjoy more:',
       options: [
         'Crafting/art/music',
         'Reading non-fiction or research',
         'Playing team sports or socializing',
         'Building things or fixing gadgets',
       ],
     },
     {
       q: 'I’m most interested in:',
       options: [
         'Artistic expression',
         'Scientific or technical explanations',
         'Teaching or mentoring others',
         'Selling ideas or organizing events',
       ],
     },
   ],
 },
 {
   title: 'Strengths & Preferences',
   questions: [
     {
       q: 'I’m known for being:',
       options: [
         'Dependable and precise',
         'Creative and curious',
         'Caring and supportive',
         'Driven and goal-oriented',
       ],
     },
     {
       q: 'What drains me the most?',
       options: [
         'Unstructured chaos or constant socializing',
         'Repetitive routines',
         'Tasks without personal meaning',
         'Lack of challenges or growth',
       ],
     },
     {
       q: 'I enjoy tasks where I can:',
       options: [
         'Analyse patterns and data',
         'Use imagination and innovation',
         'Support others emotionally',
         'Achieve and see measurable progress',
       ],
     },
   ],
 },
 {
   title: 'Work Approach & Psychology',
   questions: [
     {
       q: 'When facing a difficult task, I:',
       options: [
         'Break it into small, regular steps',
         'Tackle the most interesting parts first',
         'Ask for help or collaborate',
         'Push myself through until it’s done',
       ],
     },
     {
       q: 'Under pressure, I typically:',
       options: [
         'Stay calm and find solutions',
         'Overthink possibilities',
         'Seek reassurance from others',
         'Focus and get results',
       ],
     },
     {
       q: 'I learn best through:',
       options: [
         'Practical hands-on experience',
         'Books, lectures, research',
         'Discussion and reflection',
         'Teaching others or leading groups',
       ],
     },
   ],
 },
 {
   title: 'Values & Personality Traits',
   questions: [
     {
       q: 'I value at work:',
       options: [
         'Accuracy and high quality',
         'Creativity and novelty',
         'Connection and helping others',
         'Recognition and achievement',
       ],
     },
     {
       q: 'When solving problems, I rely on:',
       options: [
         'Step-by-step plans',
         'Insight and creativity',
         'People’s feelings and needs',
         'Efficiency and bold action',
       ],
     },
     {
       q: 'About feedback, I’m:',
       options: [
         'Highly sensitive to criticism',
         'Motivated by clear standards',
         'Uncomfortable with competition',
         'Driven by public acknowledgment',
       ],
     },
   ],
 },
 {
   title: 'Academics & Learning Habits',
   questions: [
     {
       q: 'My strongest subject is:',
       options: [
         'Math, logic, sciences',
         'Writing, literature, arts',
         'Social sciences, psychology',
         'Business studies, economics',
       ],
     },
     {
       q: 'In a project, I prefer to:',
       options: [
         'Explore new ideas and options',
         'Stick to a clear, reliable method',
         'Ensure the group is cohesive',
         'Push for results and progress',
       ],
     },
     {
       q: 'I’m motivated by:',
       options: [
         'Solving interesting problems',
         'Expressing myself creatively',
         'Caring for others',
         'Setting and achieving clear goals',
       ],
     },
   ],
 },
 {
   title: 'Skills & Competencies',
   questions: [
     {
       q: 'Which skill do you feel strongest at?',
       options: [
         'Logical reasoning or analysis',
         'Creative brainstorming',
         'Communication and empathy',
         'Leading teams or projects',
       ],
     },
     {
       q: 'Which skill would you most want to improve?',
       options: [
         'Technical or data proficiency',
         'Creative expression',
         'Interpersonal or listening skills',
         'Planning and organization',
       ],
     },
   ],
 },
 {
   title: 'Career Preferences & Goals',
   questions: [
     {
       q: 'How do you measure success?',
       options: [
         'Well-executed work',
         'Original ideas implemented',
         'Impact on others’ lives',
         'Recognition and status',
       ],
     },
     {
       q: 'Ideally, my daily work:',
       options: [
         'Is structured and reliable',
         'Is flexible and changing',
         'Is collaborative and social',
         'Is goal-focused and fast-paced',
       ],
     },
     {
       q: 'If you had to choose, you’d rather:',
       options: [
         'Research and learn independently',
         'Create something new',
         'Support others or teach',
         'Build or manage something concrete',
       ],
     },
   ],
 },
 {
   title: 'Personal Growth & Self-Awareness',
   questions: [
     {
       q: 'Your top three values are:',
       options: [
         'Stability, accuracy, tradition',
         'Innovation, freedom, creativity',
         'Compassion, connection, integrity',
         'Ambition, leadership, achievement',
       ],
     },
     {
       q: 'You prefer feedback that is:',
       options: [
         'Honest and actionable',
         'Gentle but clear',
         'Supportive and uplifting',
         'Direct and challenge-driven',
       ],
     },
     {
       q: 'What energizes you most?',
       options: [
         'Achieving well-defined goals',
         'Exploring new ideas',
         'Strengthening relationships',
         'Making an impact or leading',
       ],
     },
   ],
 },
 {
   title: 'Motivation & Future Outlook',
   questions: [
     {
       q: 'What would you regret most?',
       options: [
         'Not mastering a skill',
         'Never exploring your creativity',
         'Not helping people',
         'Never becoming a leader',
       ],
     },
     {
       q: 'In five years, you ideally:',
       options: [
         'Have deep knowledge in your field',
         'Have created or contributed to something unique',
         'Have made a difference for others',
         'Have risen to a significant position',
       ],
     },
     {
       q: 'If money wasn’t a factor, you’d pick work that:',
       options: [
         'Engages your mind and analysis',
         'Lets you express your artistic self',
         'Allows you to mentor or support others',
         'Lets you organize, lead, or build',
       ],
     },
   ],
 },
];


function parseReport(report) {
  const sections = report.split(/###\s+/); // split sections based on headings
  let conclusion = "", recommendations = "";

  for (const section of sections) {
    if (/Conclusion/i.test(section)) {
      conclusion = section.replace(/Conclusion/i, "").trim();
    } else if (/Career Recommendations/i.test(section)) {
      recommendations = section.replace(/Career Recommendations/i, "").trim();
    }
  }

  return { conclusion, recommendations };
}

// ✅ Extract only titles from career recommendation text
function extractRecommendationTitles(recommendationsRaw) {
  return recommendationsRaw
    .split(/\n+/)
    .filter((r) => r.trim() !== "")
    .map(line => {
      const cleaned = line.replace(/\*\*/g, "").trim();
      const [titlePart] = cleaned.split(":");
      return titlePart.trim();
    });
}

// Helper for word-by-word fade-in animation
function AnimatedText({ text, className = "" }) {
  const [visibleWords, setVisibleWords] = useState(0);
  const words = text ? text.split(" ") : [];

  useEffect(() => {
    setVisibleWords(0);
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleWords(i);
      if (i >= words.length) clearInterval(interval);
    }, 40); // 40ms per word for smooth effect
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={className}>
      {words.map((word, idx) => (
        <span
          key={idx}
          style={{
            opacity: idx < visibleWords ? 1 : 0,
            transition: "opacity 0.3s",
            marginRight: "0.25em"
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}

// Extract strengths and recommended path from the conclusion text (simple heuristic)
function extractCapabilities(conclusion) {
  // Example: Look for strengths/traits in the conclusion
  // You can improve this extraction logic as needed
  const strengths = [];
  if (/organized|precise|dependable/i.test(conclusion)) strengths.push("Organized & Precise");
  if (/creative|curious|imaginative/i.test(conclusion)) strengths.push("Creative & Curious");
  if (/supportive|caring|empathetic/i.test(conclusion)) strengths.push("Supportive & Caring");
  if (/goal-oriented|driven|ambitious/i.test(conclusion)) strengths.push("Goal-Oriented & Driven");
  if (strengths.length === 0) strengths.push("Adaptable");
  return strengths;
}

function extractRecommendedPath(recommendations) {
  // Use the first recommended job as the path
  const lines = recommendations.split("\n").filter(l => l.trim());
  const first = lines[0] || "";
  return first.replace(/\*\*/g, "").trim();
}

export default function Quiz() {
  const [answers, setAnswers] = useState({});
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  const handleChange = (sectionIdx, qIdx, value) => {
    setAnswers(prev => ({
      ...prev,
      [`${sectionIdx}-${qIdx}`]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setReport("");
    setLoading(true);

    const qaPairs = [];
    quizSections.forEach((section, sectionIdx) => {
      section.questions.forEach((q, qIdx) => {
        const answer = answers[`${sectionIdx}-${qIdx}`] || "";
        qaPairs.push({ question: q.q, answer });
      });
    });

    const prompt = `
Analyze this quiz result. Provide two markdown sections:

### Conclusion
Short (4-5 sentence) personality/strength summary.

### Career Recommendations
Recommend 4 jobs using this format:
**Job Title:** One-line explanation.

Answers:
${qaPairs
      .map((qa, i) => `${i + 1}. Q: ${qa.question}\nA: ${qa.answer}`)
      .join("\n\n")}
`;

    try {
      const res = await fetch(API_ENDPOINTS.AI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      const rawOutput = data.response || data.error || "No response from AI.";
      setReport(rawOutput);

      const { conclusion, recommendations } = parseReport(rawOutput);
      const recommendationTitles = extractRecommendationTitles(recommendations);
      const email = localStorage.getItem("userEmail");

      await fetch(API_ENDPOINTS.USER_UPDATE, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, conclusion, recommendations: recommendationTitles }),
      });
    } catch (err) {
      console.error("Error contacting AI:", err);
      setReport("Server error. Try again.");
    }

    setLoading(false);
  };

  const { conclusion, recommendations } = parseReport(report);

  // Only show the animated conclusion page if report exists
  const showConclusionPage = !!report;

  return (
    <div className="flex bg-white min-h-screen">
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

      <div className={`flex-1 flex flex-col transition-all duration-300 bg-white ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Logout Button - Notion style, top-right */}
        <div className="flex justify-end px-8 pt-8">
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

        <div className="flex-1 pb-16 pt-4 overflow-y-auto bg-white">
          <div
            className="w-full"
            style={{
              maxWidth: showConclusionPage ? "1050px" : "1200px", // Increased width
              paddingLeft: "2rem", // Slightly reduced padding
              paddingRight: "2rem",
              boxSizing: "border-box",
              overflowX: showConclusionPage ? "auto" : "visible", // Prevent horizontal overflow
            }}
          >
            {showConclusionPage ? (
              <div className="mt-16 mb-24 w-full flex flex-col items-start">
                <h1
                  className="text-3xl font-bold text-gray-900 mb-10 tracking-tight"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  CONCLUSION
                </h1>
                <div className="mb-10 w-full">
                  <AnimatedText
                    text={conclusion}
                    className="text-lg text-gray-800 leading-relaxed"
                    style={{
                      lineHeight: "1.8",
                      maxWidth: "100%",
                      whiteSpace: "pre-line",
                      overflowWrap: "break-word",
                    }}
                  />
                </div>
                {/* Divider */}
                <hr className="w-full border-t border-gray-200 mb-8" />
                <div className="mb-10 w-full">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">User Capabilities</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    {extractCapabilities(conclusion).map((cap, idx) => (
                      <li key={idx} className="text-gray-800 text-base">
                        <AnimatedText text={cap} />
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Divider */}
                <hr className="w-full border-t border-gray-200 mb-8" />
                <div className="mb-10 w-full" style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Path</h2>
                  <AnimatedText
                    text={extractRecommendedPath(recommendations)}
                    className="text-base text-gray-800"
                    style={{
                      wordBreak: "break-word",
                      whiteSpace: "pre-line",
                      maxWidth: "100%",
                      overflowWrap: "break-word"
                    }}
                  />
                </div>
                <div className="flex justify-start mt-16 w-full">
                  <button
                    className="px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
                    onClick={() => {
                      setReport("");
                      setAnswers({});
                    }}
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-12 w-full">
                {/* Quiz Heading */}
                <h1 className="text-2xl font-bold text-gray-900 mb-10 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                  Psychometric Quiz
                </h1>
                {/* Quiz Questions */}
                {(() => {
                  let globalIdx = 0;
                  return quizSections.map((section, sectionIdx) => (
                    <div key={section.title} className="mb-12">
                      <h3 className="font-bold text-lg text-gray-900 mb-6">{section.title}</h3>
                      <div className="space-y-6">
                        {section.questions.map((q, qIdx) => {
                          globalIdx++;
                          const key = `${sectionIdx}-${qIdx}`;
                          return (
                            <div key={q.q} className="mb-6">
                              <div className="font-medium mb-3 flex items-center text-gray-900">
                                <span className="mr-2 text-gray-500">{globalIdx}.</span> {q.q}
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {q.options.map((opt) => {
                                  const isSelected = answers[key] === opt;
                                  return (
                                    <label
                                      key={opt}
                                      className={`flex items-center rounded-lg px-4 py-3 cursor-pointer border transition
                                        ${isSelected
                                          ? "bg-black text-white border-black"
                                          : "bg-white text-black border-gray-200 hover:border-black hover:bg-gray-50"
                                        }`}
                                      style={{ boxShadow: "none" }}
                                    >
                                      <input
                                        type="radio"
                                        name={key}
                                        value={opt}
                                        checked={isSelected}
                                        onChange={() => handleChange(sectionIdx, qIdx, opt)}
                                        className="sr-only"
                                      />
                                      <span className="text-sm">{opt}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ));
                })()}
                <div className="flex justify-start mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                  >
                    {loading ? "Analyzing..." : "Submit Quiz"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}