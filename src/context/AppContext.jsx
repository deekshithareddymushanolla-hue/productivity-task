import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_TASKS, INITIAL_NOTES, INITIAL_HABITS, INITIAL_STATS } from '../services/initialData';
import { generateSubtasksForTask } from '../services/aiService';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Load tasks from localStorage or seed
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('novaflow_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  // Load notes
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('novaflow_notes');
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  // Load habits
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem('novaflow_habits');
      return saved ? JSON.parse(saved) : INITIAL_HABITS;
    } catch {
      return INITIAL_HABITS;
    }
  });

  // Load stats
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('novaflow_stats');
      return saved ? JSON.parse(saved) : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  });

  // Gemini API Key
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return localStorage.getItem('novaflow_gemini_key') || '';
  });

  // Active view
  const [currentView, setCurrentView] = useState('dashboard');

  // Theme: 'dark', 'light', 'midnight'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('novaflow_theme') || 'dark';
  });

  // Global Command Palette modal state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // Notifications/Toasts
  const [toasts, setToasts] = useState([]);

  // Auto-sync to localStorage
  useEffect(() => {
    localStorage.setItem('novaflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('novaflow_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('novaflow_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('novaflow_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('novaflow_gemini_key', geminiApiKey);
  }, [geminiApiKey]);

  useEffect(() => {
    localStorage.setItem('novaflow_theme', theme);
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'midnight');
    root.classList.add(theme);
  }, [theme]);

  // Toast dispatch
  const notify = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  // Task Actions
  const addTask = (newTask) => {
    const taskWithDefaults = {
      id: `task-${Date.now()}`,
      title: newTask.title || 'Untitled Task',
      description: newTask.description || '',
      category: newTask.category || 'General',
      priority: newTask.priority || 'Medium',
      status: newTask.status || 'To Do',
      dueDate: newTask.dueDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      subtasks: newTask.subtasks || [],
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [taskWithDefaults, ...prev]);
    notify(`Added "${taskWithDefaults.title}" to board`, 'success');
  };

  const updateTask = (taskId, updates) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    notify('Task removed', 'info');
  };

  const moveTask = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        if (newStatus === 'Completed' && t.status !== 'Completed') {
          setStats(s => ({ ...s, totalTasksCompleted: s.totalTasksCompleted + 1 }));
          notify(`Task "${t.title}" completed! 🎉`, 'success');
        }
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedSubs = (t.subtasks || []).map(st => 
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...t, subtasks: updatedSubs };
      }
      return t;
    }));
  };

  const generateAndAddSubtasks = (taskId) => {
    const target = tasks.find(t => t.id === taskId);
    if (!target) return;
    const generated = generateSubtasksForTask(target.title, target.description);
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: [...(t.subtasks || []), ...generated]
        };
      }
      return t;
    }));
    notify(`AI generated ${generated.length} subtasks for "${target.title}"`, 'success');
  };

  const addBatchTasks = (newTasksList) => {
    setTasks(prev => [...newTasksList, ...prev]);
    notify(`Loaded ${newTasksList.length} tasks directly to your board!`, 'success');
  };

  // Note Actions
  const addNote = (newNote) => {
    const note = {
      id: `note-${Date.now()}`,
      title: newNote.title || 'Untitled Note',
      content: newNote.content || '',
      tags: newNote.tags || ['General'],
      pinned: false,
      updatedAt: new Date().toISOString()
    };
    setNotes(prev => [note, ...prev]);
    notify(`Note "${note.title}" saved`, 'success');
  };

  const updateNote = (noteId, updates) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n));
  };

  const deleteNote = (noteId) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
    notify('Note deleted', 'info');
  };

  const togglePinNote = (noteId) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, pinned: !n.pinned } : n));
  };

  // Habit Actions
  const toggleHabit = (habitId) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const isNowDone = !h.completedToday;
        return {
          ...h,
          completedToday: isNowDone,
          streak: isNowDone ? h.streak + 1 : Math.max(0, h.streak - 1)
        };
      }
      return h;
    }));
  };

  const addHabit = (name, category = 'General') => {
    setHabits(prev => [...prev, {
      id: `habit-${Date.now()}`,
      name,
      category,
      streak: 1,
      completedToday: true
    }]);
    notify(`Added habit "${name}"`, 'success');
  };

  // Focus Session Logger
  const logFocusSession = (minutes) => {
    setStats(prev => ({
      ...prev,
      focusMinutesToday: prev.focusMinutesToday + minutes,
      sessionsCompletedToday: prev.sessionsCompletedToday + 1,
      currentStreakDays: prev.currentStreakDays + 1
    }));
    notify(`Great focus sprint! +${minutes} minutes logged.`, 'success');
  };

  // Reset demo data
  const resetToDemoData = () => {
    setTasks(INITIAL_TASKS);
    setNotes(INITIAL_NOTES);
    setHabits(INITIAL_HABITS);
    setStats(INITIAL_STATS);
    notify('Reset to default demo data', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        notes,
        habits,
        stats,
        currentView,
        setCurrentView,
        theme,
        setTheme,
        geminiApiKey,
        setGeminiApiKey,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isNewTaskModalOpen,
        setIsNewTaskModalOpen,
        toasts,
        notify,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        toggleSubtask,
        generateAndAddSubtasks,
        addBatchTasks,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        toggleHabit,
        addHabit,
        logFocusSession,
        resetToDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
