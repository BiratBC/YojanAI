"use client";
import React, { useState } from "react";
import { User, Clock, Calendar, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProgressBar from "@ramonak/react-progress-bar";
import { useSession } from "next-auth/react";

// Define types for preferences
interface Preferences {
  totalHours: string;
  studyDuration: string;
  breakDuration: string;
  preferredTime: string;
}

const PreferencesPage = () => {
  const { data: session, status } = useSession();
  
  // Form state with proper typing
  const [preferences, setPreferences] = useState<Preferences>({
    totalHours: "",
    studyDuration: "",
    breakDuration: "",
    preferredTime: "None"
  });

  // Fix: Add proper types for function parameters
  const handleInputChange = (field: keyof Preferences, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const timeOptions = ["None", "Morning", "Afternoon", "Evening", "Night"];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="mb-8">
          <Image src="/icons/logo.png" width={150} height={150} alt="logo" />
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 relative">
          {/* Header with User Icon */}
          <div className="flex justify-end items-start mb-6">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              {session?.user?.image ? (
                <img
                  className="rounded-full"
                  src={session.user.image}
                  height={48}
                  width={48}
                  alt="user-profile"
                />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Side - Form Content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-medium text-gray-800 mb-4">
                  How about you tell us your study preference?
                </h1>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Estimated total hours per week */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated total hours per week
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={preferences.totalHours}
                      onChange={(e) => handleInputChange('totalHours', e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-20"
                      placeholder="40"
                    />
                    <span className="text-sm text-gray-600">hours</span>
                  </div>
                </div>

                {/* Split your Study session */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Split your Study session
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        For duration
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={preferences.studyDuration}
                          onChange={(e) => handleInputChange('studyDuration', e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-16"
                          placeholder="25"
                        />
                        <span className="text-xs text-gray-600">mins</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Rest duration
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={preferences.breakDuration}
                          onChange={(e) => handleInputChange('breakDuration', e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-16"
                          placeholder="5"
                        />
                        <span className="text-xs text-gray-600">mins</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ideal times of day for study */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Ideal times of day for study (Optional)
                  </label>
                  <div className="relative">
                    <select
                      value={preferences.preferredTime}
                      onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                    >
                      {timeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Visual Illustration */}
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-8 w-full max-w-md">
                <div className="text-white space-y-6">
                  <div className="text-center">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <h3 className="text-xl font-semibold mb-2">Personalized Study Plan</h3>
                    <p className="opacity-90 text-sm">
                      We'll create a custom study schedule based on your preferences
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className="text-sm">Optimal study sessions</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <span className="text-sm">Smart scheduling</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <span className="text-sm">Better focus & retention</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-4 mt-8">
            <ProgressBar
              completed={60}
              animateOnRender
              customLabel=" "
              height="10px"
              bgColor="#9333ea"
              baseBgColor="#e5e7eb"
            />
          </div>

          {/* Continue Button */}
          <div className="flex justify-end mt-8">
            <Link
              href="/onboarding/user/upload"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-xl transition-colors"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;