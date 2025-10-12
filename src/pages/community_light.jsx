import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config';
import axios from 'axios';
import CollegeSidebarLight from './sidebar_college_light';
import { 
  Search, 
  Settings, 
  Bell, 
  ChevronDown, 
  Plus,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Share,
  MoreHorizontal,
  TrendingUp,
  Users,
  MapPin,
  Briefcase,
  Calendar,
  Award
} from 'lucide-react';

export default function CommunityLight() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  // Theme toggle handler
  const handleToggleTheme = () => {
    navigate("/community-dark");
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

  // Sample trending topics
  const trendingTopics = [
    { category: 'Hackathon', title: 'SIH\'25 Results', type: 'Hackathon' },
    { category: 'Placements', title: 'Recession 2026', type: 'Placements' },
    { category: 'Fests', title: 'SATURNALIA\'25', type: 'Fests' },
    { category: 'Company', title: 'Optum\'s Shortlist', type: 'Company' },
    { category: 'Company', title: 'Optum\'s Shortlist', type: 'Company' },
    { category: 'Company', title: 'Optum\'s Shortlist', type: 'Company' }
  ];

  // Sample posts
  const posts = [
    {
      id: 1,
      upvotes: 200,
      downvotes: 0,
      category: 'r/news',
      author: 'u/reddit4x',
      timeAgo: '1 hour ago',
      title: 'Thapar Pro VC\'s daughter added to Incedo\'s final list despite skipping test and interview',
      content: 'Something absolutely outrageous just happened in Thapar\'s placement process. It is hard not to feel disgusted when the system openly bends for power while deserving students are left in the dark.',
      comments: 143
    },
    {
      id: 2,
      upvotes: 300,
      downvotes: 0,
      category: 'r/news',
      author: 'u/reddit4x',
      timeAgo: '1 hour ago',
      title: 'Barely 1/4 Thapar Placed? Just 400 Offers this placement season which is Almost Over!',
      content: 'I\'ve heard that the peak placement season is basically over, and if we exclude PPOs from internships, only around 400 students are placed so far this season. Now the companies coming have 10L highest ctc?',
      comments: 222
    },
    {
      id: 3,
      upvotes: 100,
      downvotes: 0,
      category: 'r/news',
      author: 'u/reddit4x',
      timeAgo: '1 hour ago',
      title: 'Rubrik at thapar',
      content: '',
      comments: 45
    }
  ];

  // Popular communities
  const popularCommunities = [
    { name: 'GDSC', members: '230 Members', avatar: 'G' },
    { name: 'Enactus', members: '180 Members', avatar: 'E' },
    { name: 'Saturnalia', members: '225 Members', avatar: 'S' },
    { name: 'Placement Cell', members: '1.5k Members', avatar: 'P' },
    { name: 'DSA', members: '2k Members', avatar: 'D' }
  ];

  return (
    <div className="flex bg-white min-h-screen">
      <CollegeSidebarLight isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search anything"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 placeholder-gray-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-4">
            {/* Theme toggle button */}
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-full bg-gray-100 text-black hover:bg-gray-200 transition-colors"
              title="Switch to Dark Mode"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-sm font-medium">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">{userName || 'Harshit Dua'}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Main Feed - 3 columns */}
              <div className="lg:col-span-3 space-y-6">
                {/* Trending Today */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Trending Today
                    </h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      <Plus className="w-4 h-4" />
                      Create Community
                    </button>
                  </div>
                  
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {trendingTopics.map((topic, index) => (
                      <div key={index} className="flex-shrink-0 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-800 transition-colors">
                        <div className="text-xs text-gray-300 mb-1">{topic.category}</div>
                        <div>{topic.title}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Posts Feed */}
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex">
                        {/* Vote Section */}
                        <div className="flex flex-col items-center p-4 bg-gray-50 border-r border-gray-200">
                          <button className="p-1 rounded hover:bg-gray-200 transition-colors">
                            <ArrowUp className="w-5 h-5 text-gray-600" />
                          </button>
                          <span className="text-sm font-medium text-gray-900 my-1">{post.upvotes}</span>
                          <button className="p-1 rounded hover:bg-gray-200 transition-colors">
                            <ArrowDown className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                        
                        {/* Post Content */}
                        <div className="flex-1 p-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <span className="font-medium">{post.category}</span>
                            <span>•</span>
                            <span>Posted by {post.author}</span>
                            <span>•</span>
                            <span>{post.timeAgo}</span>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors">
                            {post.title}
                          </h3>
                          
                          {post.content && (
                            <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                              {post.content}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <button className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                              <MessageSquare className="w-4 h-4" />
                              <span>{post.comments} Comments</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                              <Share className="w-4 h-4" />
                              <span>Share</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Sidebar - Popular Communities */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Communities</h3>
                  
                  <div className="space-y-4">
                    {popularCommunities.map((community, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">{community.avatar}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{community.name}</div>
                          <div className="text-sm text-gray-600">{community.members}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    See More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
