import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  LayoutDashboard, 
  Kanban, 
  Bot, 
  Clock, 
  FileText, 
  BarChart3, 
  Plus, 
  Sparkles, 
  Moon, 
  Download, 
  ArrowRight,
  Command
} from 'lucide-react';

export default function CommandPalette() {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    setCurrentView, 
    setIsNewTaskModalOpen,
    tasks, 
    notes,
    theme, 
    setTheme, 
    resetToDemoData, 
    notify 
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Global Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsCommandPaletteOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Static commands list
  const baseCommands = [
    { id: 'nav-dash', label: 'Go to Dashboard', category: 'Navigation', icon: LayoutDashboard, action: () => setCurrentView('dashboard') },
    { id: 'nav-kanban', label: 'Go to Kanban Tasks', category: 'Navigation', icon: Kanban, action: () => setCurrentView('tasks') },
    { id: 'nav-ai', label: 'Open AI Copilot Studio', category: 'Navigation', icon: Bot, action: () => setCurrentView('ai') },
    { id: 'nav-focus', label: 'Start Focus Flow & Soundscapes', category: 'Navigation', icon: Clock, action: () => setCurrentView('focus') },
    { id: 'nav-notes', label: 'Open Smart Notes & Scratchpad', category: 'Navigation', icon: FileText, action: () => setCurrentView('notes') },
    { id: 'nav-analytics', label: 'View Productivity Analytics', category: 'Navigation', icon: BarChart3, action: () => setCurrentView('analytics') },
    { id: 'act-task', label: 'Create New Task...', category: 'Actions', icon: Plus, action: () => setIsNewTaskModalOpen(true) },
    { id: 'act-ai-goal', label: 'Deconstruct Project with AI...', category: 'AI Actions', icon: Sparkles, action: () => setCurrentView('ai') },
    { id: 'act-theme', label: `Toggle Theme (Current: ${theme})`, category: 'Preferences', icon: Moon, action: () => setTheme(theme === 'dark' ? 'midnight' : theme === 'midnight' ? 'light' : 'dark') },
    { id: 'act-export', label: 'Export Workspace JSON', category: 'Data', icon: Download, action: () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ tasks, notes }, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `novaflow-backup-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      notify('Workspace exported successfully!', 'success');
    }}
  ];

  // Dynamic matching tasks
  const matchingTasks = tasks
    .filter(t => t.title.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 3)
    .map(t => ({
      id: `task-${t.id}`,
      label: `Task: ${t.title}`,
      category: 'Tasks',
      icon: Kanban,
      action: () => setCurrentView('tasks')
    }));

  // Dynamic matching notes
  const matchingNotes = notes
    .filter(n => n.title.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 3)
    .map(n => ({
      id: `note-${n.id}`,
      label: `Note: ${n.title}`,
      category: 'Notes',
      icon: FileText,
      action: () => setCurrentView('notes')
    }));

  const allItems = [
    ...baseCommands.filter(c => c.label.toLowerCase().includes(query.toLowerCase())),
    ...matchingTasks,
    ...matchingNotes
  ];

  const handleSelect = (item) => {
    setIsCommandPaletteOpen(false);
    item.action();
  };

  const handleKeyDownInInput = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, allItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + allItems.length) % Math.max(1, allItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        handleSelect(allItems[selectedIndex]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/80 backdrop-blur-md p-4">
      <div className="glass-panel rounded-2xl border border-slate-700 max-w-xl w-full overflow-hidden shadow-2xl animate-scaleUp">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownInInput}
            placeholder="Type a command or search tasks, notes, AI actions..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {allItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching commands or items found for "{query}"
            </div>
          ) : (
            allItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    <span className="font-medium line-clamp-1">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded ${
                      isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/50 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="font-mono text-[10px] text-indigo-400">NovaFlow Quick-Omni</span>
        </div>

      </div>
    </div>
  );
}
