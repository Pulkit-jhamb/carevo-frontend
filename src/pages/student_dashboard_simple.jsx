import React, { useState } from "react";
import Sidebar from "./sidebar";

export default function StudentDashboardSimple() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className="flex min-h-screen bg-white text-gray-900">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isDarkMode={isDarkMode} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Toggle Theme
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Stats Cards */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">About</h3>
              <div className="text-2xl font-bold text-gray-900">Student</div>
              <div className="text-sm text-gray-600">School Student</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Classes</h3>
              <div className="text-2xl font-bold text-gray-900">965</div>
              <div className="text-sm text-green-600">+45 from yesterday</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Attended</h3>
              <div className="text-2xl font-bold text-gray-900">128</div>
              <div className="text-sm text-red-600">-18 from yesterday</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Percentage</h3>
              <div className="text-2xl font-bold text-gray-900">85%</div>
              <div className="text-sm text-green-600">+2% from yesterday</div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student Report */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Student Report</h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">Month</button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">Year</button>
                  </div>
                </div>
                
                <div className="h-64 flex items-center justify-center">
                  <div className="text-gray-500">Chart will be displayed here</div>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Calendar</h3>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {new Date().toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                </div>
                <div className="text-lg text-gray-600">
                  Today: {new Date().getDate()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
