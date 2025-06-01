"use client";
import React from "react";

import { useSearchParams } from "next/navigation";
import { User, Calendar, Cpu, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Welcome = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          <div className="mb-8">
            <Image src="/icons/logo.png" width={150} height={150} alt="logo" />
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 relative h-150">
            {/* Header with Logo and User Icon */}
            <div className="flex justify-end items-start mb-6">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Side - Content */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-medium text-gray-800 mb-8">
                    Let's setup your planner with your semester routine
                  </h1>

                  {/* Steps */}
                  <div className="space-y-6">
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
                <div className="bg-gradient-to-b rounded-xl p-2 mb-4">
                  <Image
                    src="/media/home_image.svg"
                    alt="image"
                    height={600}
                    width={500}
                  />
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-4 mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full w-1/6"></div>
              </div>
            </div>
            {/* Continue Button */}
            <div className="flex justify-end mt-8">
              <Link href="/onboarding/user/connect" className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-xl transition-colors" >
                Continue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
