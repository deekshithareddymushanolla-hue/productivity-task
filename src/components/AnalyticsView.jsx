import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  Flame, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Brain, 
  Plus, 
  Calendar, 
  Check, 
  ShieldCheck 
} from 'lucide-react';

export default function AnalyticsView() {
  const { tasks, stats, habits, toggleHabit, addHabit } = useApp();
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Focus');

  // Simulated 7-day completion data
  const weeklyData = [
    { day: 'Mon', completed: 5, focusMins: 90 },
    { day: 'Tue', completed: 8, focusMins: 110 },
    { day: 'Wed', completed: 6, focusMins: 75 },
    { day: 'Thu', completed: 9, focusMins: 130 },
    { day: 'Fri', completed: 7, focusMins: 85 },
    { day: 'Sat', completed: 4, focusMins: 50 },
    { day: 'Sun (Today)', completed: tasks.filter(t => t.status === 'Completed').length, focusMins: stats.focusMinutesToday },
  ];

  const maxWeeklyTasks = Math.max(...weeklyData.map(d => d.completed), 10);

  // Category counts
  const categoryCounts = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {});

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addHabit(newHabitName, newHabitCategory);
    setNewHabitName('');
  };

  return (
    <div className="space-y-8 pb-16 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Productivity Intelligence & Velocity</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Analytics & Habit Matrix</h1>
        <p className="text-xs text-slate-400">
          Track sprint throughput, cognitive deep work volume, and habit compounding trends.
        </p>
      </div>

      {/* Top Velocity Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400">Total Tasks Finished</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{stats.totalTasksCompleted}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">+18% vs last week</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400">Cumulative Focus Time</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{stats.focusMinutesToday + 420}m</span>
            <Clock className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-[11px] text-cyan-400 font-medium">8.2 hours this week</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400">Active Daily Streak</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-amber-400 font-mono">{stats.currentStreakDays} Days</span>
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <span className="text-[11px] text-amber-400 font-medium">Consistent daily check-ins</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400">Cognitive Load Index</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-indigo-400 font-mono">Balanced</span>
            <Brain className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-[11px] text-slate-400">Optimal sprint-to-rest ratio</span>
        </div>
      </div>

      {/* 7-Day Velocity Chart */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">7-Day Task Completion Velocity</h3>
            <p className="text-xs text-slate-400">Daily finished tickets across active workstreams</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-indigo-500" />
              <span className="text-slate-300">Tasks Completed</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="h-56 flex items-end justify-between gap-2 sm:gap-6 pt-6 px-2">
          {weeklyData.map((item, idx) => {
            const heightPct = Math.round((item.completed / maxWeeklyTasks) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <span className="text-[11px] font-mono text-slate-400 group-hover:text-white transition-colors">
                  {item.completed}
                </span>
                <div className="w-full max-w-[42px] bg-slate-800/80 rounded-t-xl overflow-hidden relative h-full flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 via-indigo-500 to-cyan-400 rounded-t-xl transition-all duration-700 group-hover:brightness-125"
                    style={{ height: `${Math.max(12, heightPct)}%` }}
                  />
                </div>
                <span className="text-[10px] sm:text-xs text-slate-400 font-medium whitespace-nowrap">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown & AI Cognitive Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Workload Distribution */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Workload Distribution by Domain</h3>
          
          <div className="space-y-3 pt-2">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / Math.max(1, tasks.length)) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-medium">{cat}</span>
                    <span className="font-mono text-slate-400">{count} tasks ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Diagnostic Report */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">AI Cognitive Performance Diagnostics</h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <h5 className="font-semibold text-indigo-300">Peak Alertness Window</h5>
              <p className="text-slate-400 text-xs">
                Your highest task completion velocity occurs between <strong>9:00 AM and 11:30 AM</strong>. Maintain calendar defense for deep technical tasks during this block.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <h5 className="font-semibold text-cyan-300">Acoustic Entrainment Impact</h5>
              <p className="text-slate-400 text-xs">
                Focus sessions paired with the 40Hz Gamma wave synthesizer averaged <strong>18% longer continuous sprints</strong> before context switching.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <h5 className="font-semibold text-emerald-300">Sprint Backlog Velocity</h5>
              <p className="text-slate-400 text-xs">
                With current daily output ({tasks.filter(t => t.status === 'Completed').length} done today), active sprint backlog will be cleared in <strong>2.1 work days</strong>.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Habit Matrix Management */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Compounding Habit Tracker</h3>
            <p className="text-xs text-slate-400">Micro-habits performed daily compound into non-linear productivity</p>
          </div>

          <form onSubmit={handleAddHabit} className="flex items-center gap-2">
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="New habit name..."
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {habits.map(habit => (
            <div
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all space-y-3 ${
                habit.completedToday
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {habit.category}
                </span>
                <div className="flex items-center gap-1 text-xs font-mono text-amber-400">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{habit.streak}d streak</span>
                </div>
              </div>

              <div>
                <h4 className={`text-xs font-semibold ${habit.completedToday ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                  {habit.name}
                </h4>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Today</span>
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                  habit.completedToday
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                    : 'border-slate-600'
                }`}>
                  {habit.completedToday && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
