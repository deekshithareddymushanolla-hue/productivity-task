import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  LayoutDashboard, 
  Kanban, 
  Bot, 
  Clock, 
  FileText, 
  BarChart3, 
  Plus, 
  Search, 
  Moon, 
  Sun, 
  Sliders, 
  Zap 
} from 'lucide-react';

export default function Navbar() {
  const { 
    currentView, 
    setCurrentView, 
    theme, 
    setTheme, 
    setIsCommandPaletteOpen, 
    setIsSettingsOpen, 
    setIsNewTaskModalOpen,
    geminiApiKey 
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Kanban Tasks', icon: Kanban },
    { id: 'ai', label: 'AI Copilot', icon: Bot, badge: 'AI' },
    { id: 'focus', label: 'Focus Flow', icon: Clock },
    { id: 'notes', label: 'Smart Notes', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('midnight');
    else if (theme === 'midnight') setTheme('light');
    else setTheme('dark');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[2px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white font-sans">NovaFlow</span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI 2.0</span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Intelligent Productivity Operating System</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                      isActive ? 'bg-indigo-400/30 text-white' : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2">
            
            {/* Quick Command Palette Button */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              title="Quick Search & Actions (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search / AI...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Quick Add Task */}
            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Task</span>
            </button>

            {/* AI Status Pill */}
            <div 
              onClick={() => setIsSettingsOpen(true)}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                geminiApiKey 
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/30' 
                  : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/30'
              }`}
              title={geminiApiKey ? 'Gemini 1.5 Flash Connected' : 'Offline AI Active (Click to add API Key)'}
            >
              <Zap className={`w-3.5 h-3.5 ${geminiApiKey ? 'text-emerald-400' : 'text-indigo-400'}`} />
              <span className="text-[11px] font-medium">{geminiApiKey ? 'Gemini Live' : 'Smart AI'}</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={cycleTheme}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title={`Theme: ${theme}`}
            >
              {theme === 'light' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Settings Trigger */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Settings & Data Backup"
            >
              <Sliders className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-800/60 overflow-x-auto gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
