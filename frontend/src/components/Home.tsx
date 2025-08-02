"use client"
import React from 'react'
import { Upload, Clock, Calendar, CheckSquare, RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createGoogleCalendarEvent } from '@/lib/helpers';

const Home = () => {
  return (
    <>
    <div className="mt-20 ">
        <div className="h-max bg-gradient-to-br from-gray-50 to-gray-100 p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-20">
              <div className="flex-1 space-y-8">
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                    Let AI Schedule,
                    <br />
                    <span className="text-purple-600">You Succeed</span>
                  </h1>
                  <p className="text-xl text-gray-600 max-w-md">
                    #1 app for students to schedule their semester
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-6 ">
                  <Link
                    href="/signup"
                    className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </Link>

                  <div className="flex items-center gap-4">
                    <span className="text-gray-600 font-medium">
                      Connect with:
                    </span>
                    <div className="flex gap-3">
                      <div className="text-white px-3 py-2 rounded-lg text-sm font-medium">
                        <Image
                          src={"/media/google-calendar.png"}
                          alt="Google"
                          width={80}
                          height={80}
                          className="inline-block mr-1"
                        />
                      </div>
                      <div className="text-black px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1">
                        <Image
                          src={"/media/notion.png"}
                          width={32}
                          height={32}
                          alt="Notion"
                        />{" "}
                        Notion
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 max-w-2xl hidden md:block">
                <div className="bg-white rounded-2xl shadow-2xl p-6 relative">
                  <Image
                    src={"/media/home_image.svg"}
                    alt="Schedule Preview"
                    width={600}
                    height={520}
                    className="h-[425px] w-full"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-4xl mx-auto">
              {[
                { icon: Upload, label: "Upload", color: "text-blue-500" },
                { icon: Clock, label: "Wait", color: "text-gray-500" },
                {
                  icon: Calendar,
                  label: "Get Schedule",
                  color: "text-purple-500",
                },
                {
                  icon: CheckSquare,
                  label: "Add Task",
                  color: "text-green-500",
                },
                {
                  icon: RotateCcw,
                  label: "Reschedule",
                  color: "text-orange-500",
                },
              ].map((feature, index) => (
                <div
                  key={feature.label}
                  className="flex flex-col items-center text-center space-y-3 group"
                >
                  <div
                    className={`p-4 rounded-xl bg-gray-50 group-hover:bg-gray-100 transition-colors ${feature.color}`}
                  >
                    <feature.icon size={32} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* <button
            onClick={createGoogleCalendarEvent}
            className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold "
          >
            Create Event
          </button> */}
        </div>
      </div>
    </>
  )
}

export default Home
