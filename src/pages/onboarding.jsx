import React, { useState } from "react";
import { ChevronDown, MapPin, Calendar, User, Users, Globe } from "lucide-react";

export default function StudentOnboardingForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    studentClass: "",
    schoolName: "",
    subjects: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return { ...prev, subjects: [...prev.subjects, value] };
      } else {
        return { ...prev, subjects: prev.subjects.filter((sub) => sub !== value) };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleBack = () => {
    console.log("Go back");
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Header with back arrow */}
      <div className="pt-4 pb-2 px-8">
        <button onClick={handleBack} className="text-gray-600 hover:text-gray-800">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="flex justify-center items-center mb-6">
        <div className="flex items-center">
          {/* Step 1 - Completed */}
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs mt-1 text-gray-600">Welcome</p>
          </div>
          
          {/* Connector line */}
          <div className="w-16 h-0.5 bg-teal-600 mx-3"></div>
          
          {/* Step 2 - Current */}
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <p className="text-xs mt-1 text-gray-900 font-medium text-center">Share career goals and<br />experience</p>
          </div>
          
          {/* Connector line */}
          <div className="w-16 h-0.5 bg-gray-300 mx-3"></div>
          
          {/* Step 3 - Future */}
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            <p className="text-xs mt-1 text-gray-600 text-center">Track your career readiness</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 max-w-md mx-auto px-8 pb-4">
        <h1 className="text-xl font-semibold mb-2 text-gray-900">
          Let's start with your background information.
        </h1>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          Please provide your details to help us serve you better. These are optional and can be updated.
        </p>

        {/* Dots indicator */}
        <div className="flex justify-center mb-4">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
            <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
            <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        <div className="space-y-3">
          {/* Full Name */}
          <div>
            <div className="block text-gray-900 text-sm font-medium mb-2">Student's Full Name</div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Class */}
          <div>
            <div className="block text-gray-900 text-sm font-medium mb-2">Class</div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                name="studentClass"
                value={formData.studentClass}
                onChange={handleChange}
                className="w-full pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
              >
                <option value="">Select your class</option>
                {["6th", "7th", "8th", "9th", "10th", "11th", "12th"].map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          {/* School Name */}
          <div>
            <div className="block text-gray-900 text-sm font-medium mb-2">School Name</div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                placeholder="Enter your school name"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Subjects */}
          <div>
            <div className="block text-gray-900 text-sm font-medium mb-2">Subjects</div>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              {["Math", "Science", "English", "Social Studies", "Computer Science", "Hindi"].map(
                (subject) => (
                  <label key={subject} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      value={subject}
                      checked={formData.subjects.includes(subject)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-gray-700">{subject}</span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Continue Button */}
          <div className="pt-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-teal-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}