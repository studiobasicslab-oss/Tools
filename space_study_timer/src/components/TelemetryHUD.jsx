import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Zap, 
  Gauge, 
  Navigation, 
  Compass, 
  Sparkles, 
  Target,
  Clock,
  Layers,
  ChevronRight,
  Flame,
  TrainTrack,
  Rocket,
  MapPin
} from 'lucide-react';
import { 
  formatDistance, 
  formatDuration, 
  formatTimeDigital, 
  STUDY_SUBJECTS 
} from '../data/milestones';
import { formatTrainDistance } from '../data/trainMilestones';

export default function TelemetryHUD({
  theme,
  isFlying,
  isPaused,
  sessionSeconds,
  sessionMode,
  targetDurationSeconds,
  currentTotalSeconds,
  progressInfo,
  currentSubject,
  setCurrentSubject,
  startFlight,
  pauseFlight,
  resumeFlight,
  concludeFlight
}) {
  const [selectedPreset, setSelectedPreset] = useState('25');

  const { currentMilestone, nextMilestone, progressPercent, remainingSeconds } = progressInfo;

  let displayTime = '';
  let subTimerLabel = '';
  if (sessionMode === 'open') {
    displayTime = formatTimeDigital(sessionSeconds);
    subTimerLabel = theme === 'space' ? 'MISSION ELAPSED' : 'EXPEDITION ELAPSED';
  } else if (targetDurationSeconds > 0) {
    const rem = Math.max(0, targetDurationSeconds - sessionSeconds);
    displayTime = formatTimeDigital(rem);
    subTimerLabel = `COUNTDOWN (${Math.round(targetDurationSeconds / 60)}M TARGET)`;
  } else {
    displayTime = '00:00';
    subTimerLabel = theme === 'space' ? 'ENGINES IDLE' : 'LOCOMOTIVE IN STATION';
  }

  // Velocity display
  const velocityDisplay = isFlying 
    ? (theme === 'space' 
        ? (currentTotalSeconds > 10000 ? '42,190 km/h • WARP 1.4' : '27,850 km/h • ORBITAL') 
        : '280 km/h • EXPRESS STEAM')
    : '0.00 km/h • STOPPED';

  const distanceText = theme === 'space' 
    ? formatDistance(currentTotalSeconds) 
    : formatTrainDistance(currentTotalSeconds);

  return (
    <div className="relative z-10 flex flex-col items-center justify-between min-h-[calc(100vh-80px)] p-4 md:p-8 pointer-events-none">
      {/* Top Telemetry Floating Status Card */}
      <div className="w-full max-w-4xl pointer-events-auto grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Metric 1: Distance */}
        <div className={`p-3.5 rounded-2xl bg-slate-950/75 border backdrop-blur-md shadow-lg flex flex-col justify-between ${
          theme === 'space' ? 'border-cyan-500/20' : 'border-amber-500/20'
        }`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
            <span className="flex items-center gap-1.5">
              <Navigation className={`w-3.5 h-3.5 ${theme === 'space' ? 'text-cyan-400' : 'text-amber-400'}`} />
              DISTANCE
            </span>
            <span className={`text-[10px] font-bold ${theme === 'space' ? 'text-cyan-400' : 'text-amber-400'}`}>TOTAL</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-white font-mono tracking-tight">
            {distanceText}
          </div>
        </div>

        {/* Metric 2: Current Location */}
        <div className={`p-3.5 rounded-2xl bg-slate-950/75 border backdrop-blur-md shadow-lg flex flex-col justify-between ${
          theme === 'space' ? 'border-cyan-500/20' : 'border-amber-500/20'
        }`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
            <span className="flex items-center gap-1.5">
              {theme === 'space' ? (
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
              )}
              {theme === 'space' ? 'SECTOR' : 'STATION'}
            </span>
            <span className="text-[10px] text-indigo-400 font-bold">POS</span>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-indigo-200 truncate" title={currentMilestone.name}>
            {currentMilestone.name}
          </div>
        </div>

        {/* Metric 3: Next Destination */}
        <div className={`p-3.5 rounded-2xl bg-slate-950/75 border backdrop-blur-md shadow-lg flex flex-col justify-between ${
          theme === 'space' ? 'border-cyan-500/20' : 'border-amber-500/20'
        }`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
            <span className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              NEXT STOP
            </span>
            <span className="text-[10px] text-amber-400 font-bold">{Math.round(progressPercent)}%</span>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-amber-200 truncate" title={nextMilestone ? nextMilestone.name : 'World Champion'}>
            {nextMilestone ? nextMilestone.name : 'End of Line'}
          </div>
        </div>

        {/* Metric 4: Speed */}
        <div className={`p-3.5 rounded-2xl bg-slate-950/75 border backdrop-blur-md shadow-lg flex flex-col justify-between ${
          theme === 'space' ? 'border-cyan-500/20' : 'border-amber-500/20'
        }`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              VELOCITY
            </span>
            <span className={`text-[10px] font-bold ${isFlying ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`}>
              {isFlying ? 'ROLLING' : 'IDLE'}
            </span>
          </div>
          <div className="text-xs font-mono text-emerald-300 truncate">
            {velocityDisplay}
          </div>
        </div>
      </div>

      {/* Center Cinematic Mission Clock & Controls */}
      <div className="w-full max-w-xl pointer-events-auto my-auto flex flex-col items-center">
        {/* Main Cockpit Glass Container */}
        <div className={`relative w-full p-6 md:p-8 rounded-3xl bg-slate-950/80 border backdrop-blur-xl flex flex-col items-center text-center shadow-2xl ${
          theme === 'space' 
            ? 'border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)]' 
            : 'border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)]'
        }`}>
          
          {/* Active Flight State Tag */}
          <div className="flex items-center gap-2 mb-3">
            {isFlying ? (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border ${
                theme === 'space'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}>
                {theme === 'space' ? (
                  <Rocket className="w-3.5 h-3.5 animate-bounce text-cyan-400" />
                ) : (
                  <TrainTrack className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                )}
                {isPaused 
                  ? (theme === 'space' ? 'ORBITAL HOLD (PAUSED)' : 'STATION STOP (PAUSED)')
                  : (theme === 'space' ? 'THRUSTERS ACTIVE • TRAVELLING' : 'TRAIN CHUGGING • TRAVELLING')}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-800/80 text-slate-300 border border-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                RESTING AT {currentMilestone.name.toUpperCase()}
              </span>
            )}
          </div>

          {/* Large Digital Clock */}
          <div className={`text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text font-mono my-2 ${
            theme === 'space'
              ? 'bg-gradient-to-b from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.3)]'
              : 'bg-gradient-to-b from-white via-amber-100 to-amber-400 drop-shadow-[0_0_25px_rgba(245,158,11,0.3)]'
          }`}>
            {displayTime}
          </div>

          <div className={`text-xs font-mono tracking-widest uppercase mb-5 ${
            theme === 'space' ? 'text-cyan-400/80' : 'text-amber-400/80'
          }`}>
            {subTimerLabel}
          </div>

          {/* Next Waypoint Progress Gauge */}
          {nextMilestone && (
            <div className="w-full mb-6 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-slate-400 flex items-center gap-1">
                  <span>En Route to:</span>
                  <strong className="text-white">{nextMilestone.name}</strong>
                </span>
                <span className={`font-bold ${theme === 'space' ? 'text-cyan-400' : 'text-amber-400'}`}>
                  {formatDuration(remainingSeconds)} remaining
                </span>
              </div>
              <div className="relative w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 shadow-md ${
                    theme === 'space'
                      ? 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-amber-400 shadow-cyan-500/50'
                      : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-400 shadow-amber-500/50'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Subject / Mission Objective Selector */}
          <div className="w-full flex items-center justify-center gap-2 mb-6 flex-wrap">
            <span className="text-xs text-slate-400 font-mono mr-1">SUBJECT:</span>
            {STUDY_SUBJECTS.map((sub) => {
              const isSelected = currentSubject === sub.id;
              return (
                <button
                  key={sub.id}
                  disabled={isFlying}
                  onClick={() => setCurrentSubject(sub.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? (theme === 'space' 
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                          : 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]')
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 disabled:opacity-50'
                  }`}
                >
                  {sub.name.split('&')[0].trim()}
                </button>
              );
            })}
          </div>

          {/* Mode Selector Presets */}
          {!isFlying && (
            <div className="w-full mb-6">
              <div className="text-xs text-slate-400 font-mono mb-2 text-left">SELECT STUDY DURATION:</div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { id: 'open', label: 'Open Trip', desc: 'No Limit' },
                  { id: '25', label: '25m', desc: 'Pomodoro' },
                  { id: '45', label: '45m', desc: 'Deep Work' },
                  { id: '60', label: '60m', desc: 'Express' },
                  { id: '90', label: '90m', desc: 'Odyssey' },
                  { id: 'break_5', label: '5m Rest', desc: 'Station' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedPreset(item.id)}
                    className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                      selectedPreset === item.id
                        ? (theme === 'space'
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 border shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                            : 'bg-amber-500/20 border-amber-500 text-amber-300 border shadow-[0_0_10px_rgba(245,158,11,0.2)]')
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 border'
                    }`}
                  >
                    <span className="text-xs font-bold">{item.label}</span>
                    <span className="text-[9px] text-slate-500">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="w-full flex items-center justify-center gap-4">
            {!isFlying ? (
              <button
                onClick={() => startFlight(selectedPreset)}
                className={`w-full py-4 px-8 rounded-2xl text-slate-950 font-black text-base md:text-lg tracking-wider font-syne flex items-center justify-center gap-3 shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                  theme === 'space'
                    ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                    : 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-rose-400 shadow-[0_0_30px_rgba(245,158,11,0.4)]'
                }`}
              >
                <Play className="w-6 h-6 fill-current" />
                {theme === 'space' ? 'ENGAGE MAIN THRUSTERS (START STUDY)' : 'ALL ABOARD! DEPART STATION (START STUDY)'}
              </button>
            ) : (
              <div className="w-full flex items-center gap-3">
                {isPaused ? (
                  <button
                    onClick={resumeFlight}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm md:text-base tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    RESUME JOURNEY
                  </button>
                ) : (
                  <button
                    onClick={pauseFlight}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm md:text-base tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition"
                  >
                    <Pause className="w-5 h-5 fill-current" />
                    {theme === 'space' ? 'HOLD ORBIT (PAUSE)' : 'STATION STOP (PAUSE)'}
                  </button>
                )}

                <button
                  onClick={concludeFlight}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 font-bold text-sm md:text-base tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.2)] transition"
                >
                  <Square className="w-5 h-5 fill-current" />
                  CONCLUDE SESSION & REPORT
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Lore Card */}
      <div className="w-full max-w-2xl pointer-events-auto">
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md text-center">
          <p className="text-xs text-slate-400 font-mono flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <strong className="text-slate-200">{currentMilestone.name}:</strong> {currentMilestone.fact}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
