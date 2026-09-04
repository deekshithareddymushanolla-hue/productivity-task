import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sliders, 
  Key, 
  Moon, 
  Sun, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Eye, 
  EyeOff, 
  Zap, 
  ShieldAlert 
} from 'lucide-react';
import { askGeminiAPI } from '../services/aiService';

export default function SettingsModal() {
  const { 
    isSettingsOpen, 
    setIsSettingsOpen, 
    geminiApiKey, 
    setGeminiApiKey, 
    theme, 
    setTheme, 
    tasks, 
    notes, 
    habits, 
    stats, 
    resetToDemoData, 
    notify 
  } = useApp();

  const [keyInput, setKeyInput] = useState(geminiApiKey);
  const [showKey, setShowKey] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isSettingsOpen) return null;

  const handleSaveKey = () => {
    setGeminiApiKey(keyInput.trim());
    notify('Gemini API key updated', 'success');
  };

  const handleTestKey = async () => {
    if (!keyInput.trim()) {
      setTestResult({ success: false, message: 'Please enter an API key first.' });
      return;
    }
    setIsTestingKey(true);
    setTestResult(null);

    try {
      await askGeminiAPI(keyInput.trim(), 'Respond with "Connected successfully"');
      setTestResult({ success: true, message: 'Gemini API verified and connected!' });
      setGeminiApiKey(keyInput.trim());
    } catch (err) {
      setTestResult({ success: false, message: err.message || 'Verification failed.' });
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleExportData = () => {
    const backup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      tasks,
      notes,
      habits,
      stats
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `novaflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    notify('Workspace backup downloaded!', 'success');
  };

  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.tasks) localStorage.setItem('novaflow_tasks', JSON.stringify(parsed.tasks));
        if (parsed.notes) localStorage.setItem('novaflow_notes', JSON.stringify(parsed.notes));
        if (parsed.habits) localStorage.setItem('novaflow_habits', JSON.stringify(parsed.habits));
        if (parsed.stats) localStorage.setItem('novaflow_stats', JSON.stringify(parsed.stats));
        notify('Data restored! Reloading workspace...', 'success');
        setTimeout(() => window.location.reload(), 800);
      } catch (err) {
        notify('Invalid backup JSON file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="glass-panel rounded-2xl border border-slate-800 max-w-lg w-full p-6 space-y-6 shadow-2xl animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">System Settings & Data Control</h3>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(false)}
            className="text-slate-400 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>

        {/* Section 1: AI Provider (Gemini API) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>Google Gemini API Key (Optional)</span>
            </label>
            <span className="text-[10px] text-slate-400">Enables live Gemini 1.5/2.0 Flash</span>
          </div>

          <div className="relative flex items-center">
            <input
              type={showKey ? 'text' : 'password'}
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 pr-16 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 p-1.5 text-slate-400 hover:text-slate-200"
              title={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveKey}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Save Key
            </button>
            <button
              type="button"
              onClick={handleTestKey}
              disabled={isTestingKey}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{isTestingKey ? 'Testing...' : 'Test Connection'}</span>
            </button>
            {geminiApiKey && (
              <button
                type="button"
                onClick={() => {
                  setKeyInput('');
                  setGeminiApiKey('');
                  notify('Cleared API Key. Reverted to Built-in Engine.', 'info');
                }}
                className="text-xs text-slate-500 hover:text-rose-400 ml-auto"
              >
                Clear
              </button>
            )}
          </div>

          {testResult && (
            <p className={`text-xs ${testResult.success ? 'text-emerald-400' : 'text-rose-400'} pt-1`}>
              {testResult.message}
            </p>
          )}

          <p className="text-[11px] text-slate-400 leading-relaxed">
            *If no API key is set, NovaFlow AI automatically uses its high-capability built-in offline intelligence engine with instant responses.
          </p>
        </div>

        {/* Section 2: Theme Selector */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-semibold text-white block">Theme Mode</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'dark', label: 'Dark Slate', icon: Moon },
              { id: 'midnight', label: 'Midnight OLED', icon: ShieldAlert },
              { id: 'light', label: 'Clean Light', icon: Sun },
            ].map(t => {
              const Icon = t.icon;
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-500 text-white font-medium'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Data Portability & Backup */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <label className="text-xs font-semibold text-white block">Workspace Backup & Reset</label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportData}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export JSON Backup</span>
            </button>

            <label className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Restore JSON Backup</span>
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
            </label>

            <button
              onClick={resetToDemoData}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 text-xs font-medium flex items-center gap-1.5 transition-colors ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
