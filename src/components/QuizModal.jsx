// import React, { useState } from 'react';
// import ReactMarkdown from 'react-markdown';
// import { API_ENDPOINTS } from '../config';

// const quizSections = [
//   {
//     title: 'Personality & Work-Style',
//     questions: [
//       {
//         q: 'When working in a group, I prefer to:',
//         options: [
//           'Lead and direct the discussion',
//           'Listen and support others',
//           'Focus on tasks quietly',
//           'Explore different ideas and possibilities',
//         ],
//       },
//       {
//         q: 'I\'m energized by:',
//         options: [
//           'Having clear, structured tasks',
//           'A flexible, open-ended schedule',
//           'Joining social events/classes',
//           'Time alone to reflect or learn',
//         ],
//       },
//       {
//         q: 'On a typical day, I feel:',
//         options: [
//           'Very organized and on schedule',
//           'Somewhat organized, but okay with flexibility',
//           'Chilled and go-with-the-flow',
//           'A bit scattered, lots of thoughts',
//         ],
//       },
//       {
//         q: 'I make decisions when:',
//         options: [
//           'I rely on established rules or data',
//           'I trust my gut feelings',
//           'I ask others for their viewpoints',
//           'I explore all options thoroughly',
//         ],
//       },
//     ],
//   },
//   {
//     title: 'Interests & Motivations',
//     questions: [
//       {
//         q: 'Which task fits you best?',
//         options: [
//           'Designing a creative project',
//           'Solving logic puzzles',
//           'Helping a friend with a problem',
//           'Organizing an event or group',
//         ],
//       },
//       {
//         q: 'In free time, I enjoy:',
//         options: [
//           'Crafting/art/music',
//           'Reading non-fiction or research',
//           'Playing team sports or socializing',
//           'Building things or fixing gadgets',
//         ],
//       },
//       {
//         q: 'I\'m most interested in:',
//         options: [
//           'Artistic expression',
//           'Scientific or technical explanations',
//           'Teaching or mentoring others',
//           'Selling ideas or organizing events',
//         ],
//       },
//     ],
//   },
//   {
//     title: 'Work Approach',
//     questions: [
//       {
//         q: 'When facing a difficult task, I:',
//         options: [
//           'Break it into small, regular steps',
//           'Tackle the most interesting parts first',
//           'Ask for help or collaborate',
//           'Push myself through until it\'s done',
//         ],
//       },
//       {
//         q: 'Under pressure, I typically:',
//         options: [
//           'Stay calm and find solutions',
//           'Overthink possibilities',
//           'Seek reassurance from others',
//           'Focus and get results',
//         ],
//       },
//       {
//         q: 'I learn best through:',
//         options: [
//           'Practical hands-on experience',
//           'Books, lectures, research',
//           'Discussion and reflection',
//           'Teaching others or leading groups',
//         ],
//       },
//     ],
//   },
//   {
//     title: 'Values & Goals',
//     questions: [
//       {
//         q: 'I value at work:',
//         options: [
//           'Accuracy and high quality',
//           'Creativity and novelty',
//           'Connection and helping others',
//           'Recognition and achievement',
//         ],
//       },
//       {
//         q: 'How do you measure success?',
//         options: [
//           'Well-executed work',
//           'Original ideas implemented',
//           'Impact on others\' lives',
//           'Recognition and status',
//         ],
//       },
//       {
//         q: 'In five years, you ideally:',
//         options: [
//           'Have deep knowledge in your field',
//           'Have created or contributed to something unique',
//           'Have made a difference for others',
//           'Have risen to a significant position',
//         ],
//       },
//     ],
//   },
// ];

// function parseReport(report) {
//   const conclusionMatch = report.match(/### Conclusion\n([\s\S]*?)(?=\n###|$)/);
//   const recommendationsMatch = report.match(/### Career Recommendations\n([\s\S]*?)(?=\n###|$)/);

//   return {
//     conclusion: conclusionMatch ? conclusionMatch[1].trim() : "",
//     recommendations: recommendationsMatch ? recommendationsMatch[1].trim() : "",
//   };
// }

// function extractRecommendationTitles(recommendationsRaw) {
//   return recommendationsRaw
//     .split("\n")
//     .filter((r) => r.trim() !== "")
//     .map(line => {
//       const cleaned = line.replace(/\*\*/g, "").trim();
//       const [titlePart] = cleaned.split(":");
//       return titlePart.trim();
//     });
// }

// export default function QuizModal({ isOpen, onClose, onQuizComplete }) {
//   const [answers, setAnswers] = useState({});
//   const [report, setReport] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [currentStep, setCurrentStep] = useState('quiz');
//   const [error, setError] = useState(null);

