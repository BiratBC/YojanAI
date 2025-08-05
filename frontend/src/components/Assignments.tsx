'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Calendar,
  BookOpen,
  Clock,
  BarChart3,
  FileText,
  HelpCircle,
  Settings,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

interface AssignmentData {
  id: string;
  title: string;
  subject: string;
  status: 'completed' | 'pending' | 'overdue';
  dueDate: string;
  progress: number;
  description?: string;
}

type FilterType = 'all' | 'pending' | 'completed' | 'this-week' | 'overdue';

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<AssignmentData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: '',
    dueDate: '',
    description: ''
  });

  const [editForm, setEditForm] = useState<AssignmentData | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAssignments([]);
      setLoading(false);
    };
    fetchAssignments();
  }, []);

  useEffect(() => {
    let filtered = assignments;

    if (activeFilter !== 'all') {
      if (activeFilter === 'this-week') {
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
        filtered = assignments.filter(a =>
          new Date(a.dueDate) <= oneWeekFromNow && a.status !== 'completed'
        );
      } else {
        filtered = assignments.filter(a => a.status === activeFilter);
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAssignments(filtered);
  }, [assignments, activeFilter, searchTerm]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          label: 'Completed',
          progressColor: 'bg-green-500'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
          label: 'Pending',
          progressColor: 'bg-yellow-500'
        };
      case 'overdue':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle,
          label: 'Overdue',
          progressColor: 'bg-red-500'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: AlertCircle,
          label: 'Unknown',
          progressColor: 'bg-gray-500'
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddAssignment = () => {
    setShowAddModal(true);
  };

  const handleSaveNewAssignment = () => {
    if (newAssignment.title && newAssignment.subject && newAssignment.dueDate) {
      const assignment: AssignmentData = {
        id: Date.now().toString(),
        title: newAssignment.title,
        subject: newAssignment.subject,
        status: 'pending',
        dueDate: new Date(newAssignment.dueDate).toISOString(),
        progress: 0,
        description: newAssignment.description
      };

      setAssignments(prev => [...prev, assignment]);
      setNewAssignment({ title: '', subject: '', dueDate: '', description: '' });
      setShowAddModal(false);
    }
  };

  const handleUpdateAssignment = (updatedAssignment: AssignmentData) => {
    setAssignments(prev =>
      prev.map(a => a.id === updatedAssignment.id ? updatedAssignment : a)
    );
  };

  const handleDeleteAssignment = (id: string) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      setAssignments(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleStatusChange = (id: string, newStatus: 'completed' | 'pending' | 'overdue') => {
    setAssignments(prev =>
      prev.map(a => a.id === id ? {
        ...a,
        status: newStatus,
        progress: newStatus === 'completed' ? 100 : a.progress
      } : a)
    );
  };

  const handleProgressChange = (id: string, newProgress: number) => {
    setAssignments(prev =>
      prev.map(a => a.id === id ? {
        ...a,
        progress: newProgress,
        status: newProgress === 100 ? 'completed' as const : a.status
      } : a)
    );
  };

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'completed', label: 'Completed' },
    { key: 'this-week', label: 'This Week' },
    { key: 'overdue', label: 'Overdue' },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">All Assignments</h2>
        <p className="text-gray-600">View and manage all your assignments in one place</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 border-b">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Assignment"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleAddAssignment}
            className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Assignment
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {filterButtons.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-2 rounded-full border transition-colors ${
                activeFilter === filter.key
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Assignments List */}
      <div className="flex-1 p-6 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <FileText className="w-16 h-16 mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold mb-2">No assignments found</h3>
            <p className="text-center mb-4">
              {assignments.length === 0
                ? "You don't have any assignments yet. Click 'Add Assignment' to get started."
                : "No assignments match your current filter or search criteria."
              }
            </p>
            {assignments.length === 0 && (
              <button
                onClick={handleAddAssignment}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Your First Assignment
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => {
              const statusConfig = getStatusConfig(assignment.status);
              const StatusIcon = statusConfig.icon;
              const isExpanded = expandedCard === assignment.id;

              return (
                <div key={assignment.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => setExpandedCard(isExpanded ? null : assignment.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-800">{assignment.title}</h3>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {assignment.subject}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig.label}
                          </span>
                        </div>

                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{assignment.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${statusConfig.progressColor}`}
                              style={{ width: `${assignment.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {formatDate(assignment.dueDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Time: {formatTime(assignment.dueDate)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditForm(assignment);
                            setEditingCard(assignment.id);
                          }}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAssignment(assignment.id);
                          }}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                      <div className="flex items-center gap-4 mb-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-700">Status:</label>
                          <select
                            value={assignment.status}
                            onChange={(e) => handleStatusChange(assignment.id, e.target.value as any)}
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="overdue">Overdue</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-700">Progress:</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={assignment.progress}
                            onChange={(e) => handleProgressChange(assignment.id, parseInt(e.target.value))}
                            className="w-24"
                          />
                          <span className="text-sm text-gray-600 w-12">{assignment.progress}%</span>
                        </div>
                      </div>

                      {assignment.description && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Description:</h4>
                          <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                            {assignment.description}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Assignment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Assignment</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Assignment Title"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Subject"
                value={newAssignment.subject}
                onChange={(e) => setNewAssignment({...newAssignment, subject: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="datetime-local"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Description (optional)"
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewAssignment}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Add Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Assignment Modal */}
      {editingCard && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Assignment</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={editForm.subject}
                onChange={(e) => setEditForm({...editForm, subject: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="datetime-local"
                value={editForm.dueDate.slice(0, 16)}
                onChange={(e) => setEditForm({...editForm, dueDate: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setEditingCard(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleUpdateAssignment(editForm);
                  setEditingCard(null);
                }}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
