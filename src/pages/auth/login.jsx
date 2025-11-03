import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      console.log("🔍 Full login response:", response.data);

      // Check for different possible success indicators
      if (response.data.success || response.data.token || response.status === 200) {
        // Store authentication data
        const token = response.data.token || response.data.authToken || response.data.access_token;
        const user = response.data.user || response.data;
        
        if (token) {
          localStorage.setItem("authToken", token);
        }
        if (user.email) {
          localStorage.setItem("userEmail", user.email);
        }
        if (user.name) {
          localStorage.setItem("userName", user.name);
        }
        localStorage.setItem("userType", user.studentType || user.userType || user.user_type || "school");

        console.log("✅ Login successful!");
        console.log("📧 User email:", user.email);
        console.log("👤 User name:", user.name);
        console.log("🎓 User type:", user.studentType || user.userType || user.user_type || "school");
        console.log("🔐 Token stored:", !!token);
        console.log("📋 Onboarding complete:", user.isOnboardingComplete);
        
        // Use the backend's isOnboardingComplete flag to determine routing
        const needsOnboarding = !user.isOnboardingComplete;
        
        if (needsOnboarding) {
          console.log("🎯 New user detected (onboarding incomplete) - redirecting to onboarding...");
          // Add a small delay to ensure localStorage is updated
          setTimeout(() => {
            window.location.href = "/onboarding";
          }, 100);
        } else {
          console.log("🔄 Existing user (onboarding complete) - redirecting to dashboard...");
          // Add a small delay to ensure localStorage is updated
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 100);
        }
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login clicked`);
    // Implement social login logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-sans relative">
      {/* Back Button */}
      <button
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 transition"
        onClick={() => navigate("/")}
        aria-label="Back to landing"
        type="button"
      >
        <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="w-full max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-black"></h1>
        </div>

        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black mb-2">Welcome back</h2>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleSocialLogin('Google')}
            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-gray-700 font-medium">Sign in with Google</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
              placeholder="Email"
              autoComplete="email"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-gray-900 placeholder-gray-500 pr-12"
              placeholder="Password"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showPassword ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                )}
              </svg>
            </button>
            
            {/* Forgot Password Link */}
            <div className="absolute right-0 -bottom-6">
              <button className="text-sm text-gray-500 hover:text-gray-700 bg-transparent border-none p-0">
                Forgot your password?
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}

          {/* Sign In Button */}
          <div className="pt-6">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6" >
          <span className="text-gray-600">Don't have an account? </span>
          <button
            className="text-black font-medium hover:underline bg-transparent border-none p-0"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}