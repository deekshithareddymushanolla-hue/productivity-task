import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Headphones, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Music 
} from 'lucide-react';
import { soundService } from '../services/soundService';
import confetti from 'canvas-confetti';

export default function FocusTimer() {
  const { stats, logFocusSession } = useApp();

  const presets = [
    { id: 'pomo', label: 'Pomodoro', minutes: 25 },
    { id: 'deep', label: 'Deep Focus', minutes: 50 },
    { id: 'short', label: 'Short Break', minutes: 5 },
    { id: 'long', label: 'Long Break', minutes: 15 },
  ];

  const soundscapes = [
    { id: 'off', label: 'Silent', icon: '🔇' },
    { id: 'binaural_gamma', label: '40Hz Gamma (Focus)', icon: '🧠' },
    { id: 'binaural_alpha', label: '10Hz Alpha (Flow)', icon: '🌊' },
    { id: 'rain', label: 'Gentle Rain', icon: '🌧️' },
    { id: 'brown_noise', label: 'Warm Brown Noise', icon: '☕' },
  ];

  const [activePreset, setActivePreset] = useState(presets[0]);
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  
  // Sound controls
  const [currentSound, setCurrentSound] = useState('off');
  const [volume, setVolume] = useState(0.5);

  const timerRef = useRef(null);

  // Switch presets
  const handleSelectPreset = (preset) => {
    setIsRunning(false);
    setActivePreset(preset);
    const secs = preset.minutes * 60;
    setTotalSeconds(secs);
    setTimeLeft(secs);
  };

  // Timer Tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleCompleteSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, activePreset]);

  // Session Completed
  const handleCompleteSession = () => {
    setIsRunning(false);
    soundService.stop();
    setCurrentSound('off');

    // Chime & Confetti
    soundService.playCompletionChime();
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }

    if (activePreset.id === 'pomo' || activePreset.id === 'deep') {
      logFocusSession(activePreset.minutes);
    }
  };

  // Ambient sound handler
  const handleToggleSound = (soundId) => {
    setCurrentSound(soundId);
    soundService.play(soundId);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundService.setVolume(val);
  };

  // Stop sound on unmount
  useEffect(() => {
    return () => {
      soundService.stop();
    };
  }, []);

  // Format time
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Progress percentage
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  // SVG Ring calculation
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="space-y-8 pb-16 animate-fadeIn max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
          <Headphones className="w-3.5 h-3.5" />
          <span>Neuro-Acoustic Focus Protocol</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Focus Flow & Soundscapes</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Synchronize brainwaves with Web Audio synthesized binaural frequencies and deep work sprints.
        </p>
      </div>

      {/* Main Timer Display */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
        
        {/* Presets Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 z-10">
          {presets.map(preset => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activePreset.id === preset.id
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/30 scale-105'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {preset.label} ({preset.minutes}m)
            </button>
          ))}
        </div>

        {/* Circular SVG Timer */}
        <div className="relative flex items-center justify-center w-72 h-72 sm:w-80 sm:h-80 z-10">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 300 300">
            {/* Background track */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-800/80"
              fill="transparent"
            />
            {/* Active stroke */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke="url(#gradientStroke)"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
              fill="transparent"
            />
            <defs>
              <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Digital Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-1">
            <span className="text-5xl sm:text-6xl font-black font-mono text-white tracking-tighter drop-shadow-md">
              {formattedTime}
            </span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              {isRunning ? 'Flow Active' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center gap-4 mt-8 z-10">
          <button
            onClick={() => {
              setTimeLeft(activePreset.minutes * 60);
              setIsRunning(false);
            }}
            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              const willRun = !isRunning;
              setIsRunning(willRun);
              if (willRun && currentSound === 'off') {
                // Auto-suggest 40Hz Gamma if silent
                handleToggleSound('binaural_gamma');
              }
            }}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-white" />
                <span>Pause Sprint</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Start Focus Flow</span>
              </>
            )}
          </button>

          <button
            onClick={handleCompleteSession}
            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Skip / Finish Early"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Ambient Waves Generator */}
        <div className="w-full max-w-xl mt-10 pt-6 border-t border-slate-800/80 space-y-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Music className="w-4 h-4 text-cyan-400" />
              <span>Ambient Soundscape Synthesizer (Web Audio API)</span>
            </div>
            {currentSound !== 'off' && (
              <span className="text-[10px] text-cyan-400 font-mono animate-pulse">Playing</span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {soundscapes.map(sound => (
              <button
                key={sound.id}
                onClick={() => handleToggleSound(sound.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  currentSound === sound.id
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-white shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-base block mb-1">{sound.icon}</span>
                <span className="text-[11px] font-medium block leading-tight">{sound.label}</span>
              </button>
            ))}
          </div>

          {/* Volume Slider */}
          {currentSound !== 'off' && (
            <div className="flex items-center gap-3 pt-2">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="text-xs font-mono text-slate-400 min-w-[32px]">
                {Math.round(volume * 100)}%
              </span>
            </div>
          )}
        </div>

      </div>

      {/* Daily Focus Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Minutes Logged</p>
            <h4 className="text-base font-bold text-white">{stats.focusMinutesToday} mins</h4>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Completed Sprints</p>
            <h4 className="text-base font-bold text-white">{stats.sessionsCompletedToday} sessions</h4>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Daily Target</p>
            <h4 className="text-base font-bold text-white">{stats.dailyGoalMinutes} mins ({Math.round((stats.focusMinutesToday/stats.dailyGoalMinutes)*100)}%)</h4>
          </div>
        </div>
      </div>

    </div>
  );
}
