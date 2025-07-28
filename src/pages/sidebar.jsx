import React from "react";
import { useLocation } from "react-router-dom";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Quiz",
    href: "/quiz",
  },
  {
    label: "AI Assistant",
    href: "/chat",
  },
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <aside className="fixed top-6 left-6 h-[92vh] w-64 bg-gradient-to-br from-white via-[#f7f9fb] to-[#e0e7ef] rounded-3xl shadow-2xl border border-gray-200 flex flex-col items-center py-8 z-40 transition-all duration-300">
      <div className="w-full flex flex-col items-center mb-8">
        {/* Carevo logo or icon */}
        <span className="text-3xl font-extrabold text-black mb-2 tracking-wide">carevo</span>
        <div className="w-12 h-1 rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2" />
      </div>
      <nav className="w-full flex-1 flex flex-col gap-6 items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <a
              key={item.label}
              href={item.href}
              className="w-5/6"
            >
              <button
                className={`w-full py-4 px-4 rounded-2xl border-2 font-semibold text-lg mb-2 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-black
                  ${isActive
                    ? 'bg-black text-white border-black scale-105'
                    : 'bg-white text-black border-gray-200 hover:border-black hover:bg-gray-50'}
                `}
              >
                {item.label}
              </button>
            </a>
          );
        })}
      </nav>
    </aside>
  );
} 