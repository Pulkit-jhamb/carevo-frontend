import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config';
import axios from 'axios';
import CollegeSidebarLight from './sidebar_college_light';
import CollegeSidebarDark from './sidebar_college_dark';
import { 
  Download,
  Edit,
  ChevronDown,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Mail,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';

export default function ResumeCollege() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // Theme toggle handler
  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS);
        if (response.data.authenticated && response.data.user) {
          setUser(response.data.user);
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

  // Sample resume data
  const resumeData = {
    personalInfo: {
      name: userName || "Harshit Dua",
      title: "Computer Science Student",
      email: userEmail || "harshit.dua@example.com",
      phone: "+91 98765 43210",
      location: "Patiala, Punjab",
      linkedin: "linkedin.com/in/harshitdua",
      github: "github.com/harshitdua"
    },
    summary: "Passionate Computer Science student with strong programming skills and experience in web development. Seeking opportunities to apply technical knowledge in real-world projects and contribute to innovative solutions.",
    education: [
      {
        degree: "Bachelor of Engineering in Computer Science",
        institution: "Thapar Institute of Engineering & Technology",
        location: "Patiala, Punjab",
        duration: "2022 - 2026",
        cgpa: "8.5/10",
        relevant: ["Data Structures & Algorithms", "Database Management", "Web Technologies", "Software Engineering"]
      }
    ],
    experience: [
      {
        title: "Software Development Intern",
        company: "Tech Solutions Pvt Ltd",
        location: "Chandigarh",
        duration: "Jun 2024 - Aug 2024",
        description: [
          "Developed responsive web applications using React.js and Node.js",
          "Collaborated with senior developers on client projects",
          "Implemented RESTful APIs and database optimization techniques",
          "Participated in code reviews and agile development processes"
        ]
      }
    ],
    projects: [
      {
        name: "E-Commerce Web Application",
        technologies: ["React", "Node.js", "MongoDB", "Express"],
        duration: "Mar 2024 - May 2024",
        description: [
          "Built a full-stack e-commerce platform with user authentication",
          "Implemented shopping cart functionality and payment integration",
          "Designed responsive UI with modern CSS frameworks"
        ],
        link: "github.com/harshitdua/ecommerce-app"
      },
      {
        name: "Task Management System",
        technologies: ["Python", "Django", "PostgreSQL"],
        duration: "Jan 2024 - Feb 2024",
        description: [
          "Created a collaborative task management tool for teams",
          "Implemented real-time notifications and progress tracking",
          "Deployed using Docker and AWS services"
        ],
        link: "github.com/harshitdua/task-manager"
      }
    ],
    skills: {
      programming: ["Python", "JavaScript", "Java", "C++", "SQL"],
      frameworks: ["React", "Node.js", "Django", "Express", "Bootstrap"],
      tools: ["Git", "Docker", "AWS", "MongoDB", "PostgreSQL"],
      soft: ["Problem Solving", "Team Collaboration", "Communication", "Leadership"]
    },
    achievements: [
      "Winner - College Hackathon 2024",
      "Dean's List - Academic Excellence (2023-24)",
      "Google Developer Student Club - Core Team Member",
      "Published research paper on Machine Learning applications"
    ]
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      {isDarkMode ? (
        <CollegeSidebarDark isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      ) : (
        <CollegeSidebarLight isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      )}
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <div className={`${isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-200'} border-b px-8 py-5 flex items-center justify-between`}>
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Resume Builder</h1>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Create and manage your professional resume</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Theme toggle button */}
            <button
              onClick={handleToggleTheme}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode 
                  ? 'bg-gray-800 text-white hover:bg-gray-700' 
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}>
              <Edit className="w-4 h-4" />
              Edit Resume
            </button>
            <div className={`flex items-center gap-2 px-3 py-2 ${
              isDarkMode 
                ? 'bg-black' 
                : 'bg-gray-50 rounded-lg border border-gray-200'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
              }`}>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userName}</span>
              <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-gray-500'}`} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 p-8 overflow-y-auto ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
          <div className="max-w-4xl mx-auto">
            {/* Resume Preview */}
            <div className={`rounded-lg p-8 ${
              isDarkMode 
                ? 'bg-gray-900 border border-gray-800' 
                : 'bg-white shadow-lg border border-gray-200'
            }`}>
              
              {/* Header Section */}
              <div className={`border-b pb-6 mb-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {resumeData.personalInfo.name}
                </h1>
                <p className={`text-xl mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {resumeData.personalInfo.title}
                </p>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{resumeData.personalInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{resumeData.personalInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{resumeData.personalInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    <span>{resumeData.personalInfo.linkedin}</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <h2 className={`text-xl font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <User className="w-5 h-5" />
                  Professional Summary
                </h2>
                <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {resumeData.summary}
                </p>
              </div>

              {/* Education */}
              <div className="mb-6">
                <h2 className={`text-xl font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <GraduationCap className="w-5 h-5" />
                  Education
                </h2>
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {edu.degree}
                        </h3>
                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          {edu.institution}, {edu.location}
                        </p>
                      </div>
                      <div className={`text-right text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p>{edu.duration}</p>
                        <p className="font-medium">CGPA: {edu.cgpa}</p>
                      </div>
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <strong>Relevant Coursework:</strong> {edu.relevant.join(", ")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Experience */}
              <div className="mb-6">
                <h2 className={`text-xl font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Briefcase className="w-5 h-5" />
                  Experience
                </h2>
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {exp.title}
                        </h3>
                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          {exp.company}, {exp.location}
                        </p>
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {exp.duration}
                      </p>
                    </div>
                    <ul className={`list-disc list-inside text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {exp.description.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Projects */}
              <div className="mb-6">
                <h2 className={`text-xl font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <FileText className="w-5 h-5" />
                  Projects
                </h2>
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {project.name}
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <strong>Technologies:</strong> {project.technologies.join(", ")}
                        </p>
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {project.duration}
                      </p>
                    </div>
                    <ul className={`list-disc list-inside text-sm space-y-1 mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {project.description.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      <ExternalLink className="w-3 h-3 inline mr-1" />
                      {project.link}
                    </p>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h2 className={`text-xl font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Award className="w-5 h-5" />
                  Technical Skills
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Programming Languages
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.programming.map((skill, index) => (
                        <span 
                          key={index} 
                          className={`px-3 py-1 rounded-full text-sm ${
                            isDarkMode 
                              ? 'bg-blue-900 text-blue-300' 
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Frameworks & Libraries
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.frameworks.map((skill, index) => (
                        <span 
                          key={index} 
                          className={`px-3 py-1 rounded-full text-sm ${
                            isDarkMode 
                              ? 'bg-green-900 text-green-300' 
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Tools & Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.tools.map((skill, index) => (
                        <span 
                          key={index} 
                          className={`px-3 py-1 rounded-full text-sm ${
                            isDarkMode 
                              ? 'bg-purple-900 text-purple-300' 
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Soft Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.soft.map((skill, index) => (
                        <span 
                          key={index} 
                          className={`px-3 py-1 rounded-full text-sm ${
                            isDarkMode 
                              ? 'bg-orange-900 text-orange-300' 
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h2 className={`text-xl font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Award className="w-5 h-5" />
                  Achievements & Awards
                </h2>
                <ul className={`list-disc list-inside text-sm space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {resumeData.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}