import React, { useState } from "react";
import carevoLogo from "../assets/carevo_logo_clean.png";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config";

const romanClasses = [
  { value: "I", label: "I" },
  { value: "II", label: "II" },
  { value: "III", label: "III" },
  { value: "IV", label: "IV" },
  { value: "V", label: "V" },
  { value: "VI", label: "VI" },
  { value: "VII", label: "VII" },
  { value: "VIII", label: "VIII" },
  { value: "IX", label: "IX" },
  { value: "X", label: "X" },
  { value: "XI", label: "XI" },
  { value: "XII", label: "XII" },
];

export default function Signup() {
  const [form, setForm] = useState({
    studentType: "school", // default to school
    email: "",
    password: "",
    name: "",
    institute: "",
    class: "",
    dob: "",
    degree: "",
    major: "",
    year: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStudentType = (type) => {
    setForm((prev) => ({
      ...prev,
      studentType: type,
      // Reset fields not relevant to the selected type
      class: type === "school" ? prev.class : "",
      degree: type === "college" ? prev.degree : "",
      major: type === "college" ? prev.major : "",
      year: type === "college" ? prev.year : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (form.studentType === "school") {
      if (!form.email || !form.password || !form.name || !form.institute || !form.class || !form.dob) {
        setError("Please fill in all fields.");
        return;
      }
    } else {
      if (!form.email || !form.password || !form.name || !form.institute || !form.degree || !form.major || !form.year || !form.dob) {
        setError("Please fill in all fields.");
        return;
      }
    }

    // Prepare data to send
    const payload = {
      studentType: form.studentType,
      email: form.email,
      password: form.password,
      name: form.name,
      institute: form.institute,
      dob: form.dob,
      ...(form.studentType === "school"
        ? { class: form.class }
        : { degree: form.degree, major: form.major, year: form.year }),
    };

    try {
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Signup failed.");
      } else {
        setSuccess("Signed up successfully!");
        setTimeout(() => navigate("/login", { replace: true }), 1500);
      }
    } catch (err) {
      setError("Server error. Please try again later.");
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
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-4 md:p-6 flex flex-col items-center">
        <img src={carevoLogo} alt="Carevo Logo" className="w-12 h-12 mb-2" />
        <h2 className="text-xl font-extrabold text-black mb-1">Create Your Account</h2>
        <p className="text-gray-500 mb-3 text-center text-sm">Sign up to get started with Carevo</p>
        <form className="w-full" onSubmit={handleSubmit}>
          {/* Toggle Switch */}
          <div className="flex justify-center mb-3 w-full">
            <button
              type="button"
              className={`px-3 py-1.5 rounded-l-xl font-semibold border border-gray-300 focus:outline-none transition-colors duration-200 text-xs ${
                form.studentType === "school"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => handleStudentType("school")}
            >
              School Student
            </button>
            <button
              type="button"
              className={`px-3 py-1.5 rounded-r-xl font-semibold border border-gray-300 border-l-0 focus:outline-none transition-colors duration-200 text-xs ${
                form.studentType === "college"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => handleStudentType("college")}
            >
              College Student
            </button>
          </div>

          {/* Common Fields */}
          <div className="mb-2">
            <label className="block text-gray-700 text-xs font-semibold mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-xs bg-gray-50"
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-xs font-semibold mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-xs bg-gray-50"
              placeholder="Create a password"
              autoComplete="new-password"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-xs font-semibold mb-1" htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-xs bg-gray-50"
              placeholder="Enter your name"
              autoComplete="name"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-xs font-semibold mb-1" htmlFor="institute">Institute</label>
            <input
              id="institute"
              name="institute"
              type="text"
              value={form.institute}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-xs bg-gray-50"
              placeholder="Enter your institute"
            />
          </div>

          {/* School Student Fields */}
          {form.studentType === "school" && (
            <>
              <div className="mb-2">
                <label className="block text-gray-700 text-xs font-semibold mb-1" htmlFor="class">Class</label>
                <select
                  id="class"
                  name="class"
                  value={form.class}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-xs bg-gray-50"
                  required
                >
                  <option value="">Select Class</option>
                  {romanClasses.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-xs font-semibold mb-1" htmlFor="dob">Date of Birth</label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-xs bg-gray-50"
                  placeholder="Enter your date of birth"
                />
              </div>
            </>
          )}

          {/* College Student Fields */}
          {form.studentType === "college" && (
            <>
              <div className="mb-2">
                <label className="block text-gray-700 text-xs font-semibold mb-1" htmlFor="degree">Degree</label>
                <input
                  id="degree"
                  name="degree"
                  type="text"
                  value={form.degree}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-xs bg-gray-50"
                  placeholder="Enter your degree"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-xs font-semibold mb-1" htmlFor="major">Major</label>
                <input
                  id="major"
                  name="major"
                  type="text"
                  value={form.major}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-xs bg-gray-50"
                  placeholder="Enter your major"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-xs font-semibold mb-1" htmlFor="year">Year</label>
                <input
                  id="year"
                  name="year"
                  type="text"
                  value={form.year}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-xs bg-gray-50"
                  placeholder="Enter your year"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-xs font-semibold mb-1" htmlFor="dob">Date of Birth</label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-xs bg-gray-50"
                  placeholder="Enter your date of birth"
                />
              </div>
            </>
          )}

          {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
          {success && <div className="text-green-600 text-xs mb-2">{success}</div>}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-xl font-semibold text-xs shadow hover:bg-gray-900 transition mb-1"
          >
            Sign Up
          </button>
        </form>
        <div className="w-full text-center mt-1">
          <span className="text-gray-500 text-xs">Already have an account? </span>
          <a href="/login" className="text-black font-semibold hover:underline text-xs">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}


