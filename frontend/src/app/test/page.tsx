"use client";
import React, { useState} from "react";
import { Calendar, Clock, BookOpen } from "lucide-react";
import { Session } from "@/lib/types";

const scheduleData: any = {
  Monday: {
    "06:00-07:00": {
      subject: "ENG 111",
      type: "study",
      color: "#93c5fd",
      credits: 3,
    },
    "07:00-08:00": {
      subject: "ENG 111",
      type: "study",
      color: "#93c5fd",
      credits: 3,
    },
    "08:00-09:00": {
      subject: "MATH 208",
      type: "study",
      color: "#fbbf24",
      credits: 3,
    },
    "09:00-16:00": {
      subject: "Class Time",
      type: "fixed",
      color: "#f87171",
      credits: 0,
    },
    "18:00-19:00": {
      subject: "COMP 202",
      type: "study",
      color: "#fef08a",
      credits: 3,
    },
    "19:00-20:00": {
      subject: "COMP 204",
      type: "study",
      color: "#f9a8d4",
      credits: 2,
    },
  },
  Tuesday: {
    "06:00-07:00": {
      subject: "MATH 207",
      type: "study",
      color: "#86efac",
      credits: 3,
    },
    "09:00-16:00": {
      subject: "Class Time",
      type: "fixed",
      color: "#f87171",
      credits: 0,
    },
    "17:00-18:00": {
      subject: "COMP 202",
      type: "study",
      color: "#fef08a",
      credits: 3,
    },
  },
  Wednesday: {
    "06:00-07:00": {
      subject: "MATH 208",
      type: "study",
      color: "#fbbf24",
      credits: 3,
    },
    "07:00-08:00": {
      subject: "ENG 111",
      type: "study",
      color: "#93c5fd",
      credits: 3,
    },
    "09:00-16:00": {
      subject: "Class Time",
      type: "fixed",
      color: "#f87171",
      credits: 0,
    },
    "17:00-18:00": {
      subject: "MATH 207",
      type: "study",
      color: "#86efac",
      credits: 3,
    },
    "18:00-19:00": {
      subject: "COMP 202",
      type: "study",
      color: "#fef08a",
      credits: 3,
    },
    "19:00-20:00": {
      subject: "COMP 204",
      type: "study",
      color: "#f9a8d4",
      credits: 2,
    },
  },
  Thursday: {
    "06:00-07:00": {
      subject: "MATH 207",
      type: "study",
      color: "#86efac",
      credits: 3,
    },
    "08:00-09:00": {
      subject: "ENG 111",
      type: "study",
      color: "#93c5fd",
      credits: 3,
    },
    "09:00-16:00": {
      subject: "Class Time",
      type: "fixed",
      color: "#f87171",
      credits: 0,
    },
    "17:00-18:00": {
      subject: "MATH 208",
      type: "study",
      color: "#fbbf24",
      credits: 3,
    },
    "20:00-21:00": {
      subject: "COMP 204",
      type: "study",
      color: "#f9a8d4",
      credits: 2,
    },
  },
  Friday: {
    "06:00-07:00": {
      subject: "COMP 202",
      type: "study",
      color: "#fef08a",
      credits: 3,
    },
    "07:00-08:00": {
      subject: "MATH 208",
      type: "study",
      color: "#fbbf24",
      credits: 3,
    },
    "09:00-16:00": {
      subject: "Class Time",
      type: "fixed",
      color: "#f87171",
      credits: 0,
    },
    "18:00-19:00": {
      subject: "ENG 111",
      type: "study",
      color: "#93c5fd",
      credits: 3,
    },
  },
  Saturday: {
    "10:00-11:00": {
      subject: "MATH 207",
      type: "study",
      color: "#86efac",
      credits: 3,
    },
    "11:00-12:00": {
      subject: "COMP 202",
      type: "study",
      color: "#fef08a",
      credits: 3,
    },
    "14:00-15:00": {
      subject: "COMP 204",
      type: "study",
      color: "#f9a8d4",
      credits: 2,
    },
    "15:00-16:00": {
      subject: "MATH 208",
      type: "study",
      color: "#fbbf24",
      credits: 3,
    },
  },
  Sunday: {
    "10:00-11:00": {
      subject: "ENG 111",
      type: "study",
      color: "#93c5fd",
      credits: 3,
    },
    "14:00-15:00": {
      subject: "MATH 207",
      type: "study",
      color: "#86efac",
      credits: 3,
    },
    "16:00-17:00": {
      subject: "COMP 204",
      type: "study",
      color: "#f9a8d4",
      credits: 2,
    },
  },
};

const timeSlots = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Get this /ml-algo/ocr_nlp/subject_list_processing
const subjects = {
  "MATH 208": { credits: 3, color: "#fbbf24" },
  "ENG 111": { credits: 3, color: "#93c5fd" },
  "MATH 207": { credits: 3, color: "#86efac" },
  "COMP 202": { credits: 3, color: "#fef08a" },
  "COMP 204": { credits: 2, color: "#f9a8d4" },
};

const WeeklyScheduler = () => {
  const [activeView, setActiveView] = useState("calendar");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const getSessionForTimeSlot = (day: any, time: any) => {
    const daySchedule = scheduleData[day] || {};

    for (const [timeRange, session] of Object.entries(daySchedule)) {
      const [start, end] = timeRange.split("-");
      const startTime = start.replace(":", "");
      const endTime = end.replace(":", "");
      const currentTime = time.replace(":", "");

      if (currentTime >= startTime && currentTime < endTime) {
        return session as Session;
      }
    }
    return null;
  };

  const CalendarView = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Weekly Schedule
        </h2>
        <p className="text-blue-100 mt-2">
          Your optimized study and class schedule
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-8 bg-gray-50 border-b">
            <div className="p-4 font-semibold text-gray-600 border-r">Time</div>
            {days.map((day) => (
              <div
                key={day}
                className="p-4 font-semibold text-center text-gray-700 border-r last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Time slots */}
          {timeSlots.map((time) => (
            <div
              key={time}
              className="grid grid-cols-8 border-b hover:bg-gray-50 transition-colors"
            >
              <div className="p-3 text-sm font-medium text-gray-600 bg-gray-50 border-r flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {time}
              </div>
              {days.map((day) => {
                const session = getSessionForTimeSlot(day, time);
                return (
                  <div
                    key={`${day}-${time}`}
                    className="p-2 border-r last:border-r-0 min-h-[60px] flex items-center"
                  >
                    {session && (
                      <div
                        className="w-full p-2 rounded-lg text-sm font-medium text-gray-800 shadow-sm border-l-4 transition-all hover:shadow-md"
                        style={{
                          backgroundColor: session.color,
                          borderLeftColor:
                            session.color === "#f87171" ? "#dc2626" : "#4f46e5",
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {session.subject}
                        </div>
                        <div className="text-xs opacity-70 mt-1">
                          {session.type === "study" ? "Study" : "Class"}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Weekly Study Scheduler
          </h1>
          <p className="text-gray-600 text-lg">
            Optimized with Google OR-Tools for maximum efficiency
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-2 shadow-lg">
            <button
              onClick={() => setActiveView("calendar")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeView === "calendar"
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              <Calendar className="w-5 h-5 inline mr-2" />
              Calendar View
            </button>
          </div>
        </div>

        {/* Content */}
        {activeView === "calendar" ? <CalendarView /> : <></>}
      </div>
    </div>
  );
};

export default WeeklyScheduler;
