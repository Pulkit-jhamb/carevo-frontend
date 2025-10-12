import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config';
import axios from 'axios';
import CollegeSidebarDark from './sidebar_college_dark';
import { 
  Search, 
  Settings, 
  Bell, 
  ChevronDown, 
  Plus,
  Upload,
  Download,
  Eye,
  Star,
  Calendar,
  User,
  BookOpen,
  FileText,
  Image,
  Video,
  File
} from 'lucide-react';

export default function NotabilityDark() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  // Theme toggle handler
  const handleToggleTheme = () => {
    navigate("/notability-light");
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

  // Sample trending notes
  const trendingNotes = [
    {
      id: 1,
      title: 'Mathematics II',
      subtitle: 'Cheat Sheet - Fourier Series - 10 Oct 2025 - All Branches',
      author: 'Harshit Dua',
      tag: '#Trending 1',
      type: 'document',
      thumbnail: '/api/placeholder/300/400'
    },
    {
      id: 2,
      title: 'Robotics Dynamics',
      subtitle: 'Notes - Projection',
      author: 'Harshit Dua',
      tag: '#Trending 2',
      type: 'document',
      thumbnail: '/api/placeholder/300/400'
    },
    {
      id: 3,
      title: 'Stress Analysis',
      subtitle: 'Tutorial - Tut Sheet 1',
      author: 'Dhiren Goel',
      tag: '#Trending 3',
      type: 'document',
      thumbnail: '/api/placeholder/300/400'
    },
    {
      id: 4,
      title: 'UI/UX Design',
      subtitle: 'Assignment - 1st Ch',
      author: 'Pulkit Jamb',
      tag: '#Trending 4',
      type: 'document',
      thumbnail: '/api/placeholder/300/400'
    },
    {
      id: 5,
      title: 'Data Structures',
      subtitle: 'Complete Notes - Semester 3',
      author: 'Arjun Singh',
      tag: '#Trending 5',
      type: 'document',
      thumbnail: '/api/placeholder/300/400'
    }
  ];

  // Sample recently uploaded notes
  const recentlyUploaded = [
    {
      id: 6,
      title: 'Machine Learning',
      subtitle: 'Neural Networks - Deep Learning',
      author: 'Priya Sharma',
      uploadDate: '2 hours ago',
      type: 'video',
      thumbnail: '/api/placeholder/300/400'
    },
    {
      id: 7,
      title: 'Database Systems',
      subtitle: 'SQL Queries - Advanced',
      author: 'Rahul Kumar',
      uploadDate: '5 hours ago',
      type: 'document',
      thumbnail: '/api/placeholder/300/400'
    },
    {
      id: 8,
      title: 'Computer Networks',
      subtitle: 'OSI Model - Complete Guide',
      author: 'Sneha Patel',
      uploadDate: '1 day ago',
      type: 'presentation',
      thumbnail: '/api/placeholder/300/400'
    },
    {
      id: 9,
      title: 'Software Engineering',
      subtitle: 'SDLC Models - Comparison',
      author: 'Vikash Gupta',
      uploadDate: '2 days ago',
      type: 'document',
      thumbnail: '/api/placeholder/300/400'
    },
    {
      id: 10,
      title: 'Operating Systems',
      subtitle: 'Process Scheduling - Algorithms',
      author: 'Anita Verma',
      uploadDate: '3 days ago',
      type: 'video',
      thumbnail: '/api/placeholder/300/400'
    }
  ];

  // Sample recommended notes
  const recommendedNotes = [
    {
      id: 11,
      title: 'Algorithms',
      subtitle: 'Dynamic Programming - Advanced',
      author: 'Karan Malhotra',
      branch: 'Computer Science',
      semester: '5th Semester',
      type: 'document',
      thumbnail: '/api/placeholder/300/400'
    },
    {
      id: 12,
      title: 'Digital Electronics',
      subtitle: 'Logic Gates - Fundamentals',
      author: 'Ravi Shankar',
      branch: 'Electronics',
      semester: '3rd Semester',
      type: 'presentation',
      thumbnail: '/api/placeholder/300/400'
    },
    {
      id: 13,
      title: 'Thermodynamics',
      subtitle: 'Heat Transfer - Applications',
      author: 'Meera Joshi',
      branch: 'Mechanical',
      semester: '4th Semester',
      type: 'document',
      thumbnail: '/api/placeholder/300/400'
    },
    {
      id: 14,
      title: 'Circuit Analysis',
      subtitle: 'AC/DC Circuits - Problems',
      author: 'Suresh Reddy',
      branch: 'Electrical',
      semester: '2nd Semester',
      type: 'video',
      thumbnail: '/api/placeholder/300/400'
    }
  ];

  const getFileIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'presentation': return <Image className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const NoteCard = ({ note, showUploadDate = false, showBranch = false }) => (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:shadow-xl hover:border-gray-700 transition-all duration-300 cursor-pointer group">
      <div className="aspect-[3/4] bg-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-20 bg-gray-700 rounded-lg flex items-center justify-center">
            {getFileIcon(note.type)}
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <button className="p-2 bg-black/60 rounded-full hover:bg-black/80 transition-colors">
            <Star className="w-4 h-4 text-gray-300" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{note.title}</h3>
          <p className="text-gray-300 text-xs line-clamp-2">{note.subtitle}</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{note.author}</span>
          </div>
          {note.tag && (
            <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
              {note.tag}
            </span>
          )}
        </div>
        {showUploadDate && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <Calendar className="w-3 h-3" />
            <span>{note.uploadDate}</span>
          </div>
        )}
        {showBranch && (
          <div className="text-xs text-gray-500 mb-2">
            <span>{note.branch} • {note.semester}</span>
          </div>
        )}
        <div className="flex items-center gap-2 mt-3">
          <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
            <Eye className="w-3 h-3" />
            View
          </button>
          <button className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-800 text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-700 transition-colors">
            <Download className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex bg-black min-h-screen">
      <CollegeSidebarDark isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <div className="bg-black border-b border-gray-800 px-8 py-5 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search anything"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-white placeholder-gray-400"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-4">
            {/* Theme toggle button */}
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              title="Switch to Light Mode"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <Settings className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors relative">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <Upload className="w-4 h-4" />
              Upload Notes
            </button>
            <div className="flex items-center gap-2 px-3 py-2 bg-black cursor-pointer hover:bg-gray-900">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-white">{userName || 'Harshit Dua'}</span>
              <ChevronDown className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-black">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Trending Notes */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Trending Notes</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {trendingNotes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </section>

            {/* Recently Uploaded Notes */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Recently Uploaded Notes</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {recentlyUploaded.map((note) => (
                  <NoteCard key={note.id} note={note} showUploadDate={true} />
                ))}
              </div>
            </section>

            {/* Recommended For You */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-2">Recommended For You</h2>
              <p className="text-gray-400 text-sm mb-6">(based on your branch or semester)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recommendedNotes.map((note) => (
                  <NoteCard key={note.id} note={note} showBranch={true} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
