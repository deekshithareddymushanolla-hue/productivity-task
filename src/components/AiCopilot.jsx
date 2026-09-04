import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Target, 
  Mail, 
  FileText, 
  Brain, 
  PlusCircle, 
  Check, 
  Copy, 
  RotateCcw, 
  Zap, 
  Sliders, 
  ArrowRight 
} from 'lucide-react';
import { generateOfflineResponse, askGeminiAPI } from '../services/aiService';

export default function AiCopilot() {
  const { 
    tasks, 
    geminiApiKey, 
    setIsSettingsOpen, 
    addBatchTasks, 
    setCurrentView 
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [activeMode, setActiveMode] = useState('goal_breakdown');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  // Initial message thread
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I am your **NovaFlow AI Productivity Copilot**.\n\nI can help you deconstruct ambiguous goals into actionable Kanban tickets, polish executive emails, synthesize your daily standup, and optimize your focus rhythm.\n\nChoose a mode above or ask me anything!`,
      structuredTasks: null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const modes = [
    { id: 'goal_breakdown', label: 'Goal Deconstructor', icon: Target, desc: 'Break any project into Kanban tasks' },
    { id: 'email_polish', label: 'Smart Rewriter', icon: Mail, desc: 'Polish emails and messages' },
    { id: 'daily_standup', label: 'Daily Standup', icon: FileText, desc: 'Synthesize today\'s progress report' },
    { id: 'focus_coach', label: 'Cognitive Coach', icon: Brain, desc: 'Focus protocols & anti-distraction' },
  ];

  const quickPrompts = {
    goal_breakdown: [
      'Break down: Launch AI Productivity Website with MVP features',
      'Break down: Prepare quarterly product roadmap & design sprint',
      'Break down: Build a high-converting landing page',
    ],
    email_polish: [
      'Rephrase: Hey team, we need the report finished ASAP by 3pm today or we miss the deadline.',
      'Polish into persuasive pitch: We want to introduce NovaFlow AI to boost productivity across engineering.',
    ],
    daily_standup: [
      'Synthesize my daily standup from active tasks',
      'Create an end-of-week accomplishments retro summary',
    ],
    focus_coach: [
      'I have been context-switching and feeling unfocused. What should I do?',
      'How do I structure a 4-hour deep work block for peak cognitive flow?',
    ]
  };

  const handleSend = async (textToSend = inputMessage) => {
    const query = textToSend.trim();
    if (!query || isLoading) return;

    // Add user message
    const userMsg = {
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let responseText = '';
      let structuredTasks = null;

      // Extract context for standup
      const completedTasks = tasks.filter(t => t.status === 'Completed').map(t => t.title);
      const inProgressTasks = tasks.filter(t => t.status === 'In Progress').map(t => t.title);

      if (geminiApiKey) {
        // Live Gemini API Call
        try {
          const systemPrompt = `You are NovaFlow AI, an elite executive productivity copilot. Provide crisp, structured, high-value advice. Format with markdown bullets and clear action steps. If breaking down a goal, provide structured items. Current active tasks: ${inProgressTasks.join(', ')}. Completed: ${completedTasks.join(', ')}.`;
          responseText = await askGeminiAPI(geminiApiKey, query, systemPrompt);
        } catch (apiErr) {
          // Fallback to offline engine if Gemini network error
          console.warn('Gemini request failed, using intelligent offline fallback');
          const offlineRes = generateOfflineResponse(query, activeMode, { completedTasks, inProgressTasks });
          responseText = `${offlineRes.text}\n\n*(Note: Generated via Built-in Engine due to API connection issue)*`;
          structuredTasks = offlineRes.tasks || null;
        }
      } else {
        // Built-in intelligent offline engine
        const offlineRes = generateOfflineResponse(query, activeMode, { completedTasks, inProgressTasks });
        responseText = offlineRes.text;
        structuredTasks = offlineRes.tasks || null;
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: responseText,
          structuredTasks,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `An error occurred while generating response: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content, index) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handlePushToKanban = (tasksList) => {
    if (!tasksList || tasksList.length === 0) return;
    addBatchTasks(tasksList);
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Top Header & Mode Selectors */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                NovaFlow AI Copilot
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {geminiApiKey ? 'Gemini 1.5 Flash Connected' : 'Offline Intelligence Engine'}
                </span>
              </h1>
              <p className="text-xs text-slate-400">Contextual task decomposition, executive writing & workflow planning</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!geminiApiKey && (
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Connect Gemini API</span>
              </button>
            )}
            <button
              onClick={() => setMessages([messages[0]])}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              title="Clear Thread"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
          {modes.map(mode => {
            const Icon = mode.icon;
            const isSelected = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500/60 text-white shadow-md shadow-indigo-600/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-semibold">{mode.label}</span>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1">{mode.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Prompts Chips */}
      {quickPrompts[activeMode] && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">Suggested:</span>
          {quickPrompts[activeMode].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputMessage(prompt);
                handleSend(prompt);
              }}
              className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-indigo-300 whitespace-nowrap text-xs transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800 min-h-[420px] max-h-[620px] overflow-y-auto space-y-6">
        {messages.map((msg, index) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div 
              key={index}
              className={`flex gap-3.5 ${isAssistant ? 'items-start' : 'items-start flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isAssistant 
                  ? 'bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20' 
                  : 'bg-slate-700 text-slate-200'
              }`}>
                {isAssistant ? <Bot className="w-4 h-4" /> : <span className="text-xs font-bold font-mono">YOU</span>}
              </div>

              {/* Message Bubble */}
              <div className={`space-y-2 max-w-[85%] sm:max-w-[75%] ${isAssistant ? 'text-left' : 'text-left'}`}>
                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isAssistant 
                    ? 'bg-slate-900/90 border border-slate-800 text-slate-200 shadow-sm' 
                    : 'bg-indigo-600 text-white font-medium rounded-tr-none'
                }`}>
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {/* If structured tasks were generated, offer 1-click push to Kanban */}
                  {msg.structuredTasks && msg.structuredTasks.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5" />
                          {msg.structuredTasks.length} Actionable Kanban Tasks Ready
                        </span>
                        <button
                          onClick={() => {
                            handlePushToKanban(msg.structuredTasks);
                            setCurrentView('tasks');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Push All to Kanban Board</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {msg.structuredTasks.map((t, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                              {t.priority}
                            </span>
                            <p className="font-medium text-slate-200 line-clamp-1">{t.title}</p>
                            <p className="text-[10px] text-slate-400">{t.subtasks?.length || 0} subtasks</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer bar with timestamp and copy button */}
                <div className="flex items-center gap-2 px-1 text-[11px] text-slate-500">
                  <span>{msg.timestamp}</span>
                  {isAssistant && (
                    <button
                      onClick={() => handleCopy(msg.content, index)}
                      className="hover:text-slate-300 flex items-center gap-1 transition-colors"
                      title="Copy response"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-center text-xs text-slate-400">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-xs font-mono ml-2 text-slate-300">NovaFlow AI reasoning...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="glass-panel rounded-2xl p-2.5 border border-slate-800 flex items-center gap-2 shadow-xl focus-within:border-indigo-500/60 transition-colors"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={
            activeMode === 'goal_breakdown' 
              ? 'Enter any project or goal to decompose into Kanban tasks...' 
              : activeMode === 'email_polish' 
              ? 'Paste draft message or email to polish...' 
              : 'Ask NovaFlow AI anything...'
          }
          className="flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 px-3 py-2 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className={`p-2.5 rounded-xl font-medium transition-all ${
            inputMessage.trim() && !isLoading
              ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-600/30 hover:scale-105 active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
