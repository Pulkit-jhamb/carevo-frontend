import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [conclusion, setConclusion] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [qualities, setQualities] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

        fetch(`http://localhost:5001/user?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setConclusion(data.conclusion || "");
        setRecommendations(data.recommendations || []);
        setQualities(data.qualities ? [...data.qualities].sort((a, b) => b.value - a.value) : []);
      })
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f9fb] via-[#e0e7ef] to-[#c7d2fe] text-black font-sans">
      <div className="animate-dashboard-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold text-left px-8 pt-8 mb-6">
          Dashboard
        </h1>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
          {/* LEFT: User Details */}
          <div className="border border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center bg-white shadow animate-dashboard-block-fade-in delay-0">
            <div className="w-32 h-32 rounded-full border-2 border-black flex items-center justify-center text-4xl font-bold bg-gray-100 mb-2">
              <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="38" r="20" stroke="#22223B" strokeWidth="2" />
                <rect x="25" y="60" width="50" height="25" rx="10" stroke="#22223B" strokeWidth="2" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold">
              {user?.name || "Student Name"}
            </h2>
            <div className="mt-2 text-sm text-gray-700 space-y-1">
              {user?.studentType === "school" && (
                <>
                  <p className="font-medium">Class: {user?.class}</p>
                  <p>School: {user?.institute}</p>
                </>
              )}
              {user?.studentType === "college" && (
                <>
                  <p className="font-medium">Major: {user?.major}</p>
                  <p>Year: {user?.year}</p>
                  <p>Institute: {user?.institute}</p>
                </>
              )}
            </div>
          </div>

          {/* CONCLUSION */}
          <div className="md:col-span-2 border border-gray-200 rounded-2xl p-6 bg-white shadow animate-dashboard-block-fade-in delay-1">
            <h3 className="text-lg font-semibold mb-4">Conclusion</h3>
            <p className="text-sm text-gray-800 whitespace-pre-line">
              {conclusion || (
                <span className="italic text-gray-500">
                  Take the test to gain access to our insights.
                </span>
              )}
            </p>
          </div>

          {/* CAREER + QUALITIES */}
          <div className="md:col-span-3 flex flex-col md:flex-row gap-8 mt-8">
            {/* Recommendations */}
            <div className="flex-1 border border-gray-200 rounded-2xl p-6 bg-white shadow mb-8 md:mb-0 animate-dashboard-block-fade-in delay-2">
              <h3 className="text-lg font-semibold mb-2">Recommended Career Path</h3>
              {recommendations.length === 0 ? (
                <p className="text-sm text-gray-500 italic">
                  Take the test to gain access to our insights.
                </p>
              ) : (
                <ul className="list-disc pl-6 space-y-2 text-sm text-gray-800">
                  {recommendations.map((job, idx) => (
                    <li key={idx}>
                      <strong>{job}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Qualities - Bar Chart */}
            <div className="flex-1 border border-gray-200 rounded-2xl p-6 bg-white shadow flex flex-col items-center animate-dashboard-block-fade-in delay-3">
              <h3 className="text-lg font-semibold mb-2">Qualities</h3>
              {qualities.length === 0 ? (
                <p className="text-sm text-gray-500 italic text-center mt-[70px]">
                  Take the test to gain access to our insights.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart
                    data={qualities}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
                    barCategoryGap={32}
                  >
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fill: "#22223B", fontWeight: 600 }}
                      width={120}
                    />
                    <Tooltip />
                    <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={28}>
                      {qualities.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={["#22223B", "#44446B", "#66668B"][index % 3]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .animate-dashboard-fade-in {
          opacity: 0;
          transform: translateY(30px) scale(0.98);
          animation: dashboardFadeIn 0.8s cubic-bezier(0.4,0,0.2,1) 0.1s forwards;
        }
        @keyframes dashboardFadeIn {
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-dashboard-block-fade-in {
          opacity: 0;
          transform: translateY(30px) scale(0.98);
          animation: dashboardBlockFadeIn 0.7s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        .delay-0 { animation-delay: 0.15s; }
        .delay-1 { animation-delay: 0.35s; }
        .delay-2 { animation-delay: 0.55s; }
        .delay-3 { animation-delay: 0.75s; }
        @keyframes dashboardBlockFadeIn {
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
