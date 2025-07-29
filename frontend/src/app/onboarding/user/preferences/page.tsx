"use client";
import React, { useState, useEffect } from "react";
import { User, Clock, Calendar, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ProgressBar from "@ramonak/react-progress-bar";
import { useSession } from "next-auth/react";
import { Preferences } from "@/lib/types";

const PreferencesPage = () => {
  const { data: session, status } = useSession();
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const timeOptions = ["None", "Morning", "Afternoon", "Evening", "Night"]; 
  
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

  useEffect(() => {
    if (preferences.totalHours !== "" && preferences.studyDuration !== "" && preferences.breakDuration !== ""){
      setButtonEnabled(true)
    }
  }, [preferences])
  


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-3">
      <div className="max-w-5xl w-full">
        <div className="mb-4">
          <Image src="/icons/logo.png" width={120} height={120} alt="logo" />
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 relative">
          {/* Header with User Icon */}
          <div className="flex justify-end items-start mb-4">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              {session?.user?.image ? (
                <img
                  className="rounded-full"
                  src={session.user.image}
                  height={40}
                  width={40}
                  alt="user-profile"
                />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left Side - Form Content */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-medium text-gray-800 mb-3">
                  How about you tell us your study preference?
                </h1>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <div className="bg-gradient-to-b rounded-xl p-2 mb-3">
                <Image
                  src="/media/Schedule.gif"
                  alt="Home Setup Illustration"
                  height={380}
                  width={380}
                />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3 mt-6">
            <ProgressBar
              completed={60}
              animateOnRender
              customLabel=" "
              height="8px"
              bgColor="#9333ea"
              baseBgColor="#e5e7eb"
            />
          </div>

          {/* Continue Button */}

          <div className="flex justify-end mt-4">
            <Link
              href="/onboarding/user/upload"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors"
            >
              Continue
            </Link>

          <div className="flex justify-end mt-8">
            {buttonEnabled ? (
              <>
                <button
                  onClick={() => {
                    window.location.href = "/onboarding/user/finishSetup";
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-xl transition-colors cursor-pointer"
                >
                  Continue
                </button>{" "}
              </>
            ) : (
              <>
                <button
                  disabled
                  onClick={() => {
                    window.location.href = "/onboarding/user/finishSetup";
                  }}
                  className="bg-gray-400 text-white font-medium py-3 px-8 rounded-xl transition-colors cursor-not-allowed"
                >
                  Continue
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default PreferencesPage;