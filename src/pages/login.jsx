import React, { useState } from "react";
import carevoLogo from "../assets/carevo_logo_clean.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const res = await axios.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      if (res.status === 200) {
        localStorage.setItem("userEmail", email);
        setError("");
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f9fb] via-[#e0e7ef] to-[#c7d2fe] font-sans relative">
      <button
        className="absolute top-8 left-8 text-black text-4xl font-extrabold focus:outline-none bg-transparent p-0 m-0 z-20 hover:text-gray-700 transition-all duration-200"
        onClick={() => navigate("/")}
        aria-label="Back to home"
        style={{ background: "none", border: "none", boxShadow: "none" }}
      >
        &larr;
      </button>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 flex flex-col items-center">
        <img src={carevoLogo} alt="Carevo Logo" className="w-20 h-20 mb-4" />
        <h2 className="text-3xl font-extrabold text-black mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-6 text-center">Login to your Carevo account</p>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-base bg-gray-50"
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-base bg-gray-50"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl font-semibold text-base shadow hover:bg-gray-900 transition mb-2"
          >
            Login
          </button>
        </form>
        <div className="text-sm text-center mt-2">
          <span className="text-gray-500">Don't have an account? </span>
          <a href="/signup" className="text-black font-semibold hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
