"use client";
import React from "react";

import { User, Calendar, Cpu, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProgressBar from "@ramonak/react-progress-bar";
import { useSession } from "next-auth/react";

const Welcome = () => {
  const { data: session } = useSession();

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
              <div>
                <h1 className="text-3xl font-medium text-gray-800 mb-3">
                  Let's setup your planner with your semester routine
                </h1>

                {/* Steps */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-gray-600" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      Connect your Calendars
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Upload className="w-6 h-6 text-gray-600" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      Upload your Documents
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Cpu className="w-6 h-6 text-gray-600" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      Let AI schedule your Study Sessions
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="flex justify-center">
              <div className="bg-gradient-to-b rounded-xl p-2 mb-3">
                <Image
                  src="/media/home_image.svg"
                  alt="image"
                  height={380}
                  width={380}
                />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3 mt-6">
            <ProgressBar
              completed={20}
              animateOnRender
              customLabel=" "
              height="8px"
              bgColor="#9333ea"
              baseBgColor="#e5e7eb"
            />
          </div>

          {/* Continue Button */}
          <div className="flex justify-end mt-8">
            <Link
              href="/onboarding/user/connect"
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

export default Welcome;