//   const handleChange = (sectionIdx, qIdx, value) => {
//     try {
//       const key = `${sectionIdx}-${qIdx}`;
//       setAnswers(prev => ({
//         ...prev,
//         [key]: value,
//       }));
//       setError(null);
//     } catch (err) {
//       console.error('Error in handleChange:', err);
//       setError('Error selecting option. Please try again.');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setReport("");
//     setLoading(true);
//     setError(null);

//     // Check if all questions are answered
//     const totalQuestions = quizSections.reduce((total, section) => total + section.questions.length, 0);
//     const answeredQuestions = Object.keys(answers).length;
    
//     if (answeredQuestions < totalQuestions) {
//       setError(`Please answer all questions. You've answered ${answeredQuestions} out of ${totalQuestions} questions.`);
//       setLoading(false);
//       return;
//     }

//     const qaPairs = [];
//     quizSections.forEach((section, sectionIdx) => {
//       section.questions.forEach((q, qIdx) => {
//         const answer = answers[`${sectionIdx}-${qIdx}`] || "";
//         qaPairs.push({ question: q.q, answer });
//       });
//     });

//     const prompt = `
// Analyze this career quiz result and provide a well-formatted response with two clear sections:

// ### Conclusion
// Write a concise personality and strength summary in 4-5 sentences. Focus on the individual's key traits, work style preferences, and natural strengths based on their answers.

// ### Career Recommendations
// Recommend 4 specific career paths that align with their personality and interests. Use this format for each recommendation:

// **Career Title:** Brief explanation of why this career fits their profile and what they would enjoy about it.

// Make the response clear, actionable, and well-formatted with proper markdown.

// Quiz Answers:
// ${qaPairs
//       .map((qa, i) => `${i + 1}. **Question:** ${qa.question}\n   **Answer:** ${qa.answer}`)
//       .join("\n\n")}
// `;

//     try {
//       const res = await fetch(API_ENDPOINTS.AI, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt }),
//       });

//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }

//       const data = await res.json();
      
//       if (data.error) {
//         throw new Error(data.error);
//       }

//       const rawOutput = data.response || "No response from AI.";
//       setReport(rawOutput);

//       const { conclusion, recommendations } = parseReport(rawOutput);
      
//       if (!conclusion || !recommendations) {
//         throw new Error("Invalid response format from AI");
//       }

//       const recommendationTitles = extractRecommendationTitles(recommendations);
//       const email = localStorage.getItem("userEmail");

//       if (email) {
//         try {
//           await fetch(API_ENDPOINTS.USER_UPDATE, {
//             method: "PATCH",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email, conclusion, recommendations: recommendationTitles }),
//           });
//         } catch (updateErr) {
//           console.error("Error updating user data:", updateErr);
//           // Don't fail the quiz if user update fails
//         }
//       }

//       setCurrentStep('results');
//       onQuizComplete && onQuizComplete({ conclusion, recommendations });
//     } catch (err) {
//       console.error("Error contacting AI:", err);
//       setError(`Error: ${err.message}. Please try again.`);
//       setReport("");
//     }

//     setLoading(false);
//   };

//   const handleClose = () => {
//     setAnswers({});
//     setReport("");
//     setCurrentStep('quiz');
//     setError(null);
//     onClose();
//   };

//   const { conclusion, recommendations } = parseReport(report);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Backdrop */}
//       <div 
//         className="absolute inset-0 bg-black bg-opacity-50"
//         onClick={handleClose}
//       />
      
//       {/* Modal */}
//       <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 overflow-y-auto" style={{ maxHeight: '90vh' }}>
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h2 className="text-2xl font-bold text-gray-900">
//             {currentStep === 'quiz' ? 'Career Exploration Quiz' : 'Your Results'}
//           </h2>
//           <button
//             onClick={handleClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         {/* Content */}
//         <div>
//           {error && (
//             <div className="p-4 bg-red-100 text-red-700 rounded-lg mx-6 mt-4 border border-red-300">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                 </svg>
//                 {error}
//               </div>
//             </div>
//           )}
//           {currentStep === 'quiz' ? (
//             <div className="p-6">
//               {/* Progress indicator */}
//               <div className="mb-6">
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="text-sm text-gray-600">
//                     Progress: {Object.keys(answers).length} of {quizSections.reduce((total, section) => total + section.questions.length, 0)} questions answered
//                   </span>
//                   <span className="text-sm text-gray-600">
//                     {Math.round((Object.keys(answers).length / quizSections.reduce((total, section) => total + section.questions.length, 0)) * 100)}%
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-black h-2 rounded-full transition-all duration-300"
//                     style={{ 
//                       width: `${(Object.keys(answers).length / quizSections.reduce((total, section) => total + section.questions.length, 0)) * 100}%` 
//                     }}
//                   ></div>
//                 </div>
//               </div>
              
