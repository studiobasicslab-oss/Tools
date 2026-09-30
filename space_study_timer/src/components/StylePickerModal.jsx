import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Award, 
  CheckCircle2, 
  Lock, 
  X, 
  Clock, 
  Layers, 
  Palette, 
  Droplet, 
  ShieldCheck 
} from 'lucide-react';
import { ICE_STYLES, CANDLE_STYLES } from '../data/iceCandleStyles';
import { formatDuration } from '../data/milestones';

export default function StylePickerModal({
  currentTheme, // 'ice' | 'candle' | 'space' | 'train'
  careerSeconds,
  selectedIceStyle,
  setSelectedIceStyle,
  selectedCandleStyle,
  setSelectedCandleStyle,
  onClose
}) {
  const initialTab = currentTheme === 'candle' ? 'candle' : 'ice';
  const [activeTab, setActiveTab] = useState(initialTab);

  const careerHours = (careerSeconds / 3600).toFixed(1);
  const activeStyles = activeTab === 'ice' ? ICE_STYLES : CANDLE_STYLES;
  const currentEquippedId = activeTab === 'ice' ? selectedIceStyle : selectedCandleStyle;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto p-6 md:p-8 rounded-3xl bg-slate-950 border border-slate-700 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${
              activeTab === 'ice'
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              {activeTab === 'ice' ? <Droplet className="w-6 h-6" /> : <Flame className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-2xl font-black text-white font-syne">
                SANCTUARY STYLE VAULT & UNLOCKS
              </h2>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                <span>CAREER STUDY TIME: <strong className="text-white">{formatDuration(careerSeconds)}</strong> ({careerHours} Hours)</span>
                <span>•</span>
                <span className="text-amber-400">Unlock rare styles through continuous study</span>
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

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 my-6">
          <button
            onClick={() => setActiveTab('ice')}
            className={`flex-1 py-3 px-5 rounded-2xl border font-bold text-xs sm:text-sm font-mono flex items-center justify-center gap-2.5 transition-all ${
              activeTab === 'ice'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplet className="w-4 h-4 text-cyan-400" />
            <span>ICE CUBE STYLES ({ICE_STYLES.filter(s => careerSeconds >= s.requiredSeconds).length}/{ICE_STYLES.length} UNLOCKED)</span>
          </button>

          <button
            onClick={() => setActiveTab('candle')}
            className={`flex-1 py-3 px-5 rounded-2xl border font-bold text-xs sm:text-sm font-mono flex items-center justify-center gap-2.5 transition-all ${
              activeTab === 'candle'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>CANDLE STYLES ({CANDLE_STYLES.filter(s => careerSeconds >= s.requiredSeconds).length}/{CANDLE_STYLES.length} UNLOCKED)</span>
          </button>
        </div>

        {/* Style Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {activeStyles.map((item) => {
            const isUnlocked = careerSeconds >= item.requiredSeconds;
            const isEquipped = currentEquippedId === item.id;
            const remainingHours = Math.max(0, (item.requiredSeconds - careerSeconds) / 3600).toFixed(1);
            const progressPercent = item.requiredSeconds === 0 
              ? 100 
              : Math.min(100, Math.round((careerSeconds / item.requiredSeconds) * 100));

            return (
              <div
                key={item.id}
                className={`relative p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                  isEquipped
                    ? activeTab === 'ice'
                      ? 'bg-cyan-950/30 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.2)]'
                      : 'bg-amber-950/30 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.2)]'
                    : isUnlocked
                    ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-900/80 opacity-55'
                }`}
              >
                <div>
                  {/* Top Bar: Rarity & Unlock Status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      item.rarity === 'Mythic' 
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : item.rarity === 'Legendary'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : item.rarity === 'Epic'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : item.rarity === 'Rare'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {item.rarity.toUpperCase()}
                    </span>

                    {isEquipped ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        ACTIVE
                      </span>
                    ) : isUnlocked ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        UNLOCKED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                        <Lock className="w-3 h-3" />
                        {remainingHours}h left
                      </span>
                    )}
                  </div>

                  {/* Visual Swatch & Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-md shrink-0 border border-white/20"
                      style={{
                        background: `linear-gradient(135deg, ${item.primaryColor || item.waxColor}, ${item.secondaryColor || item.secondaryWaxColor})`
                      }}
                    >
                      {activeTab === 'ice' ? (
                        <Droplet className="w-6 h-6 text-slate-950" />
                      ) : (
                        <Flame className="w-6 h-6 text-slate-950" />
                      )}
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                        {item.name}
                      </h3>
                      <p className="text-[10px] font-mono text-slate-400">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Tagline & Description */}
                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                    {item.tagline}
                  </p>

                  {/* Lore Fact */}
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-3">
                    <p className="text-[10px] text-slate-400 font-mono italic">
                      "{item.fact}"
                    </p>
                  </div>
                </div>

                {/* Bottom Action & Unlock Progress */}
                <div>
                  {!isUnlocked && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span>Unlock Progress ({item.requiredHours}h needed)</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-cyan-400 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        if (activeTab === 'ice') {
                          setSelectedIceStyle(item.id);
                        } else {
                          setSelectedCandleStyle(item.id);
                        }
                      }}
                      disabled={isEquipped}
                      className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 ${
                        isEquipped
                          ? 'bg-slate-800/60 text-slate-400 cursor-default border border-slate-700'
                          : activeTab === 'ice'
                          ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      }`}
                    >
                      {isEquipped ? 'EQUIPPED IN STUDY' : 'EQUIP THIS STYLE'}
                    </button>
                  ) : (
                    <div className="w-full py-2 text-center text-xs font-mono text-slate-500 bg-slate-950/60 rounded-xl border border-slate-900">
                      Reach {item.requiredHours} Hours to Unlock
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Equipped styles are automatically saved and rendered in 60FPS during your study sessions.</span>
          </span>
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
}
