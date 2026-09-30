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
  MapPin,
  Droplet,
  Palette,
  Thermometer,
  ShieldCheck
} from 'lucide-react';
import { 
  formatDistance, 
  formatDuration, 
  formatTimeDigital, 
  STUDY_SUBJECTS 
} from '../data/milestones';
import { formatTrainDistance } from '../data/trainMilestones';
import { ICE_STYLES, CANDLE_STYLES } from '../data/iceCandleStyles';

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
  selectedIceStyle,
  selectedCandleStyle,
  setShowStylePickerModal,
  startFlight,
  pauseFlight,
  resumeFlight,
  concludeFlight
}) {
  const [selectedPreset, setSelectedPreset] = useState('25');

  const { currentMilestone, nextMilestone, progressPercent, remainingSeconds } = progressInfo;

  // Active styles
  const activeIce = ICE_STYLES.find((s) => s.id === selectedIceStyle) || ICE_STYLES[0];
  const activeCandle = CANDLE_STYLES.find((s) => s.id === selectedCandleStyle) || CANDLE_STYLES[0];

  // Dynamic Melt / Burn ratios
  let meltBurnRatio = 0;
  if (targetDurationSeconds > 0) {
    meltBurnRatio = Math.min(1, sessionSeconds / targetDurationSeconds);
  } else {
    meltBurnRatio = (sessionSeconds % 2700) / 2700;
  }
  const remainingSolidPercent = Math.max(0, Math.round((1 - meltBurnRatio) * 100));

  let displayTime = '';
  let subTimerLabel = '';
  if (sessionMode === 'open') {
    displayTime = formatTimeDigital(sessionSeconds);
    if (theme === 'space') subTimerLabel = 'MISSION ELAPSED';
    else if (theme === 'train') subTimerLabel = 'EXPEDITION ELAPSED';
    else if (theme === 'ice') subTimerLabel = 'MELTING ELAPSED (OPEN FOCUS)';
    else subTimerLabel = 'BURNING ELAPSED (SANCTUARY FOCUS)';
  } else if (targetDurationSeconds > 0) {
    const rem = Math.max(0, targetDurationSeconds - sessionSeconds);
    displayTime = formatTimeDigital(rem);
    if (theme === 'ice') {
      subTimerLabel = `UNTIL ICE MELTS (${Math.round(targetDurationSeconds / 60)}M TARGET)`;
    } else if (theme === 'candle') {
      subTimerLabel = `UNTIL CANDLE BURNS OUT (${Math.round(targetDurationSeconds / 60)}M TARGET)`;
    } else {
      subTimerLabel = `COUNTDOWN (${Math.round(targetDurationSeconds / 60)}M TARGET)`;
    }
  } else {
    displayTime = '00:00';
    if (theme === 'space') subTimerLabel = 'ENGINES IDLE';
    else if (theme === 'train') subTimerLabel = 'LOCOMOTIVE IN STATION';
    else if (theme === 'ice') subTimerLabel = 'ICE CUBE FROZEN SOLID • READY';
    else subTimerLabel = 'CANDLE UNLIT • READY';
  }

  // Distance / Velocity display for space & train
  const distanceText = theme === 'space' 
    ? formatDistance(currentTotalSeconds) 
    : formatTrainDistance(currentTotalSeconds);

  return (
    <div className="relative z-10 flex flex-col items-center justify-between min-h-[calc(100vh-70px)] p-2 sm:p-4 md:p-6 pointer-events-none">
      
      {/* Top Floating Metric Strip */}
      <div className="w-full max-w-4xl pointer-events-auto grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        {theme === 'space' || theme === 'train' ? (
          <>
            {/* Metric 1: Distance */}
            <div className={`p-2.5 sm:p-3 rounded-2xl bg-slate-950/65 border backdrop-blur-md shadow-lg flex flex-col justify-between ${
              theme === 'space' ? 'border-cyan-500/20' : 'border-amber-500/20'
            }`}>
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                <span className="flex items-center gap-1">
                  <Navigation className={`w-3 h-3 ${theme === 'space' ? 'text-cyan-400' : 'text-amber-400'}`} />
                  DISTANCE
                </span>
                <span className={`text-[9px] font-bold ${theme === 'space' ? 'text-cyan-400' : 'text-amber-400'}`}>TOTAL</span>
              </div>
              <div className="text-sm font-bold text-white font-mono tracking-tight mt-0.5">
                {distanceText}
              </div>
            </div>

            {/* Metric 2: Current Location */}
            <div className={`p-2.5 sm:p-3 rounded-2xl bg-slate-950/65 border backdrop-blur-md shadow-lg flex flex-col justify-between ${
              theme === 'space' ? 'border-cyan-500/20' : 'border-amber-500/20'
            }`}>
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                <span className="flex items-center gap-1">
                  {theme === 'space' ? <Compass className="w-3 h-3 text-indigo-400" /> : <MapPin className="w-3 h-3 text-amber-400" />}
                  {theme === 'space' ? 'SECTOR' : 'STATION'}
                </span>
                <span className="text-[9px] text-indigo-400 font-bold">POS</span>
              </div>
              <div className="text-xs font-semibold text-indigo-200 truncate mt-0.5" title={currentMilestone.name}>
                {currentMilestone.name}
              </div>
            </div>

            {/* Metric 3: Next Destination */}
            <div className={`p-2.5 sm:p-3 rounded-2xl bg-slate-950/65 border backdrop-blur-md shadow-lg flex flex-col justify-between ${
              theme === 'space' ? 'border-cyan-500/20' : 'border-amber-500/20'
            }`}>
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                <span className="flex items-center gap-1">
                  <Target className="w-3 h-3 text-amber-400" />
                  NEXT STOP
                </span>
                <span className="text-[9px] text-amber-400 font-bold">{Math.round(progressPercent)}%</span>
              </div>
              <div className="text-xs font-semibold text-amber-200 truncate mt-0.5" title={nextMilestone ? nextMilestone.name : 'World Champion'}>
                {nextMilestone ? nextMilestone.name : 'End of Line'}
              </div>
            </div>

            {/* Metric 4: Speed */}
            <div className={`p-2.5 sm:p-3 rounded-2xl bg-slate-950/65 border backdrop-blur-md shadow-lg flex flex-col justify-between ${
              theme === 'space' ? 'border-cyan-500/20' : 'border-amber-500/20'
            }`}>
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                <span className="flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-emerald-400" />
                  VELOCITY
                </span>
                <span className={`text-[9px] font-bold ${isFlying ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`}>
                  {isFlying ? 'ACTIVE' : 'IDLE'}
                </span>
              </div>
              <div className="text-xs font-mono text-emerald-300 truncate mt-0.5">
                {isFlying ? (theme === 'space' ? '28,000 km/h • ORBIT' : '280 km/h • STEAM') : '0.00 km/h • IDLE'}
              </div>
            </div>
          </>
        ) : theme === 'ice' ? (
          <>
            {/* Metric 1: Ice Solidity */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-950/65 border border-sky-500/20 backdrop-blur-md shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                <span className="flex items-center gap-1">
                  <Droplet className="w-3 h-3 text-sky-400" />
                  ICE SOLIDITY
                </span>
                <span className="text-[9px] font-bold text-sky-400">{remainingSolidPercent}%</span>
              </div>
              <div className="text-sm font-bold text-sky-200 font-mono mt-0.5">
                {isFlying ? `${remainingSolidPercent}% Solid` : '100% Frozen'}
              </div>
            </div>

            {/* Metric 2: Ice Style */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-950/65 border border-sky-500/20 backdrop-blur-md shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                <span className="flex items-center gap-1">
                  <Palette className="w-3 h-3 text-cyan-400" />
                  EQUIPPED STYLE
                </span>
                <span className="text-[9px] text-cyan-400 font-bold">{activeIce.rarity}</span>
              </div>
              <div className="text-xs font-semibold text-white truncate mt-0.5" title={activeIce.name}>
                {activeIce.name}
              </div>
            </div>

            {/* Metric 3: Melt Status */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-950/65 border border-sky-500/20 backdrop-blur-md shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                <span className="flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-blue-400" />
                  CRYSTAL STATE
                </span>
                <span className={`text-[9px] font-bold ${isFlying ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`}>
                  {isFlying ? 'MELTING' : 'FROZEN'}
                </span>
              </div>
              <div className="text-xs font-mono text-cyan-300 truncate mt-0.5">
                {isFlying ? 'Condensing & Dripping' : 'Sub-Zero Equilibrium'}
              </div>
            </div>

            {/* Metric 4: Career Total */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-950/65 border border-sky-500/20 backdrop-blur-md shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-indigo-400" />
                  TOTAL STUDY
                </span>
                <span className="text-[9px] text-indigo-400 font-bold">CAREER</span>
              </div>
              <div className="text-xs font-mono text-indigo-200 truncate mt-0.5">
                {formatDuration(currentTotalSeconds)}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Metric 1: Wax Remaining */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-950/65 border border-orange-500/20 backdrop-blur-md shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-400" />
                  WAX REMAINING
                </span>
                <span className="text-[9px] font-bold text-orange-400">{remainingSolidPercent}%</span>
              </div>
              <div className="text-sm font-bold text-orange-200 font-mono mt-0.5">
                {isFlying ? `${remainingSolidPercent}% Pillar` : '100% Unburnt'}
              </div>
            </div>

            {/* Metric 2: Candle Style */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-950/65 border border-orange-500/20 backdrop-blur-md shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                <span className="flex items-center gap-1">
                  <Palette className="w-3 h-3 text-amber-400" />
                  EQUIPPED STYLE
                </span>
                <span className="text-[9px] text-amber-400 font-bold">{activeCandle.rarity}</span>
              </div>
              <div className="text-xs font-semibold text-white truncate mt-0.5" title={activeCandle.name}>
                {activeCandle.name}
              </div>
            </div>

            {/* Metric 3: Flame Radiance */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-950/65 border border-orange-500/20 backdrop-blur-md shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-rose-400" />
                  FLAME STATE
                </span>
                <span className={`text-[9px] font-bold ${isFlying ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`}>
                  {isFlying ? 'BURNING' : 'UNLIT'}
                </span>
              </div>
              <div className="text-xs font-mono text-amber-300 truncate mt-0.5">
                {isFlying ? 'Warm Flickering Glow' : 'Awaiting Match Strike'}
              </div>
            </div>

            {/* Metric 4: Career Total */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-950/65 border border-orange-500/20 backdrop-blur-md shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-rose-400" />
                  TOTAL STUDY
                </span>
                <span className="text-[9px] text-rose-400 font-bold">CAREER</span>
              </div>
              <div className="text-xs font-mono text-rose-200 truncate mt-0.5">
                {formatDuration(currentTotalSeconds)}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Visualizer Stage Clearance: This empty flexible spacer ensures the upper-middle canvas (Ice Cube / Candle) is 100% UNBLOCKED & VISIBLE */}
      <div className="flex-1 w-full min-h-[220px] pointer-events-none" />

      {/* Bottom Floating Sleek Glass Control Dock */}
      <div className="w-full max-w-2xl pointer-events-auto flex flex-col items-center mb-1">
        <div className={`w-full p-4 sm:p-5 rounded-3xl backdrop-blur-xl border flex flex-col items-center text-center shadow-2xl transition-all ${
          theme === 'space' 
            ? 'bg-slate-950/70 border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)]' 
            : theme === 'train'
            ? 'bg-slate-950/70 border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.15)]'
            : theme === 'ice'
            ? 'bg-slate-950/70 border-sky-400/30 shadow-[0_0_40px_rgba(56,189,248,0.15)]'
            : 'bg-slate-950/70 border-orange-500/30 shadow-[0_0_40px_rgba(249,115,22,0.15)]'
        }`}>
          
          {/* Top Row: Digital Clock & Active State Pill */}
          <div className="w-full flex items-center justify-between flex-wrap gap-2 mb-2">
            <div className="flex items-center gap-3">
              <div className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text font-mono ${
                theme === 'space'
                  ? 'bg-gradient-to-b from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                  : theme === 'train'
                  ? 'bg-gradient-to-b from-white via-amber-100 to-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                  : theme === 'ice'
                  ? 'bg-gradient-to-b from-white via-sky-100 to-sky-400 drop-shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                  : 'bg-gradient-to-b from-white via-orange-100 to-orange-400 drop-shadow-[0_0_20px_rgba(249,115,22,0.3)]'
              }`}>
                {displayTime}
              </div>

              <div className="text-left">
                <div className={`text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase ${
                  theme === 'space' ? 'text-cyan-300' : theme === 'train' ? 'text-amber-300' : theme === 'ice' ? 'text-sky-300' : 'text-orange-300'
                }`}>
                  {subTimerLabel}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {isFlying 
                    ? (isPaused ? 'Paused' : 'Study Timer Running') 
                    : 'Select Duration & Subject Below'}
                </div>
              </div>
            </div>

            {/* Quick Switch Style button */}
            {(theme === 'ice' || theme === 'candle') && !isFlying && (
              <button
                onClick={() => setShowStylePickerModal(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition flex items-center gap-1.5 shadow"
                title="Unlock & Equip Different Styles"
              >
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>Vault Styles</span>
              </button>
            )}
          </div>

          {/* Progress Bar (Melt / Burn or Waypoint) */}
          <div className="w-full mb-3">
            <div className="relative w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 shadow-md ${
                  theme === 'ice'
                    ? 'bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500'
                    : theme === 'candle'
                    ? 'bg-gradient-to-r from-orange-400 via-amber-400 to-rose-500'
                    : theme === 'space'
                    ? 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-amber-400'
                    : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-400'
                }`}
                style={{
                  width: (theme === 'ice' || theme === 'candle') 
                    ? `${Math.round(meltBurnRatio * 100)}%` 
                    : `${progressPercent}%`
                }}
              />
            </div>
          </div>

          {/* Subject Pills (compact) */}
          {!isFlying && (
            <div className="w-full flex items-center justify-center gap-1.5 mb-3 flex-wrap">
              <span className="text-[11px] text-slate-400 font-mono mr-1">SUBJECT:</span>
              {STUDY_SUBJECTS.map((sub) => {
                const isSelected = currentSubject === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setCurrentSubject(sub.id)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all ${
                      isSelected
                        ? (theme === 'space' 
                            ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                            : theme === 'train'
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                            : theme === 'ice'
                            ? 'bg-sky-400 text-slate-950 font-bold shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                            : 'bg-orange-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(249,115,22,0.4)]')
                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {sub.name.split('&')[0].trim()}
                  </button>
                );
              })}
            </div>
          )}

          {/* Duration Presets (compact row) */}
          {!isFlying && (
            <div className="w-full grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-3">
              {[
                { id: 'open', label: 'Open Focus' },
                { id: '25', label: '25m Pomodoro' },
                { id: '45', label: '45m Deep' },
                { id: '60', label: '60m Hour' },
                { id: '90', label: '90m Odyssey' },
                { id: 'break_5', label: '5m Rest' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedPreset(item.id)}
                  className={`py-1.5 px-2 rounded-xl text-center transition-all ${
                    selectedPreset === item.id
                      ? (theme === 'space'
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 border shadow'
                          : theme === 'train'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 border shadow'
                          : theme === 'ice'
                          ? 'bg-sky-500/20 border-sky-400 text-sky-300 border shadow'
                          : 'bg-orange-500/20 border-orange-400 text-orange-300 border shadow')
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 border'
                  }`}
                >
                  <span className="text-[11px] font-bold block">{item.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Start / Pause / Resume / Conclude Buttons */}
          <div className="w-full flex items-center justify-center gap-3">
            {!isFlying ? (
              <button
                onClick={() => startFlight(selectedPreset)}
                className={`w-full py-3.5 px-6 rounded-2xl text-slate-950 font-black text-sm sm:text-base tracking-wider font-syne flex items-center justify-center gap-2.5 shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] ${
                  theme === 'space'
                    ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                    : theme === 'train'
                    ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-rose-400 shadow-[0_0_25px_rgba(245,158,11,0.4)]'
                    : theme === 'ice'
                    ? 'bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 shadow-[0_0_25px_rgba(56,189,248,0.4)]'
                    : 'bg-gradient-to-r from-orange-400 via-amber-500 to-rose-500 hover:from-orange-300 hover:to-rose-400 shadow-[0_0_25px_rgba(249,115,22,0.4)]'
                }`}
              >
                <Play className="w-5 h-5 fill-current" />
                {theme === 'space' 
                  ? 'ENGAGE MAIN THRUSTERS (START STUDY)' 
                  : theme === 'train'
                  ? 'ALL ABOARD! DEPART STATION (START STUDY)'
                  : theme === 'ice'
                  ? 'BEGIN FOCUS • WATCH THE ICE MELT'
                  : 'LIGHT THE CANDLE • ENTER FOCUS'}
              </button>
            ) : (
              <div className="w-full flex items-center gap-3">
                {isPaused ? (
                  <button
                    onClick={resumeFlight}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    RESUME FOCUS
                  </button>
                ) : (
                  <button
                    onClick={pauseFlight}
                    className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition"
                  >
                    <Pause className="w-4 h-4 fill-current" />
                    PAUSE FOCUS
                  </button>
                )}

                <button
                  onClick={concludeFlight}
                  className="flex-1 py-3 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.2)] transition"
                >
                  <Square className="w-4 h-4 fill-current" />
                  CONCLUDE SESSION
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
