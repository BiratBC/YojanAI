"use client";

import React from "react";
import Image from "next/image";
import { User } from "lucide-react";
import Link from "next/link";
import Router from "next/router";

const FinishSetup: React.FC = () => {
  const session: any = null; // Replace with actual session object

  const handleFinish = () => {
    console.log("Setup completed");
    // Navigate to dashboard or next page if needed
     //router.push('/dashboard')
    
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-3">
      <div className="max-w-6xl w-full">
        <div className="mb-8">
          <Image src="/icons/logo.png" width={120} height={120} alt="logo" />
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 relative">
          {/* Header with User Icon */}
          <div className="flex justify-end items-start mb-4">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center overflow-hidden">
              {session?.user?.image ? (
                <img
                  className="w-full h-full object-cover"
                  src={session.user.image}
                  alt="user-profile"
                />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-4">
              <h1 className="text-3xl font-medium text-gray-800 mb-3">
                Thank you for setting up your planner.
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Click finish to complete the setup and let AI make you an ideal schedule.
              </p>
            </div>

            {/* Right Side - Illustration */}
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
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full w-full transition-all duration-300"></div>
            </div>
          </div>

          {/* Finish Button */}
          <div className="flex justify-end mt-8">
            <button
              onClick={handleFinish}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-xl transition-colors"
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishSetup;
