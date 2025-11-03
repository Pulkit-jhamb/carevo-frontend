import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config';

import axios from 'axios';

import CollegeSidebarDark from './sidebar_college_dark';

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

export default function CommunityDark() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  // Theme toggle handler
  const handleToggleTheme = () => {
    navigate("/community");
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
    <div className="flex bg-black min-h-screen">
      <CollegeSidebarDark isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <div className="bg-black border-b border-gray-700 px-8 py-5 flex items-center justify-between">
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
            <div className="flex items-center gap-2 px-3 py-2 bg-black cursor-pointer hover:bg-black">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
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
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Main Feed - 3 columns */}
              <div className="lg:col-span-3 space-y-6">
                {/* Trending Today */}
                <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
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
                      <div key={index} className="flex-shrink-0 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-700 transition-colors">
                        <div className="text-xs text-gray-400 mb-1">{topic.category}</div>
                        <div>{topic.title}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Posts Feed */}
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="flex">
                        {/* Vote Section */}
                        <div className="flex flex-col items-center p-4 bg-gray-800 border-r border-gray-700">
                          <button className="p-1 rounded hover:bg-gray-700 transition-colors">
                            <ArrowUp className="w-5 h-5 text-gray-400" />
                          </button>
                          <span className="text-sm font-medium text-white my-1">{post.upvotes}</span>
                          <button className="p-1 rounded hover:bg-gray-700 transition-colors">
                            <ArrowDown className="w-5 h-5 text-gray-400" />
                          </button>
                        </div>
                        
                        {/* Post Content */}
                        <div className="flex-1 p-4">
                          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                            <span className="font-medium">{post.category}</span>
                            <span>•</span>
                            <span>Posted by {post.author}</span>
                            <span>•</span>
                            <span>{post.timeAgo}</span>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-white mb-2 cursor-pointer hover:text-blue-400 transition-colors">
                            {post.title}
                          </h3>
                          
                          {post.content && (
                            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                              {post.content}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <button className="flex items-center gap-1 hover:text-white transition-colors">
                              <MessageSquare className="w-4 h-4" />
                              <span>{post.comments} Comments</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-white transition-colors">
                              <Share className="w-4 h-4" />
                              <span>Share</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-white transition-colors">
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
                <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Popular Communities</h3>
                  
                  <div className="space-y-4">
                    {popularCommunities.map((community, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">{community.avatar}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white">{community.name}</div>
                          <div className="text-sm text-gray-400">{community.members}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full mt-4 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
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
