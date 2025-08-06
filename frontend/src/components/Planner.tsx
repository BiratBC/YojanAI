"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import { ScheduleBlock, ScheduleData } from "@/lib/types";


// Global declaration so that rendering wont change the color of the subject
const subjectColorMap: { [key: string]: string } = {};
const generateRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 60%)`;
};


const Planner = () => {
  const { data: session } = useSession();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduleData, setScheduleData] = useState<ScheduleData>({});
  const [subjects, setSubjects] = useState([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Generate time slots from 06:00 to 21:00
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 21; hour++) {
      const timeStr = hour.toString().padStart(2, "0") + ":00";
      slots.push(timeStr);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Memoize the getSubjectList function to prevent recreating it on every render
  const getSubjectList = useCallback(async (email: string) => {
    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8080/api/extract-subject-list?email=${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to extract subjects");
      }

      const data = await response.json();
      console.log("Raw response data:", data);
      const parsedSubjectList = JSON.parse(data.data);
      setSubjects(parsedSubjectList);
      console.log("Subjects set:", parsedSubjectList);
      return parsedSubjectList;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error extracting subjects:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoize the handleSubmit function
  const handleSubmit = useCallback(
    async (subjectsToSubmit = subjects) => {
      if (!subjectsToSubmit || subjectsToSubmit.length === 0) {
        console.log("No subjects to submit");
        return;
      }

      try {
        setLoading(true);
        const res = await fetch("http://localhost:8080/dashboard/schedule/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subjects: subjectsToSubmit }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Server error:", errorText);
          return;
        }

        const data = await res.json();
        const parsedSchedule = JSON.parse(data.data);
        console.log("Schedule Success:", data);
        setScheduleData(parsedSchedule || {});
      } catch (err: any) {
        console.error("Fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    },
    [subjects]
  );

  // Initial setup effect - runs only once when session is available
  useEffect(() => {
    const initializeSchedule = async () => {
      if (session?.user?.email && !hasInitialized) {
        console.log("Initializing schedule for:", session.user.email);
        setHasInitialized(true);

        const fetchedSubjects = await getSubjectList(session.user.email);
        if (fetchedSubjects && fetchedSubjects.length > 0) {
          await handleSubmit(fetchedSubjects);
        }
      }
    };

    initializeSchedule();
  }, [session?.user?.email, hasInitialized, getSubjectList, handleSubmit]);

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") newDate.setMonth(prev.getMonth() - 1);
      else newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // Function to get schedule block for a specific time slot
  const getScheduleBlock = (day: string, timeSlot: string) => {
    const daySchedule = scheduleData[day] || {};
    const nextHour =
      (parseInt(timeSlot.split(":")[0]) + 1).toString().padStart(2, "0") +
      ":00";
    const timeRange = `${timeSlot}-${nextHour}`;

    if (daySchedule[timeRange]) {
      return daySchedule[timeRange];
    }

    // Check for overlapping time ranges
    for (const [key, block] of Object.entries(daySchedule)) {
      if (block && key.includes("-")) {
        const [start, end] = key.split("-");
        const currentTime = parseInt(timeSlot.split(":")[0]);
        const startTime = parseInt(start.split(":")[0]);
        const endTime = parseInt(end.split(":")[0]);

        if (currentTime >= startTime && currentTime < endTime) {
          return block;
        }
      }
    }

    return null;
  };

  const getBackgroundColor = (block: ScheduleBlock): string => {
    if (block.type === "fixed") {
      if (block.subject === "Class Time") return "#f87171";
      return "#e5e7eb";
    }

    if (subjectColorMap[block.subject]) {
      return subjectColorMap[block.subject];
    }
    const newColor = generateRandomColor();
    subjectColorMap[block.subject] = newColor;

    return newColor;
  };

  // regenrate schedule ** danger
  const regenerateSchedule = async () => {
    if (subjects && subjects.length > 0) {
      await handleSubmit(subjects);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white p-6 rounded-b-lg shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Weekly Schedule</h1>
        </div>
        <p className="text-blue-100">Your optimized study and class schedule</p>
      </div>

      {/* Controls */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={regenerateSchedule}
              disabled={loading || !subjects || subjects.length === 0}
              className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Regenerate Schedule"}
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {formatMonthYear(currentDate)}
            </h2>
            {subjects.length > 0 && (
              <span className="text-sm text-gray-600">
                {subjects.length} subjects loaded
              </span>
            )}
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Processing your schedule...</p>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => navigateMonth("next")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">Error: {error}</p>
          </div>
        )}

        {/* Schedule Grid */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-8 gap-0">
            {/* Header */}
            <div className="bg-gray-100 p-3 font-semibold text-gray-700 border-b border-r flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time
            </div>
            {days.map((day) => (
              <div
                key={day}
                className="bg-gray-100 p-3 font-semibold text-center text-gray-700 border-b border-r"
              >
                {day}
              </div>
            ))}

            {/* Time slots */}
            {timeSlots.map((timeSlot) => (
              <React.Fragment key={timeSlot}>
                <div className="p-3 text-sm font-medium text-gray-600 border-b border-r bg-gray-50 flex items-center">
                  {timeSlot}
                </div>
                {days.map((day) => {
                  const block = getScheduleBlock(day, timeSlot);
                  // {console.log("this is block", block);                }
                  return (
                    <div
                      key={`${day}-${timeSlot}`}
                      className="p-2 border-b border-r min-h-[60px] flex items-center"
                    >
                      {block ? (
                        <div
                          className="w-full p-2 rounded-lg shadow-sm transition-all hover:shadow-md text-white text-xs"
                          style={{
                            backgroundColor: getBackgroundColor(block),
                          }}
                        >
                          <div className="font-semibold leading-tight">
                            {block.subject}
                          </div>
                          <div className="opacity-90 capitalize mt-1">
                            {block.type}
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full"></div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-sm">
            Your personalized schedule optimizes study time based on your course
            credits and availability
          </p>
        </div>
      </div>
    </div>
  );
};

export default Planner;
