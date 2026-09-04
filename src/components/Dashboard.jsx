import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Flame, 
  ArrowRight, 
  TrendingUp, 
  AlertCircle, 
  Plus, 
  Calendar, 
  Zap, 
  Target,
  Play,
  Check,
  ChevronRight
} from 'lucide-react';

export default function Dashboard() {
  const { 
    tasks, 
    stats, 
    habits, 
    setCurrentView, 
    setIsNewTaskModalOpen,
    moveTask, 
    toggleHabit 
  } = useApp();

  // Dynamic greeting based on hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const completedTodayCount = tasks.filter(t => t.status === 'Completed').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const urgentCount = tasks.filter(t => t.priority === 'Urgent' && t.status !== 'Completed').length;
  const highCount = tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length;

  // Algorithmic Productivity Score calculation (0-100)
  const score = Math.min(100, Math.round(
    (completedTodayCount * 12) + 
    (stats.focusMinutesToday * 0.4) + 
    (habits.filter(h => h.completedToday).length * 8) + 
    (stats.currentStreakDays * 2)
  ));

  const priorityTasks = tasks
    .filter(t => t.status !== 'Completed')
    .sort((a, b) => {
      const priorityOrder = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 4);

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono tracking-wider uppercase">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-400">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                {stats.currentStreakDays} Day Streak
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-cyan-300">Creator</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              NovaFlow AI has optimized your focus roadmap. You have <strong className="text-white">{urgentCount + highCount} high-leverage items</strong> ready for execution today.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentView('focus')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start 25m Focus Flow</span>
            </button>
            <button
              onClick={() => setCurrentView('ai')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-white text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ask AI Copilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Productivity Score */}
        <div className="glass-panel p-5 rounded-xl space-y-3 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Productivity Index</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{score}</span>
            <span className="text-xs text-slate-400">/ 100</span>
            <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {score >= 80 ? 'Peak Flow' : score >= 50 ? 'Steady Pace' : 'Warming Up'}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Completed Tasks */}
        <div className="glass-panel p-5 rounded-xl space-y-3 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Tasks Completed</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{completedTodayCount}</span>
            <span className="text-xs text-slate-400">done today</span>
            <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {tasks.length} total
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, (completedTodayCount / Math.max(1, tasks.length)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Focus Minutes */}
        <div className="glass-panel p-5 rounded-xl space-y-3 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Deep Focus Time</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{stats.focusMinutesToday}</span>
            <span className="text-xs text-slate-400">mins today</span>
            <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              {stats.sessionsCompletedToday} sprints
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-cyan-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, (stats.focusMinutesToday / stats.dailyGoalMinutes) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 4: High Leverage Tickets */}
        <div className="glass-panel p-5 rounded-xl space-y-3 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Priority Attention</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400 font-mono">{urgentCount + highCount}</span>
            <span className="text-xs text-slate-400">urgent / high</span>
            <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {inProgressCount} active
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-amber-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, ((urgentCount + highCount) / Math.max(1, tasks.length)) * 100)}%` }}
            />
          </div>
        </div>

      </div>

      {/* Main Content Grid: AI Executive Briefing + Priority Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: AI Daily Briefing & Priority Execution List */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Daily Executive Briefing */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">AI Daily Executive Briefing</h2>
              </div>
              <button 
                onClick={() => setCurrentView('ai')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <span>Full Copilot Studio</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                🎯 <strong>Primary Target:</strong> Complete <span className="text-indigo-300 font-semibold">{tasks[0]?.title || 'Key Sprint Objective'}</span> before noon to capitalize on peak executive alertness.
              </p>
              <p>
                ⚡ <strong>Context Tip:</strong> You have {stats.focusMinutesToday} minutes of deep work logged. Shielding one more 50-minute session will achieve your daily deep work quota (120 mins).
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => setCurrentView('ai')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ask AI to Break Down Goals</span>
                </button>
                <button
                  onClick={() => setCurrentView('ai')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Target className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Generate Standup Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* Urgent & High Priority Action Board */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">High-Leverage Execution List</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                  {priorityTasks.length} Ready
                </span>
              </div>
              <button
                onClick={() => setCurrentView('tasks')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <span>View Kanban</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {priorityTasks.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  All urgent tasks cleared! Great work.
                </div>
              ) : (
                priorityTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="p-3.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/80 flex items-start justify-between gap-3 transition-all group"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() => moveTask(task.id, 'Completed')}
                        className="mt-0.5 w-5 h-5 rounded-md border border-slate-600 hover:border-emerald-500 hover:bg-emerald-500/20 flex items-center justify-center text-transparent hover:text-emerald-400 transition-colors"
                        title="Mark Complete"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded font-mono ${
                            task.priority === 'Urgent' 
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {task.category}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Due {task.dueDate}
                          </span>
                        </div>
                        <h4 className="text-sm font-medium text-slate-100 group-hover:text-white transition-colors">
                          {task.title}
                        </h4>
                        {task.subtasks && task.subtasks.length > 0 && (
                          <p className="text-xs text-slate-400">
                            {task.subtasks.filter(st => st.completed).length} of {task.subtasks.length} subtasks done
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => moveTask(task.id, task.status === 'In Progress' ? 'Completed' : 'In Progress')}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium whitespace-nowrap transition-colors ${
                        task.status === 'In Progress'
                          ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300 hover:bg-indigo-600 hover:text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {task.status === 'In Progress' ? 'Active' : 'Start'}
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500/50 text-slate-400 hover:text-indigo-300 flex items-center justify-center gap-2 text-xs font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Priority Task</span>
            </button>
          </div>

        </div>

        {/* Right Col: Habits & Daily Schedule */}
        <div className="space-y-6">
          
          {/* Habit Tracker Widget */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Daily Habit Protocol</h2>
              <span className="text-xs text-slate-400 font-mono">
                {habits.filter(h => h.completedToday).length}/{habits.length} Done
              </span>
            </div>

            <div className="space-y-2">
              {habits.map((habit) => (
                <div 
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between gap-3 transition-all ${
                    habit.completedToday
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      habit.completedToday
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-600'
                    }`}>
                      {habit.completedToday && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${habit.completedToday ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                        {habit.name}
                      </p>
                      <span className="text-[10px] text-slate-500">{habit.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                    <Flame className="w-3 h-3 fill-amber-400" />
                    <span>{habit.streak}d</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Daily Schedule */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Chronogram Blocks</h2>
            
            <div className="space-y-3 relative pl-4 border-l border-slate-800">
              <div className="relative space-y-1">
                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-slate-950" />
                <span className="text-[10px] font-mono text-slate-400">09:00 - 11:30</span>
                <h5 className="text-xs font-semibold text-white">Shielded Deep Work Sprint</h5>
                <p className="text-[11px] text-slate-400">No meetings. Focus on high-cognitive architecture.</p>
              </div>

              <div className="relative space-y-1">
                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-400 ring-4 ring-slate-950" />
                <span className="text-[10px] font-mono text-slate-400">12:00 - 13:00</span>
                <h5 className="text-xs font-semibold text-white">Async Comms & Bio Break</h5>
                <p className="text-[11px] text-slate-400">Review PRs, check team messages, recharge.</p>
              </div>

              <div className="relative space-y-1">
                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-slate-950" />
                <span className="text-[10px] font-mono text-slate-400">14:00 - 16:30</span>
                <h5 className="text-xs font-semibold text-white">Execution Sprint 2</h5>
                <p className="text-[11px] text-slate-400">Subtask execution and prototype delivery.</p>
              </div>

              <div className="relative space-y-1">
                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-slate-950" />
                <span className="text-[10px] font-mono text-slate-400">17:00 - 17:30</span>
                <h5 className="text-xs font-semibold text-white">Daily Retro & Standup Synthesis</h5>
                <p className="text-[11px] text-slate-400">Lock in tomorrow's Top 3 priorities.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
