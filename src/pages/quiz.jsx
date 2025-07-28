import React, { useState } from 'react';
import { API_ENDPOINTS } from '../config';


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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f9fb] via-[#e0e7ef] to-[#c7d2fe] flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl p-0 flex flex-col items-center justify-center relative z-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 mt-8">Career Quiz</h1>

        <form onSubmit={handleSubmit} className="space-y-10 w-full max-w-4xl mx-auto px-4 pb-12">
          {(() => {
            let globalIdx = 0;
            return quizSections.map((section, sectionIdx) => (
              <div key={section.title}>
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
                                    : "bg-gray-50 text-gray-800 border-gray-200 hover:border-black"
                                }`}
                                onClick={() =>
                                  isSelected
                                    ? setAnswers((prev) => {
                                        const newAnswers = { ...prev };
                                        delete newAnswers[key];
                                        return newAnswers;
                                      })
                                    : handleChange(sectionIdx, qIdx, opt)
                                }
                              >
                                <span>{opt}</span>
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

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="bg-black text-white font-bold px-8 py-3 rounded-full text-lg shadow transition"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Submit"}
            </button>
          </div>
        </form>

        {report && (
          <div className="mt-10 w-full max-w-3xl mx-auto space-y-6">
            {conclusion && (
              <div className="bg-blue-50 border border-blue-300 rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-blue-900 mb-2">Conclusion</h2>
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{conclusion}</p>
              </div>
            )}

            {recommendations && (
              <div className="bg-purple-50 border border-purple-300 rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-purple-900 mb-2">Career Recommendations</h2>
                <ul className="list-disc pl-6 text-gray-800 whitespace-pre-wrap space-y-2">
                  {recommendations
                    .split("\n")
                    .filter((r) => r.trim() !== "")
                    .map((line, idx) => {
                      const cleaned = line.replace(/\*\*/g, "").trim();
                      const [titlePart, ...rest] = cleaned.split(":");
                      if (!rest.length) return <li key={idx}>{cleaned}</li>;
                      return (
                        <li key={idx}>
                          <strong>{titlePart.trim()}:</strong> {rest.join(":").trim()}
                        </li>
                      );
                    })}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}