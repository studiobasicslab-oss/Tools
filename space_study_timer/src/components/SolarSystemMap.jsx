import React, { useState } from 'react';
import { 
  MILESTONES, 
  formatDistance, 
  formatDuration 
} from '../data/milestones';
import { 
  TRAIN_MILESTONES, 
  formatTrainDistance 
} from '../data/trainMilestones';
import { 
  Rocket, 
  TrainTrack, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Info, 
  Navigation, 
  Award, 
  ChevronRight, 
  X,
  Camera,
  MapPin
} from 'lucide-react';

export default function SolarSystemMap({
  theme,
  currentTotalSeconds,
  unlockedMilestoneIds,
  onClose
}) {
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const activeMilestones = theme === 'space' ? MILESTONES : TRAIN_MILESTONES;

  let activeIndex = 0;
  for (let i = 0; i < activeMilestones.length; i++) {
    if (currentTotalSeconds >= activeMilestones[i].requiredSeconds) {
      activeIndex = i;
    }
  }

  const distanceFormatted = theme === 'space'
    ? formatDistance(currentTotalSeconds)
    : formatTrainDistance(currentTotalSeconds);

  return (
    <div className="relative z-10 w-full max-w-6xl mx-auto p-4 md:p-8 flex flex-col items-center">
      {/* Header Banner */}
      <div className={`w-full flex items-center justify-between mb-8 p-6 rounded-3xl bg-slate-950/80 border backdrop-blur-xl ${
        theme === 'space' ? 'border-cyan-500/20' : 'border-amber-500/20'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl md:text-3xl font-black text-white font-syne">
              {theme === 'space' ? 'CELESTIAL TRAJECTORY MAP' : 'AROUND THE WORLD RAILWAY MAP'}
            </h2>
            <span className={`px-2.5 py-1 text-xs font-mono rounded-lg border ${
              theme === 'space'
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              {theme === 'space' ? 'DEEP SPACE RADAR' : 'TRANS-GLOBAL RAIL'}
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 font-mono mt-1">
            Current Location: <strong className={theme === 'space' ? 'text-cyan-300' : 'text-amber-300'}>
              {activeMilestones[activeIndex].name}
            </strong> ({distanceFormatted} traversed)
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Trajectory Route Map */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeMilestones.map((m, idx) => {
          const isReached = currentTotalSeconds >= m.requiredSeconds;
          const isCurrent = idx === activeIndex;
          const timeRem = Math.max(0, m.requiredSeconds - currentTotalSeconds);

          return (
            <div
              key={m.id}
              onClick={() => setSelectedMilestone(m)}
              className={`relative group p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                isCurrent
                  ? (theme === 'space'
                      ? 'bg-gradient-to-br from-cyan-950/70 via-slate-950/90 to-indigo-950/70 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)] scale-[1.02]'
                      : 'bg-gradient-to-br from-amber-950/70 via-slate-950/90 to-orange-950/70 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)] scale-[1.02]')
                  : isReached
                  ? 'bg-slate-950/75 border-slate-700/80 hover:border-amber-500/50'
                  : 'bg-slate-950/40 border-slate-800/40 opacity-70 hover:opacity-100 hover:border-slate-700'
              }`}
            >
              {/* Header with Stage Index and Status */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    STOP {idx + 1}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {m.region || m.stage?.toUpperCase()}
                  </span>
                </div>

                {isCurrent ? (
                  <span className={`flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded border animate-pulse ${
                    theme === 'space'
                      ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
                      : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                  }`}>
                    {theme === 'space' ? <Rocket className="w-3 h-3" /> : <TrainTrack className="w-3 h-3" />}
                    HERE NOW
                  </span>
                ) : isReached ? (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    REACHED
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                    <Lock className="w-3 h-3" />
                    IN {formatDuration(timeRem)}
                  </span>
                )}
              </div>

              {/* Title & Distance */}
              <div className="mb-4">
                <h3 className={`text-base font-bold transition ${
                  isCurrent ? (theme === 'space' ? 'text-cyan-200' : 'text-amber-200') : isReached ? 'text-white' : 'text-slate-300'
                }`}>
                  {m.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {m.subtitle}
                </p>
                <div className={`text-xs font-mono font-semibold mt-2 ${theme === 'space' ? 'text-cyan-400' : 'text-amber-400'}`}>
                  Distance: {m.displayDistance}
                </div>
              </div>

              {/* Photos indicator if present */}
              {m.photos && m.photos.length > 0 && (
                <div className="mb-3 flex items-center gap-1.5 text-[11px] text-amber-300 font-mono">
                  <Camera className="w-3.5 h-3.5" />
                  <span>{m.photos.length} Landmark Photos Available</span>
                </div>
              )}

              {/* Footer */}
              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">
                  Req: <strong className="text-slate-200">{formatDuration(m.requiredSeconds)}</strong>
                </span>
                <span className={`flex items-center gap-1 group-hover:translate-x-1 transition-transform ${
                  theme === 'space' ? 'text-cyan-400' : 'text-amber-400'
                }`}>
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkpoint Detail Modal */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 md:p-8 rounded-3xl bg-slate-950 border border-amber-500/40 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-mono uppercase text-amber-400 tracking-wider">
                  {theme === 'space' ? 'Deep Space Checkpoint' : 'World Station Stop'}
                </span>
                <h3 className="text-2xl font-bold text-white font-syne">
                  {selectedMilestone.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {selectedMilestone.subtitle}
                </p>
              </div>
              <button
                onClick={() => setSelectedMilestone(null)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo preview if train stop */}
            {selectedMilestone.photos && selectedMilestone.photos.length > 0 && (
              <div className="relative h-44 rounded-2xl overflow-hidden mb-4 border border-amber-500/20">
                <img
                  src={selectedMilestone.photos[0].url}
                  alt={selectedMilestone.photos[0].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 text-xs text-slate-200 font-mono">
                  📍 {selectedMilestone.photos[0].title}
                </div>
              </div>
            )}

            {/* Badge Info */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20 mb-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-bold shrink-0 shadow-lg">
                <Award className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-amber-300">
                    Badge: {selectedMilestone.badge.title}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {selectedMilestone.badge.rarity}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {selectedMilestone.badge.desc}
                </p>
              </div>
            </div>

            {/* Intel Fact */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 mb-6">
              <h5 className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                LANDMARK INTEL & HISTORY
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedMilestone.fact}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Required Focus: <strong className="text-white">{formatDuration(selectedMilestone.requiredSeconds)}</strong></span>
              <span>Distance: <strong className="text-amber-400">{selectedMilestone.displayDistance}</strong></span>
            </div>

            <button
              onClick={() => setSelectedMilestone(null)}
              className="w-full mt-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider transition"
            >
              ACKNOWLEDGE & RETURN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
