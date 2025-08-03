import React, { useState } from 'react';
import { API_ENDPOINTS } from '../config';
import axios from "axios";
import { useNavigate } from "react-router-dom";


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

export default function Quiz() {
  const [answers, setAnswers] = useState({});
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (sectionIdx, qIdx, value) => {
    setAnswers(prev => ({
      ...prev,
      [`${sectionIdx}-${qIdx}`]: value,
    }));
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

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Career Quiz</h1>
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

      {/* Quiz Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-10 w-full">
            {(() => {
              let globalIdx = 0;
              return quizSections.map((section, sectionIdx) => (
                <div key={section.title} className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-bold text-lg text-gray-700 mb-4">{section.title}</h3>
                  <div className="space-y-8">
                    {section.questions.map((q, qIdx) => {
                      globalIdx++;
                      const key = `${sectionIdx}-${qIdx}`;
                      return (
                        <div key={q.q}>
                          <div className="font-semibold mb-2 flex items-center">
                            <span className="mr-2 text-gray-500">{globalIdx}.</span> {q.q}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {q.options.map((opt) => {
                              const isSelected = answers[key] === opt;
                              return (
                                <label
                                  key={opt}
                                  className={`flex items-center rounded-lg px-4 py-2 cursor-pointer border-2 transition ${
                                    isSelected
                                      ? "bg-black text-white border-black"
                                      : "bg-white text-black border-gray-200 hover:border-black"
                                  }`}
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

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Submit Quiz"}
              </button>
            </div>
          </form>

          {report && (
            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Your Results</h3>
              <div className="prose max-w-none">
                <div className="mb-6">
                  <h4 className="text-md font-semibold mb-2">Conclusion</h4>
                  <p className="text-gray-700">{conclusion}</p>
                </div>
                <div>
                  <h4 className="text-md font-semibold mb-2">Career Recommendations</h4>
                  <div className="text-gray-700">{recommendations}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}