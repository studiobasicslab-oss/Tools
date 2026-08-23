import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Navigation, 
  Download, 
  Upload, 
  RotateCcw, 
  X, 
  Calendar, 
  Award, 
  Sparkles,
  FastForward,
  Filter
} from 'lucide-react';
import { 
  formatDistance, 
  formatDuration, 
  STUDY_SUBJECTS 
} from '../data/milestones';

export default function LogbookModal({
  careerSeconds,
  sessions,
  streakDays,
  exportDataJSON,
  importDataJSON,
  resetMissionProgress,
  addDebugSeconds,
  onClose
}) {
  const [filterSubject, setFilterSubject] = useState('all');

  const filteredSessions = sessions.filter((s) => {
    if (filterSubject === 'all') return true;
    return s.subject === filterSubject;
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      importDataJSON(event.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl bg-slate-950 border border-cyan-500/40 shadow-[0_0_80px_rgba(6,182,212,0.2)]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white font-syne">
                MISSION FLIGHT LOGBOOK
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Career History, Flight Leg Telemetry & Mission Archives
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs font-mono text-slate-400 mb-1">TOTAL FLIGHT TIME</div>
            <div className="text-base sm:text-lg font-bold text-white font-mono">
              {formatDuration(careerSeconds)}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs font-mono text-slate-400 mb-1">TOTAL DISTANCE</div>
            <div className="text-xs sm:text-sm font-bold text-cyan-400 font-mono truncate">
              {formatDistance(careerSeconds)}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs font-mono text-slate-400 mb-1">FLIGHT SESSIONS</div>
            <div className="text-base sm:text-lg font-bold text-indigo-300 font-mono">
              {sessions.length} Legs
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs font-mono text-slate-400 mb-1">CURRENT STREAK</div>
            <div className="text-base sm:text-lg font-bold text-amber-400 font-mono">
              {streakDays} Days
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Filter by Subject:
            </span>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Subjects ({sessions.length})</option>
              {STUDY_SUBJECTS.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Backup Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportDataJSON}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition"
              title="Download backup file"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              Backup
            </button>
            <label className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition">
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              Restore
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Flight Sessions List */}
        <div className="space-y-3 mb-8 max-h-64 overflow-y-auto pr-1">
          {filteredSessions.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
              <p className="text-xs text-slate-400 font-mono">
                No flight legs recorded yet. Engage your thrusters and complete a study flight!
              </p>
            </div>
          ) : (
            filteredSessions.map((s, idx) => {
              const subObj = STUDY_SUBJECTS.find((x) => x.id === s.subject);
              return (
                <div
                  key={s.id || idx}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between flex-wrap gap-3 hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 font-mono text-xs">
                      #{sessions.length - idx}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {subObj ? subObj.name : 'Cosmic Study'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {s.date}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-cyan-400 mt-0.5">
                        Duration: {formatDuration(s.durationSeconds)}
                      </div>
                    </div>
                  </div>

                  {s.milestonesGained && s.milestonesGained.length > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Unlocked: {s.milestonesGained.map((m) => m.name).join(', ')}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Mission Simulator & Danger Zone */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <FastForward className="w-3.5 h-3.5 text-cyan-400" />
              MISSION SIMULATOR / FAST-FORWARD
            </h4>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Instantly test and simulate long-distance space milestones without waiting days.
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <button
                onClick={() => addDebugSeconds(1500)} // +25 mins
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-mono transition"
              >
                +25 Mins (Karman Line)
              </button>
              <button
                onClick={() => addDebugSeconds(36000)} // +10 Hours (Moon)
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-mono transition"
              >
                +10 Hours (Moon Landing)
              </button>
              <button
                onClick={() => addDebugSeconds(162000)} // +45 Hours (Mars)
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 text-[11px] font-mono transition"
              >
                +45 Hours (Mars)
              </button>
            </div>
          </div>

          <button
            onClick={resetMissionProgress}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono flex items-center gap-1.5 transition shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Spacecraft to Earth
          </button>
        </div>
      </div>
    </div>
  );
}
