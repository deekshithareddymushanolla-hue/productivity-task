import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import AiCopilot from './components/AiCopilot';
import FocusTimer from './components/FocusTimer';
import NotesView from './components/NotesView';
import AnalyticsView from './components/AnalyticsView';
import CommandPalette from './components/CommandPalette';
import SettingsModal from './components/SettingsModal';
import { CheckCircle2, AlertCircle, Info, Sparkles, Command } from 'lucide-react';

function MainLayout() {
  const { currentView, toasts, theme, setIsCommandPaletteOpen } = useApp();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'light' 
        ? 'bg-slate-50 text-slate-900' 
        : theme === 'midnight' 
        ? 'bg-black text-slate-100' 
        : 'bg-slate-950 text-slate-100'
    }`}>
      
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs font-medium animate-slideUp backdrop-blur-xl ${
              t.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
                : t.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-200'
            }`}
          >
            {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {t.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {t.type === 'info' && <Info className="w-4 h-4 text-indigo-400 shrink-0" />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'tasks' && <KanbanBoard />}
        {currentView === 'ai' && <AiCopilot />}
        {currentView === 'focus' && <FocusTimer />}
        {currentView === 'notes' && <NotesView />}
        {currentView === 'analytics' && <AnalyticsView />}
      </main>

      {/* Global Modals */}
      <CommandPalette />
      <SettingsModal />

      {/* Floating Shortcut Helper pill on desktop */}
      <div className="fixed bottom-4 left-6 hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 shadow-lg backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>Press</span>
        <button 
          onClick={() => setIsCommandPaletteOpen(true)}
          className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono hover:text-white"
        >
          Ctrl+K
        </button>
        <span>for instant AI actions & search</span>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
