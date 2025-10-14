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
  const [showUploadModal, setShowUploadModal] = useState(false);
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

  // Google Drive file mapping
  const driveFileMapping = {
    'Circuit Analysis': '1VG8bqShVweH1rSY1q3IRt-H7-kGjSPSB',
    'Data Structures': '1kf2KKV8LIvBaFkwMFUg6d_BDRAwsj1so',
    'Algorithms': '1ADaNtXO8N5_igylfFFblDUf32BIF9tuk', // dynamic programming
    'Digital Electronics': '1ijsiMiRs1uqPcBx5sxynrRc5JCtM1IjV', // logic gates
    'Mathematics II': '1TgBOd_RvD-_pswrEpNEDptoSnT-2Ln4-',
    'Machine Learning': '1Zr93aNQctJC576_TQ02gx7DldyT0rLsy', // deep learning
    'Operating Systems': '1yc5VnMfVVRxV02L2wwAcv1RD7AV4x6Xe',
    'Robotics Dynamics': '1fzvZpsBaWAKRILfbzqFH5gdynotAiBk8', // robotics
    'Software Engineering': '19ZL8vlx0_F9j61Y1J7U_0l_687IlTYYv',
    'Database Systems': '1QU04OGbTfmHK6K2o0XpsXinMU76Q6P7p', // sql
    'Stress Analysis': '15_lvKD92wwOe_ZipMgzUju_Ao8Tp9zd7',
    'Thermodynamics': '1ZzTxcg-f36M7HGU_WEQ9mGXUqu6M6fEM',
    'UI/UX Design': '1xkIcIpbCp4IlM39RRL-SNPVZDWsc_ypO'
  };

  // Function to open Google Drive file in new tab
  const openDriveFile = (title) => {
    const fileId = driveFileMapping[title];
    if (fileId) {
      const driveUrl = `https://drive.google.com/file/d/${fileId}/view`;
      window.open(driveUrl, '_blank');
    }
  };

  // Sample trending notes
  const trendingNotes = [
    {
      id: 1,
      title: 'Mathematics II',
      subtitle: 'Cheat Sheet - Fourier Series - 10 Oct 2025 - All Branches',
      author: 'Harshit Dua',
      tag: '#Trending 1',
      type: 'document',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=400&fit=crop&crop=center',
      icon: '📐'
    },
    {
      id: 2,
      title: 'Robotics Dynamics',
      subtitle: 'Notes - Projection',
      author: 'Harshit Dua',
      tag: '#Trending 2',
      type: 'document',
      thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=400&fit=crop&crop=center',
      icon: '🤖'
    },
    {
      id: 3,
      title: 'Stress Analysis',
      subtitle: 'Tutorial - Tut Sheet 1',
      author: 'Dhiren Goel',
      tag: '#Trending 3',
      type: 'document',
      thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=400&fit=crop&crop=center',
      icon: '⚡'
    },
    {
      id: 4,
      title: 'UI/UX Design',
      subtitle: 'Assignment - 1st Ch',
      author: 'Pulkit Jamb',
      tag: '#Trending 4',
      type: 'document',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=400&fit=crop&crop=center',
      icon: '🎨'
    },
    {
      id: 5,
      title: 'Data Structures',
      subtitle: 'Complete Notes - Semester 3',
      author: 'Arjun Singh',
      tag: '#Trending 5',
      type: 'document',
      thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=300&h=400&fit=crop&crop=center',
      icon: '🌳'
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
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=400&fit=crop&crop=center',
      icon: '🧠'
    },
    {
      id: 7,
      title: 'Database Systems',
      subtitle: 'SQL Queries - Advanced',
      author: 'Rahul Kumar',
      uploadDate: '5 hours ago',
      type: 'document',
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=300&h=400&fit=crop&crop=center',
      icon: '🗄️'
    },
    {
      id: 8,
      title: 'Computer Networks',
      subtitle: 'OSI Model - Complete Guide',
      author: 'Sneha Patel',
      uploadDate: '1 day ago',
      type: 'presentation',
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&h=400&fit=crop&crop=center',
      icon: '🌐'
    },
    {
      id: 9,
      title: 'Software Engineering',
      subtitle: 'SDLC Models - Comparison',
      author: 'Vikash Gupta',
      uploadDate: '2 days ago',
      type: 'document',
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=400&fit=crop&crop=center',
      icon: '💻'
    },
    {
      id: 10,
      title: 'Operating Systems',
      subtitle: 'Process Scheduling - Algorithms',
      author: 'Anita Verma',
      uploadDate: '3 days ago',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=300&h=400&fit=crop&crop=center',
      icon: '⚙️'
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
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&h=400&fit=crop&crop=center',
      icon: '🔄'
    },
    {
      id: 12,
      title: 'Digital Electronics',
      subtitle: 'Logic Gates - Fundamentals',
      author: 'Ravi Shankar',
      branch: 'Electronics',
      semester: '3rd Semester',
      type: 'presentation',
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=400&fit=crop&crop=center',
      icon: '🔌'
    },
    {
      id: 13,
      title: 'Thermodynamics',
      subtitle: 'Heat Transfer - Applications',
      author: 'Meera Joshi',
      branch: 'Mechanical',
      semester: '4th Semester',
      type: 'document',
      thumbnail: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=400&fit=crop&crop=center',
      icon: '🔥'
    },
    {
      id: 14,
      title: 'Circuit Analysis',
      subtitle: 'AC/DC Circuits - Problems',
      author: 'Suresh Reddy',
      branch: 'Electrical',
      semester: '2nd Semester',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=400&fit=crop&crop=center',
      icon: '⚡'
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
        <img 
          src={note.thumbnail} 
          alt={note.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
        <div className="absolute inset-0 hidden items-center justify-center bg-gray-800">
          <div className="w-16 h-20 bg-gray-700 rounded-lg flex items-center justify-center flex-col gap-2">
            <span className="text-2xl">{note.icon}</span>
            {getFileIcon(note.type)}
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <button className="p-2 bg-black/60 rounded-full hover:bg-black/80 transition-colors">
            <Star className="w-4 h-4 text-gray-300" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2 drop-shadow-lg">{note.title}</h3>
          <p className="text-gray-200 text-xs line-clamp-2 drop-shadow-md">{note.subtitle}</p>
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
          <button 
            onClick={() => openDriveFile(note.title)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            <Eye className="w-3 h-3" />
            View
          </button>
          <button 
            onClick={() => openDriveFile(note.title)}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-800 text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-700 transition-colors"
          >
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
            <button 
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Upload Notes</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Note Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter note title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject/Topic
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Machine Learning, Data Structures"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  File Upload
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 mb-2">
                    Drag and drop your files here, or click to browse
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.png"
                    className="hidden"
                    id="file-upload-dark"
                  />
                  <label
                    htmlFor="file-upload-dark"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    Choose Files
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported formats: PDF, DOC, PPT, TXT, JPG, PNG
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle upload logic here
                    alert('Upload functionality would be implemented here!');
                    setShowUploadModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
