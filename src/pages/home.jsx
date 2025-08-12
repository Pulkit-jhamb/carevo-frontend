import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';
import Sidebar from './sidebar.jsx'; // Import the new Sidebar component
import { 
  UserPlus,
  Brain,
  MessageCircle,
  TrendingUp,
  Target,
  BarChart3,
  Lightbulb,
  ChevronRight,
  MessageSquare
} from 'lucide-react';

const CarevoHomepage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userProgress, setUserProgress] = useState(25); // This could come from API

  // Get user info on component mount
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS, {
          withCredentials: true
        });
        if (response.data.authenticated && response.data.user) {
          setUserName(response.data.user.name || "User");
        }
      } catch (error) {
        console.error("Failed to get user info:", error);
        navigate("/login");
      }
    };
    getUserInfo();
  }, [navigate]);

  // Feature cards with functional navigation
  const featureCards = [
    {
      icon: UserPlus,
      title: 'Complete Your Profile',
      description: 'Add your skills, interests, and career goals to get personalized recommendations.',
      duration: '5-10 min',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      onClick: () => navigate('/dashboard') // Navigate to profile section
    },
    {
      icon: Brain,
      title: 'Take Quiz',
      description: 'Discover your strengths, interests, and potential career paths with our comprehensive assessment.',
      duration: '15-20 min',
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      onClick: () => navigate('/quiz')
    },
    {
      icon: MessageCircle,
      title: 'Ask AI Assistant About Career Decisions',
      description: 'Get instant answers to your career questions from our intelligent AI counselor.',
      duration: '2-5 min',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      onClick: () => navigate('/chat')
    },
    {
      icon: Target,
      title: 'Career Path Recommendations',
      description: 'Get AI-powered suggestions for 3 personalized career paths based on your profile and quiz results.',
      duration: '10-15 min',
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      onClick: () => navigate('/chat') // Could navigate to specific career recommendations
    },
    {
      icon: TrendingUp,
      title: 'Trending Careers',
      description: 'Explore high-demand jobs and emerging career opportunities in today\'s market.',
      duration: '5-10 min',
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      onClick: () => navigate('/dashboard') // Could navigate to trends section
    },
    {
      icon: BarChart3,
      title: 'Your Progress',
      description: 'Track your completion of profile setup, quiz, and other career development activities.',
      duration: '2-3 min',
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      onClick: () => navigate('/dashboard') // Navigate to progress tracking
    }
  ];

  // Quick actions with functional navigation
  const quickActions = [
    {
      icon: Lightbulb,
      title: 'Daily Career Tip',
      description: 'Get personalized career advice and insights to help you grow professionally.',
      duration: '1-2 min',
      onClick: () => navigate('/chat')
    },
    {
      icon: MessageSquare,
      title: 'Quick Career Question',
      description: 'Ask a specific question about your career journey and get instant AI guidance.',
      onClick: () => navigate('/chat')
    }
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content */}
      <div className={`flex-1 overflow-auto transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'} bg-white`}>
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Hi {userName}, how can I help you?
            </h1>
            <p className="text-lg text-gray-600">
              I'm here to assist you with academic guidance, career planning, and more.
            </p>
          </div>

          {/* Main Feature Cards */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Get Started</h2>
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                See all <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureCards.map((card, index) => (
                <div
                  key={index}
                  onClick={card.onClick}
                  className={`${card.bgColor} ${card.borderColor} border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 group`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${card.color} p-3 rounded-lg`}>
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600 font-medium">
                      {card.duration}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
              <button 
                onClick={() => navigate('/chat')}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                See all <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  onClick={action.onClick}
                  className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-gray-300 group"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-100 p-2 rounded-lg mr-4">
                      <action.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
                        {action.title}
                      </h3>
                      {action.duration && (
                        <span className="text-xs text-gray-500">{action.duration}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {action.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Section */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Your Journey Progress</h3>
              <span className="text-sm text-blue-600 font-medium">{userProgress}% Complete</span>
            </div>
            <div className="w-full bg-white rounded-full h-3 mb-4">
              <div className="bg-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: `${userProgress}%` }}></div>
            </div>
            <p className="text-sm text-gray-600">
              Complete your profile and take the career quiz to unlock personalized recommendations.
            </p>
            <div className="mt-4 flex gap-3">
              <button 
                onClick={() => navigate('/quiz')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Take Quiz
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Complete Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarevoHomepage;