import React from "react";
import { Calendar, User } from "lucide-react";
import Image from "next/image";

const Connect = () => {
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

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left Side - Content */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-medium text-gray-800 mb-8">
                    How about you connect your Notion and Google Calendar for
                    better access?
                  </h1>

                  {/* Connection Cards */}
                  <div className="grid md:grid-cols-2 gap-2">
                    {/* Notion Card */}
                    <div className="border-2 border-gray-200 rounded-xl p-4 text-center bg-gray-50">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Connect with Notion
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Create your own workspace by connecting to Notion
                      </p>
                      <button className="w-full bg-white border-2 border-gray-300 rounded-lg py-2 px-4 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center gap-2">
                        <div className="w-5 h-5 bg-black rounded text-white flex items-center justify-center text-xs font-bold">
                          N
                        </div>
                        Connect with Notion
                      </button>
                    </div>

                    {/* Google Calendar Card */}
                    <div className="border-2 border-gray-200 rounded-xl p-4 text-center bg-gray-50">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Connect with Google Calendar
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Access your routine from everywhere
                      </p>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 rounded-full"></div>
                        </div>
                        Connect with Google
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Illustration */}
              <div className="flex justify-center">
                <div className="bg-gradient-to-b rounded-xl w-80 h-64 flex items-center justify-center">
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
            <div className="space-y-4 mt-18">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full w-1/3"></div>
              </div>
            </div>
            {/* Continue Button */}
            <div className="flex justify-end mt-8">
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-xl transition-colors">
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Connect;
