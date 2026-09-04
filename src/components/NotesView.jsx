import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Plus, 
  Search, 
  Pin, 
  Trash2, 
  Sparkles, 
  Target, 
  Check, 
  Tag, 
  Zap, 
  ArrowRight,
  ListTodo
} from 'lucide-react';
import { extractTasksFromNoteText } from '../services/aiService';

export default function NotesView() {
  const { 
    notes, 
    addNote, 
    updateNote, 
    deleteNote, 
    togglePinNote, 
    addBatchTasks, 
    setCurrentView,
    notify 
  } = useApp();

  const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  // Collect unique tags
  const allTags = ['All', ...new Set(notes.flatMap(n => n.tags || []))];

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'All' || (note.tags && note.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  }).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const handleCreateNewNote = () => {
    const newId = `note-${Date.now()}`;
    const fresh = {
      id: newId,
      title: 'Untitled Note',
      content: '',
      tags: ['Idea'],
      pinned: false
    };
    addNote(fresh);
    setActiveNoteId(newId);
  };

  // AI Action 1: Extract Actionable Tasks into Kanban
  const handleExtractTasks = () => {
    if (!activeNote || !activeNote.content.trim()) return;
    setIsProcessingAI(true);
    
    setTimeout(() => {
      const extracted = extractTasksFromNoteText(activeNote.content);
      if (extracted.length > 0) {
        addBatchTasks(extracted);
      } else {
        notify('No actionable tasks detected in this note text.', 'info');
      }
      setIsProcessingAI(false);
    }, 600);
  };

  // AI Action 2: Summarize Note
  const handleSummarizeNote = () => {
    if (!activeNote || !activeNote.content.trim()) return;
    setIsProcessingAI(true);

    setTimeout(() => {
      const lines = activeNote.content.split('\n').filter(l => l.trim());
      const preview = lines.slice(0, 3).map(l => l.replace(/^[#-*\s]+/, '')).join('; ');

      const summaryText = `\n\n### 🤖 AI Executive Summary\n- **Core Theme:** ${activeNote.title}\n- **Key Takeaway:** ${preview || 'Consolidated focus roadmap'}\n- **Action Verdict:** Ready for execution sprint.`;

      updateNote(activeNote.id, {
        content: activeNote.content + summaryText
      });
      notify('AI Executive Summary appended to note!', 'success');
      setIsProcessingAI(false);
    }, 600);
  };

  // AI Action 3: Polish & Structure
  const handlePolishNote = () => {
    if (!activeNote || !activeNote.content.trim()) return;
    setIsProcessingAI(true);

    setTimeout(() => {
      const cleaned = activeNote.content
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map((line, i) => i === 0 && !line.startsWith('#') ? `## ${line}` : line)
        .join('\n\n');

      updateNote(activeNote.id, { content: cleaned });
      notify('Note formatted and cleaned!', 'success');
      setIsProcessingAI(false);
    }, 500);
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Smart Notes & AI Scratchpad
          </h1>
          <p className="text-xs text-slate-400">Capture ideas, summarize insights, and turn notes directly into Kanban tickets</p>
        </div>

        <button
          onClick={handleCreateNewNote}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Col: Note Directory (4 cols) */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-4 border border-slate-800 space-y-4">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  selectedTag === tag
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Notes List */}
          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No notes found. Create one!
              </div>
            ) : (
              filteredNotes.map(note => {
                const isSelected = activeNote?.id === note.id;
                return (
                  <div
                    key={note.id}
                    onClick={() => setActiveNoteId(note.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-2 group ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md shadow-indigo-600/10'
                        : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`text-xs font-semibold leading-snug line-clamp-1 ${
                        isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'
                      }`}>
                        {note.title || 'Untitled Note'}
                      </h4>
                      {note.pinned && (
                        <Pin className="w-3 h-3 text-amber-400 shrink-0 fill-amber-400" />
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans">
                      {note.content.replace(/[#*`-]/g, '') || 'Empty note...'}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <div className="flex items-center gap-1">
                        {note.tags?.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            {t}
                          </span>
                        ))}
                      </div>
                      <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Col: Active Note Editor (8 cols) */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
          {activeNote ? (
            <>
              {/* Note Header & AI Toolbar */}
              <div className="space-y-4 pb-4 border-b border-slate-800">
                <div className="flex items-center justify-between gap-4">
                  <input
                    type="text"
                    value={activeNote.title}
                    onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                    placeholder="Note Title"
                    className="bg-transparent border-none text-lg sm:text-xl font-bold text-white placeholder:text-slate-600 focus:outline-none flex-1"
                  />

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => togglePinNote(activeNote.id)}
                      className={`p-2 rounded-lg border transition-colors ${
                        activeNote.pinned 
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                      title={activeNote.pinned ? 'Unpin Note' : 'Pin Note'}
                    >
                      <Pin className={`w-4 h-4 ${activeNote.pinned ? 'fill-amber-400' : ''}`} />
                    </button>

                    <button
                      onClick={() => deleteNote(activeNote.id)}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* AI Transformations Toolbar */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Actions:
                  </span>

                  <button
                    onClick={handleExtractTasks}
                    disabled={isProcessingAI}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    title="Converts bullet points into Kanban cards"
                  >
                    <ListTodo className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Extract to Kanban</span>
                  </button>

                  <button
                    onClick={handleSummarizeNote}
                    disabled={isProcessingAI}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Summarize</span>
                  </button>

                  <button
                    onClick={handlePolishNote}
                    disabled={isProcessingAI}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Format & Clean</span>
                  </button>
                </div>
              </div>

              {/* Note Content Area */}
              <div className="space-y-2">
                <textarea
                  rows={16}
                  value={activeNote.content}
                  onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                  placeholder="Start writing thoughts, markdown notes, meeting summaries, or goals..."
                  className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed resize-y"
                />
              </div>

              {/* Note Footer */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Tag className="w-3 h-3 text-slate-400" />
                  <input
                    type="text"
                    value={activeNote.tags?.join(', ') || ''}
                    onChange={(e) => updateNote(activeNote.id, { tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="Comma separated tags: Focus, Idea, Sprint"
                    className="bg-transparent border-none text-xs text-slate-400 focus:outline-none focus:text-slate-200"
                  />
                </div>
                <span>Auto-saved</span>
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-slate-500">
              Select or create a note to get started.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
