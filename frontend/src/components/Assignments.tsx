
"use client"
import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';


const Assignments = () => {
      const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

//   Dummy Assignments
  const assignments = [
    {
      id: 1,
      title: 'Data Structures Assignment 2',
      course: 'CS 201',
      status: 'Pending',
      dueDate: 'May 25, 2025',
      time: '11:59 PM',
      priority: 'High'
    },
    {
      id: 2,
      title: 'Database Project Report',
      course: 'CS 301',
      status: 'Completed',
      dueDate: 'May 20, 2025',
      time: '11:59 PM',
      priority: 'Medium'
    },
    {
      id: 3,
      title: 'Network Security Lab',
      course: 'CS 401',
      status: 'Overdue',
      dueDate: 'May 15, 2025',
      time: '11:59 PM',
      priority: 'High'
    }
  ];

  const filters = ['All', 'Pending', 'Completed', 'Overdue', 'This Week'];

  const getStatusColor = (status : string) => {
    switch (status) {
      case 'Pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority : string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCourseColor = (course : string) => {
    const colors = {
      'CS 201': 'bg-green-100 text-green-800',
      'CS 301': 'bg-green-100 text-green-800',
      'CS 401': 'bg-green-100 text-green-800'
    };
    return colors[course as keyof typeof colors] || 'bg-blue-100 text-blue-800';
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesFilter = activeFilter === 'All' || assignment.status === activeFilter;
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.course.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  return (
   <>
  <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">All Assignments</h1>
        <p className="text-gray-600">View and manage all your assignments in one place</p>
      </div>

      {/* Search and New Assignment Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <button className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="w-5 h-5" />
          New Assignment
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              activeFilter === filter
                ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Assignment Cards */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white rounded-lg border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-blue-600">{assignment.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </span>
                </div>
                <div className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${getCourseColor(assignment.course)}`}>
                  {assignment.course}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium">Due:</span>
                <span>{assignment.dueDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Time:</span>
                <span>{assignment.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Priority:</span>
                <span className={`font-medium ${getPriorityColor(assignment.priority)}`}>
                  {assignment.priority}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No assignments found</p>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
    </>
  )
}

export default Assignments
