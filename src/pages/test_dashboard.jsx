import React from "react";

export default function TestDashboard() {
  console.log("🧪 TestDashboard rendering");

  return (
    <div className="min-h-screen bg-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">
          🧪 Test Dashboard - This Should Work!
        </h1>
        
        <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Debug Information
          </h2>
          <div className="space-y-2 text-sm">
            <p><strong>Current Time:</strong> {new Date().toLocaleString()}</p>
            <p><strong>User Type:</strong> {localStorage.getItem("userType") || "Not set"}</p>
            <p><strong>User Email:</strong> {localStorage.getItem("userEmail") || "Not set"}</p>
            <p><strong>Auth Token:</strong> {localStorage.getItem("authToken") ? "Present" : "Not set"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">✅ Component Loaded</h3>
            <p className="text-green-600">React component is rendering successfully</p>
          </div>
          
          <div className="bg-yellow-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800">⚠️ Check Console</h3>
            <p className="text-yellow-600">Look for any error messages in browser console</p>
          </div>
          
          <div className="bg-purple-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800">🔧 Next Steps</h3>
            <p className="text-purple-600">If you see this, routing is working</p>
          </div>
        </div>

        <div className="mt-8 bg-gray-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="flex gap-4">
            <button 
              onClick={() => window.location.href = '/student-dashboard-simple'}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Simple Dashboard
            </button>
            <button 
              onClick={() => window.location.href = '/college-dashboard-light'}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Go to College Dashboard
            </button>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Storage & Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
