import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar.jsx";
import { Search, Settings, Bell, ChevronDown, FileText, Plus } from "lucide-react";
import { API_ENDPOINTS } from "../config";
import axios from "axios";

export default function InventoryLight() {
  const [userName, setUserName] = useState("Student"); // Default fallback
  const navigate = useNavigate();

  // Fetch user name from backend
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        // First try to get from localStorage
        const storedUserName = localStorage.getItem("userName");
        if (storedUserName) {
          setUserName(storedUserName);
        }

        // Then fetch from API for most up-to-date info
        const response = await axios.get(API_ENDPOINTS.AUTH_STATUS, {
          withCredentials: true
        });
        if (response.data.authenticated && response.data.user) {
          const name = response.data.user.name || storedUserName || "Student";
          setUserName(name);
        }
      } catch (error) {
        console.error("Failed to get user info:", error);
        // Keep the localStorage value or default
        const storedUserName = localStorage.getItem("userName");
        if (storedUserName) {
          setUserName(storedUserName);
        }
      }
    };
    getUserInfo();
  }, []);

  // Theme toggle handler
  const handleToggleTheme = () => {
    navigate("/inventory-dark");
  };

  // Sample notes data based on the reference image
  const [notesData] = useState([
    {
      id: 1,
      title: "Robotics Dynamics",
      subtitle: "Notes • Projection",
      type: "notes",
      hasContent: true
    },
    {
      id: 2,
      title: "Robotics Dynamics",
      subtitle: "Notes • Projection",
      type: "notes",
      hasContent: true
    },
    {
      id: 3,
      title: "Robotics Dynamics",
      subtitle: "Notes • Projection",
      type: "notes",
      hasContent: true
    },
    {
      id: 4,
      title: "Stress Analysis",
      subtitle: "Tutorial • Tut Sheet 1",
      type: "tutorial",
      hasContent: true
    },
    {
      id: 5,
      title: "UI/UX Design",
      subtitle: "Assignment • 1st Ch",
      type: "assignment",
      hasContent: true
    },
    {
      id: 6,
      title: "New Folder",
      subtitle: "Empty",
      type: "folder",
      hasContent: false
    },
    {
      id: 7,
      title: "New Folder",
      subtitle: "Empty",
      type: "folder",
      hasContent: false
    },
    {
      id: 8,
      title: "New Folder",
      subtitle: "Empty",
      type: "folder",
      hasContent: false
    },
    {
      id: 9,
      title: "New Folder",
      subtitle: "Empty",
      type: "folder",
      hasContent: false
    },
    {
      id: 10,
      title: "New Folder",
      subtitle: "Empty",
      type: "folder",
      hasContent: false
    },
    {
      id: 11,
      title: "New Folder",
      subtitle: "Empty",
      type: "folder",
      hasContent: false
    },
    {
      id: 12,
      title: "New Folder",
      subtitle: "Empty",
      type: "folder",
      hasContent: false
    }
  ]);

  const renderNoteLines = (hasContent) => {
    if (!hasContent) return null;
    
    return (
      <div className="space-y-1 mb-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-0.5 bg-gray-300 rounded"></div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-white text-gray-900">
      <Sidebar isDarkMode={false} />
      <div className="flex-1 flex flex-col transition-all duration-300 ml-64">
        {/* Top Header */}
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
            {/* Moon icon toggle button - left of settings */}
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
                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">{userName}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                New Folder
              </button>
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {notesData.map((note) => (
                <div
                  key={note.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  {/* Note Content Area */}
                  <div className="h-32 mb-4 bg-white rounded border border-gray-200 p-3 relative overflow-hidden">
                    {note.hasContent ? (
                      renderNoteLines(true)
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FileText className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Note Info */}
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {note.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {note.subtitle}
                    </p>
                  </div>

                  {/* Hover Actions */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2">
                    <button className="p-1 rounded bg-white shadow-sm border border-gray-200 hover:bg-gray-50">
                      <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
