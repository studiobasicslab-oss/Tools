import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  X, 
  Compass, 
  Rocket, 
  ExternalLink 
} from 'lucide-react';
import { 
  MILESTONES, 
  formatDistance, 
  formatDuration 
} from '../data/milestones';

export default function MilestonesModal({
  currentTotalSeconds,
  unlockedMilestoneIds,
  onClose
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl bg-slate-950 border border-amber-500/40 shadow-[0_0_80px_rgba(245,158,11,0.15)]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white font-syne">
                HALL OF CELESTIAL MILESTONES
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Astronomical Checkpoints, Badges, and Lore from Earth to Deep Space
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

        {/* Milestone Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
          {MILESTONES.map((m, idx) => {
            const isUnlocked = currentTotalSeconds >= m.requiredSeconds;
            const timeRem = Math.max(0, m.requiredSeconds - currentTotalSeconds);

            return (
              <div
                key={m.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                  isUnlocked
                    ? 'bg-slate-950/80 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      MILESTONE {idx + 1}
                    </span>
                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        UNLOCKED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                        <Lock className="w-3 h-3" />
                        {formatDuration(timeRem)} left
                      </span>
                    )}
                  </div>

                  {/* Badge & Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      isUnlocked 
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-md' 
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                        {m.name}
                      </h3>
                      <span className="text-[10px] font-mono text-cyan-400">
                        {m.displayDistance}
                      </span>
                    </div>
                  </div>

                  {/* Badge Description */}
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-3">
                    <div className="text-[11px] font-bold text-amber-200">
                      🏆 {m.badge.title} ({m.badge.rarity})
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      {m.badge.desc}
                    </p>
                  </div>

                  {/* Science Fact */}
                  <p className="text-[10px] text-slate-400 font-mono italic leading-relaxed">
                    "{m.fact}"
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/60 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Required Study:</span>
                  <strong className={isUnlocked ? 'text-amber-300' : 'text-slate-400'}>
                    {formatDuration(m.requiredSeconds)}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
