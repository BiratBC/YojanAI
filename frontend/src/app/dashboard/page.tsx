
"use client"

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PlannerPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 1)); // May 2025

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const timeSlots = [
    '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm'
  ];

  const weekDays = ['Sun 25', 'Mon 26', 'Tue 27', 'Wed 28', 'Thu 29', 'Fri 30', 'Sat 31'];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {formatMonthYear(currentDate)}
        </h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Weekly Calendar View */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Week Days Header */}
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-4 border-r border-gray-200"></div>
          {weekDays.map((day, index) => (
            <div key={index} className="p-4 text-center border-r border-gray-200 last:border-r-0">
              <div className="text-sm font-medium text-gray-700">{day.split(' ')[0]}</div>
              <div className="text-lg font-semibold text-gray-900 mt-1">{day.split(' ')[1]}</div>
            </div>
          ))}
        </div>

        {/* Time Slots and Calendar Grid */}
        <div className="grid grid-cols-8">
          {/* Time Column */}
          <div className="border-r border-gray-200">
            {timeSlots.map((time, index) => (
              <div key={index} className="h-20 px-4 py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-sm text-gray-600">{time}</span>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="border-r border-gray-200 last:border-r-0">
              {timeSlots.map((time, timeIndex) => (
                <div 
                  key={`${dayIndex}-${timeIndex}`} 
                  className="h-20 border-b border-gray-100 last:border-b-0 p-1 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {/* This is where assignments would be rendered if they existed */}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Optional: Add some helper text or additional controls */}
      <div className="mt-6 text-center">
        <p className="text-gray-500 text-sm">
          Click on any time slot to add an assignment or task
        </p>
      </div>
      </div>
    </div>
  );
}
import React from "react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DashboardComponent from "@/components/Dashboard";

const Dashboard = async () => {
  const session: any = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }
  return (
    <>
    <DashboardComponent session={session}/>
    </>
  );
};

export default Dashboard;

