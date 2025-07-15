"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import SessionWrapper from "@/components/SessionWrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="h-screen bg-gray-800 flex overflow-hidden">
      {/* Left Sidebar - Fixed */}
      <div className="w-56 bg-gray-50 flex flex-col flex-shrink-0">
        {/* Logo Section */}
        <div className="px-6 py-8 flex items-center justify-center">
          <Image 
            src="/icons/logo.png" 
            alt="Yojana Logo" 
            width={100} 
            height={80}
            className="object-contain"
          />
        </div>

        {/* Navigation Menu in Dark Box */}
        <div className="mx-4 mb-4 bg-gray-700 rounded-lg overflow-hidden flex-grow flex flex-col">
          <nav className="py-4 flex-1 overflow-y-auto">
            <ul className="space-y-1">
              <li>
                <Link 
                  href="/dashboard/planner" 
                  className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-600 transition-colors"
                >
                  Semester Planner
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/assignments" 
                  className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-600 transition-colors"
                >
                  Update / Reschedule
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/assignments" 
                  className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-600 transition-colors"
                >
                  All Assignments
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/workspace" 
                  className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-600 transition-colors"
                >
                  Notion Workspace
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/subject-list" 
                  className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-600 transition-colors"
                >
                  Subject List
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/calendar" 
                  className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-600 transition-colors"
                >
                  Calendar
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/routine" 
                  className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-600 transition-colors"
                >
                  Class Routine
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* Help at bottom of dark box */}
          <div className="px-4 pb-4 flex-shrink-0">
            <Link 
              href="/dashboard/help" 
              className="block px-0 py-3 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Help
            </Link>
          </div>
        </div>

        {/* Bottom N button */}
        <div className="px-4 pb-4 flex-shrink-0">
          <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
            <span className="text-white text-sm font-medium">N</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white flex flex-col min-w-0">
        {/* Top Header - Fixed */}
        <header className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center">
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Task</span>
            </button>
            
            <button className="p-2 text-gray-500 hover:text-gray-700 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* User Avatar with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
              >
                <span className="text-white text-sm font-semibold">U</span>
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link 
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <hr className="my-1 border-gray-200" />
                  <Link 
                    href="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Setting
                  </Link>
                  <Link 
                    href="/dashboard/faqs"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    FAQs
                  </Link>
                  <hr className="my-1 border-gray-200" />
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false)
                      // Add your logout logic here
                      console.log('Logout clicked')
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 flex min-h-0">
          {/* Page Content - Scrollable */}
          <main className="flex-1 bg-gray-50 overflow-y-auto">
            {children}
          </main>

          {/* Right Sidebar - Fixed */}
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
            {/* Right Header with controls - Fixed */}
            <div className="px-4 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">Help</span>
                  </button>
                </div>
              </div>

              {/* Priorities/Tasks tabs */}
              <div className="flex border-b border-gray-200">
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border-b-2 border-transparent hover:border-gray-300">
                  Priorities
                </button>
                <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                  Tasks
                </button>
              </div>
            </div>

            {/* Search bar - Fixed */}
            <div className="px-4 py-3 flex-shrink-0">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search for something..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 px-4 py-4 overflow-y-auto">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Connect to Google Calendar to view and manage your tasks
                </p>
                <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">Connect Google Calendar</span>
                </button>
              </div>
              
              {/* Add more content here to test scrolling in right sidebar */}
              <div className="mt-8 space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">Sample Task 1</h4>
                  <p className="text-sm text-gray-600">Complete assignment due tomorrow</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">Sample Task 2</h4>
                  <p className="text-sm text-gray-600">Study for upcoming exam</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">Sample Task 3</h4>
                  <p className="text-sm text-gray-600">Prepare presentation</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">Sample Task 4</h4>
                  <p className="text-sm text-gray-600">Review lecture notes</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">Sample Task 5</h4>
                  <p className="text-sm text-gray-600">Submit project proposal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
