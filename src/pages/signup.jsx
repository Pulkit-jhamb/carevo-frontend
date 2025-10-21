import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config";

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log(`📝 Field updated: ${e.target.name} = "${e.target.value}"`);
    console.log("📋 Current form state:", { email: form.email, password: form.password });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    console.log("🚀 Form submitted!");
    console.log("📋 Form data at submit:", form);

    try {
      console.log("🚀 Attempting signup with:", { email: form.email, password: "***hidden***" });
      console.log("🔗 API Endpoint:", API_ENDPOINTS.SIGNUP);
      console.log("📤 Request payload:", JSON.stringify({
        email: form.email,
        password: form.password ? "***filled***" : "empty"
      }));
      
      // Send only email and password - all other data will be collected in onboarding
      const response = await axios.post(API_ENDPOINTS.SIGNUP, {
        email: form.email,
        password: form.password
      });

      console.log("✅ Signup successful:", response.data);
      
      setSuccess("Account created successfully! Setting up your profile...");
      
      // Store email for onboarding process
      localStorage.setItem("signupEmail", form.email);
      
      // Redirect directly to onboarding after 1 second
      setTimeout(() => {
        navigate("/onboarding");
      }, 1000);

    } catch (error) {
      console.error("❌ Signup error:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError(`Signup failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Google signup handler - COMMENTED OUT
  // const handleGoogleSignup = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   console.log("Google signup clicked");
  //   alert("Google signup coming soon! Please use email signup for now.");
  // };

  const handleNavigateToLogin = () => {
    console.log("Navigate to login");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white relative">
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
      {/* Top Logo */}
      <div className="pt-14 flex flex-col items-center">
        <h1 className="text-xl font-semibold text-black tracking-wide mb-16"></h1>
        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-sm">
            <br /><br />
            <h2 className="text-2xl font-bold text-black text-center mb-8">Create an account</h2>
            {/* Google Sign Up - COMMENTED OUT TO FIX FORM VALIDATION ISSUES */}
            {/*
            <button
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-colors mb-6"
              type="button"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-700 font-medium">Sign up with Google</span>
            </button>
            <div className="border-t border-gray-200 mb-6"></div>
            */}
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="Email"
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                    placeholder="Password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              {success && <div className="text-green-600 text-sm text-center">{success}</div>}
              
              {/* Debug section - Remove after testing */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs bg-gray-100 p-2 rounded">
                  <div>Debug: Email="{form.email}" ({form.email?.length || 0} chars)</div>
                  <div>Debug: Password="{form.password ? '***filled***' : 'empty'}" ({form.password?.length || 0} chars)</div>
                  <button 
                    type="button"
                    onClick={() => {
                      console.log("🧪 Test form data:", form);
                      setError("");
                      setSuccess("Test: Form data captured successfully!");
                    }}
                    className="mt-1 px-2 py-1 bg-blue-500 text-white text-xs rounded"
                  >
                    Test Form Data
                  </button>
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 rounded-xl font-semibold mt-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Account..." : "Sign up"}
              </button>
            </form>
            <div className="text-center mt-6 text-sm">
              <span className="text-gray-600">Already registered? </span>
              <button
                className="text-black font-medium hover:underline bg-transparent border-none p-0"
                onClick={handleNavigateToLogin}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="w-full py-6 mt-10">
        <div className="text-center text-xs text-gray-400">
          By continuing, you agree to our{" "}
          <button className="underline hover:text-gray-600 bg-transparent border-none p-0 text-xs">Terms of Service</button> and{" "}
          <button className="underline hover:text-gray-600 bg-transparent border-none p-0 text-xs">Privacy Policy</button>.
        </div>
      </footer>
    </div>
  );
}