//               <form key="quiz-form" onSubmit={handleSubmit} className="space-y-8">
//                 {quizSections.length === 0 && (
//                   <div className="text-center py-8">
//                     <p className="text-gray-500">Loading quiz questions...</p>
//                   </div>
//                 )}
//                 {quizSections.map((section, sectionIdx) => {
//                   let globalIdx = 0;
//                   // Calculate global index for this section
//                   for (let i = 0; i < sectionIdx; i++) {
//                     globalIdx += quizSections[i].questions.length;
//                   }
                  
//                   if (!section || !section.questions) {
//                     return null;
//                   }
                  
//                   return (
//                     <div key={section.title} className="bg-gray-50 rounded-lg p-6">
//                       <h3 className="font-bold text-lg text-gray-700 mb-4">{section.title}</h3>
//                       <div className="space-y-6">
//                         {section.questions.map((q, qIdx) => {
//                           if (!q || !q.options) {
//                             return null;
//                           }
                          
//                           const questionGlobalIdx = globalIdx + qIdx + 1;
//                           const key = `${sectionIdx}-${qIdx}`;
//                           return (
//                             <div key={q.q}>
//                               <div className="font-semibold mb-3 flex items-start">
//                                 <span className="mr-2 text-gray-500 mt-0.5">{questionGlobalIdx}.</span> 
//                                 <span className="text-gray-900">{q.q}</span>
//                               </div>
//                               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                 {q.options.map((opt, optIdx) => {
//                                   const isSelected = answers[key] === opt;
//                                   return (
//                                     <label
//                                       key={`${key}-${optIdx}`}
//                                       className={`flex items-center rounded-lg px-4 py-3 cursor-pointer border-2 transition-colors duration-150 ${
//                                         isSelected
//                                           ? "bg-black text-white border-black"
//                                           : "bg-white text-black border-gray-200 hover:border-black"
//                                       }`}
//                                     >
//                                       <input
//                                         type="radio"
//                                         name={key}
//                                         value={opt}
//                                         checked={isSelected}
//                                         onChange={() => handleChange(sectionIdx, qIdx, opt)}
//                                         className="sr-only"
//                                       />
//                                       <span className="text-sm">{opt}</span>
//                                     </label>
//                                   );
//                                 })}
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   );
//                 })}

//                  <div className="flex justify-center pt-4">
//                    <button
//                      type="submit"
//                      disabled={loading}
//                      className="px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-150 disabled:opacity-50 flex items-center gap-2"
//                    >
//                      {loading && (
//                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                        </svg>
//                      )}
//                      {loading ? "Analyzing..." : "Submit Quiz"}
//                    </button>
//                  </div>
//               </form>
//             </div>
//           ) : (
//             <div className="p-6">
//               <div className="prose max-w-none">
//                 <div className="mb-8">
//                   <h4 className="text-xl font-semibold mb-3 text-gray-900">Personality Summary</h4>
//                   <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
//                     <ReactMarkdown 
//                       components={{
//                         p: ({children}) => <p className="mb-3 last:mb-0">{children}</p>,
//                         strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
//                         em: ({children}) => <em className="italic">{children}</em>,
//                         ul: ({children}) => <ul className="list-disc list-inside space-y-1">{children}</ul>,
//                         ol: ({children}) => <ol className="list-decimal list-inside space-y-1">{children}</ol>,
//                         li: ({children}) => <li className="text-gray-700">{children}</li>
//                       }}
//                     >
//                       {conclusion}
//                     </ReactMarkdown>
//                   </div>
//                 </div>
//                 <div>
//                   <h4 className="text-xl font-semibold mb-3 text-gray-900">Career Recommendations</h4>
//                   <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
//                     <ReactMarkdown 
//                       components={{
//                         p: ({children}) => <p className="mb-3 last:mb-0">{children}</p>,
//                         strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
//                         em: ({children}) => <em className="italic">{children}</em>,
//                         ul: ({children}) => <ul className="list-disc list-inside space-y-1">{children}</ul>,
//                         ol: ({children}) => <ol className="list-decimal list-inside space-y-1">{children}</ol>,
//                         li: ({children}) => <li className="text-gray-700">{children}</li>
//                       }}
//                     >
//                       {recommendations}
//                     </ReactMarkdown>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
//                 <button
//                   onClick={() => setCurrentStep('quiz')}
//                   className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150"
//                 >
//                   Retake Quiz
//                 </button>
//                 <button
//                   onClick={handleClose}
//                   className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-150"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// } 