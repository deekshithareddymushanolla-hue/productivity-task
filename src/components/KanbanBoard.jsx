import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Search, 
  Sparkles, 
  CheckSquare, 
  Square, 
  Calendar, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Layers 
} from 'lucide-react';

export default function KanbanBoard() {
  const { 
    tasks, 
    addTask, 
    moveTask, 
    deleteTask, 
    toggleSubtask, 
    generateAndAddSubtasks,
    isNewTaskModalOpen,
    setIsNewTaskModalOpen
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedTask, setExpandedTask] = useState(null);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Engineering');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newStatus, setNewStatus] = useState('To Do');
  const [newDueDate, setNewDueDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);

  const columns = [
    { id: 'Backlog', label: 'Backlog', color: 'border-slate-700', bg: 'bg-slate-800/40' },
    { id: 'To Do', label: 'To Do', color: 'border-indigo-500/50', bg: 'bg-indigo-950/20' },
    { id: 'In Progress', label: 'In Progress', color: 'border-cyan-500/50', bg: 'bg-cyan-950/20' },
    { id: 'Completed', label: 'Completed', color: 'border-emerald-500/50', bg: 'bg-emerald-950/20' },
  ];

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority;
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    return matchesSearch && matchesPriority && matchesCategory;
  });

  const categories = ['All', ...new Set(tasks.map(t => t.category))];

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      title: newTitle,
      description: newDesc,
      category: newCategory,
      priority: newPriority,
      status: newStatus,
      dueDate: newDueDate,
      subtasks: []
    });

    setNewTitle('');
    setNewDesc('');
    setIsNewTaskModalOpen(false);
  };

  const getNextStatus = (current) => {
    const order = ['Backlog', 'To Do', 'In Progress', 'Completed'];
    const idx = order.indexOf(current);
    return idx < order.length - 1 ? order[idx + 1] : null;
  };

  const getPrevStatus = (current) => {
    const order = ['Backlog', 'To Do', 'In Progress', 'Completed'];
    const idx = order.indexOf(current);
    return idx > 0 ? order[idx - 1] : null;
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      
      {/* Kanban Header & Filters */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Smart Kanban Board
            </h1>
            <p className="text-xs text-slate-400">Manage sprints, priority tickets, and generate AI subtasks</p>
          </div>

          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Task</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80">
          
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tasks by keyword..."
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/60"
            />
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>

          {(searchQuery || selectedPriority !== 'All' || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedPriority('All');
                setSelectedCategory('All');
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline"
            >
              Reset Filters
            </button>
          )}

        </div>
      </div>

      {/* 4 Column Kanban Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
        {columns.map(col => {
          const columnTasks = filteredTasks.filter(t => t.status === col.id);
          return (
            <div 
              key={col.id}
              className="glass-panel rounded-2xl p-4 border border-slate-800/80 space-y-3 min-h-[500px] flex flex-col"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    col.id === 'Backlog' ? 'bg-slate-500' :
                    col.id === 'To Do' ? 'bg-indigo-400' :
                    col.id === 'In Progress' ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400'
                  }`} />
                  <h3 className="font-bold text-xs text-white uppercase tracking-wider">{col.label}</h3>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {columnTasks.length}
                </span>
              </div>

              {/* Task Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                {columnTasks.length === 0 ? (
                  <div className="h-36 rounded-xl border border-dashed border-slate-800 flex items-center justify-center text-xs text-slate-500">
                    No tasks in {col.label}
                  </div>
                ) : (
                  columnTasks.map(task => {
                    const next = getNextStatus(task.status);
                    const prev = getPrevStatus(task.status);
                    const completedSubs = task.subtasks?.filter(s => s.completed).length || 0;
                    const totalSubs = task.subtasks?.length || 0;
                    const isExpanded = expandedTask === task.id;

                    return (
                      <div
                        key={task.id}
                        className="p-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800/80 hover:border-indigo-500/40 transition-all space-y-3 group shadow-sm"
                      >
                        {/* Tags Header */}
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded font-mono ${
                            task.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                            task.priority === 'High' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            task.priority === 'Medium' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                            'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            {task.priority}
                          </span>

                          <span className="text-[10px] text-slate-400 bg-slate-800/90 px-2 py-0.5 rounded">
                            {task.category}
                          </span>
                        </div>

                        {/* Title & Desc */}
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-white leading-snug">
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}
                        </div>

                        {/* Subtasks Section */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <button
                              onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                              className="hover:text-slate-200 flex items-center gap-1 text-[11px]"
                            >
                              <span>Subtasks ({completedSubs}/{totalSubs})</span>
                            </button>
                            
                            {/* AI Subtask Magic Button */}
                            <button
                              onClick={() => generateAndAddSubtasks(task.id)}
                              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium bg-cyan-950/40 hover:bg-cyan-900/40 px-1.5 py-0.5 rounded border border-cyan-500/30 transition-colors"
                              title="Generate logical subtasks using AI"
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>AI Subtasks</span>
                            </button>
                          </div>

                          {/* Progress Bar */}
                          {totalSubs > 0 && (
                            <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                              <div 
                                className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                                style={{ width: `${(completedSubs / totalSubs) * 100}%` }}
                              />
                            </div>
                          )}

                          {/* Expanded Subtask Checklist */}
                          {isExpanded && task.subtasks && (
                            <div className="pt-2 space-y-1 border-t border-slate-800">
                              {task.subtasks.map(st => (
                                <div 
                                  key={st.id}
                                  onClick={() => toggleSubtask(task.id, st.id)}
                                  className="flex items-center gap-2 text-[11px] text-slate-300 hover:text-white cursor-pointer py-0.5"
                                >
                                  {st.completed ? (
                                    <CheckSquare className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                  ) : (
                                    <Square className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                  )}
                                  <span className={st.completed ? 'line-through text-slate-500' : ''}>
                                    {st.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Card Footer: Due Date & Actions */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Calendar className="w-3 h-3" />
                            <span>{task.dueDate}</span>
                          </div>

                          {/* Move & Delete buttons */}
                          <div className="flex items-center gap-1">
                            {prev && (
                              <button
                                onClick={() => moveTask(task.id, prev)}
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                                title={`Move back to ${prev}`}
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}

                            {next && (
                              <button
                                onClick={() => moveTask(task.id, next)}
                                className="p-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white"
                                title={`Move to ${next}`}
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors ml-1"
                              title="Delete Task"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

              {/* Quick Add at column bottom */}
              <button
                onClick={() => {
                  setNewStatus(col.id);
                  setIsNewTaskModalOpen(true);
                }}
                className="w-full py-2 rounded-xl border border-dashed border-slate-800 hover:border-slate-700 text-slate-500 hover:text-slate-300 text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to {col.label}</span>
              </button>

            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="glass-panel rounded-2xl border border-slate-800 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                Create New Task
              </h3>
              <button 
                onClick={() => setIsNewTaskModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Build MVP authentication flow"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Key requirements and outcome expectations..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Design">Design</option>
                    <option value="Personal">Personal</option>
                    <option value="Research">Research</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Backlog">Backlog</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Target Due Date</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/30"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
