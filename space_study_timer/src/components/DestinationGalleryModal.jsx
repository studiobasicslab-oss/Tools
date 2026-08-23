import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Lock, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Compass, 
  Globe 
} from 'lucide-react';
import { TRAIN_MILESTONES, formatTrainDistance } from '../data/trainMilestones';
import { formatDuration } from '../data/milestones';

export default function DestinationGalleryModal({
  currentTotalSeconds,
  unlockedMilestoneIds,
  onClose
}) {
  const [selectedDestination, setSelectedDestination] = useState(TRAIN_MILESTONES[0]);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto p-6 md:p-8 rounded-3xl bg-slate-950 border border-amber-500/40 shadow-[0_0_80px_rgba(245,158,11,0.2)]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white font-syne flex items-center gap-2">
                WORLD TRAIN DESTINATIONS & LANDMARK ALBUM
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Iconic Sights, Photography & Passport Stamps Around The Earth
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
          {/* Left: Destination Selector List (4 cols) */}
          <div className="lg:col-span-4 space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {TRAIN_MILESTONES.map((dest, idx) => {
              const isUnlocked = currentTotalSeconds >= dest.requiredSeconds;
              const isSelected = selectedDestination.id === dest.id;

              return (
                <div
                  key={dest.id}
                  onClick={() => {
                    setSelectedDestination(dest);
                    setActivePhotoIdx(0);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : isUnlocked
                      ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/40 border-slate-900 opacity-50 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                      isUnlocked 
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950' 
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="truncate">
                      <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-amber-200' : 'text-slate-200'}`}>
                        {dest.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {dest.region} • {dest.displayDistance}
                      </p>
                    </div>
                  </div>

                  {isUnlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600 shrink-0 ml-2" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Selected Landmark Showcase & Photo Gallery (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            {selectedDestination && (
              <div className="space-y-4">
                {/* Main Photo Carousel */}
                <div className="relative w-full h-72 md:h-80 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl group">
                  {selectedDestination.photos && selectedDestination.photos.length > 0 ? (
                    <>
                      <img
                        src={selectedDestination.photos[activePhotoIdx]?.url}
                        alt={selectedDestination.photos[activePhotoIdx]?.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      
                      {/* Photo Title Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold mb-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {selectedDestination.region}
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-white font-syne">
                          {selectedDestination.photos[activePhotoIdx]?.title}
                        </h3>
                        <p className="text-xs text-slate-300 mt-1">
                          {selectedDestination.photos[activePhotoIdx]?.caption}
                        </p>
                      </div>

                      {/* Photo Navigation Buttons */}
                      {selectedDestination.photos.length > 1 && (
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : selectedDestination.photos.length - 1));
                            }}
                            className="p-1.5 rounded-lg hover:bg-white/20 text-white transition"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-mono px-2 text-white">
                            {activePhotoIdx + 1} / {selectedDestination.photos.length}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePhotoIdx((prev) => (prev < selectedDestination.photos.length - 1 ? prev + 1 : 0));
                            }}
                            className="p-1.5 rounded-lg hover:bg-white/20 text-white transition"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500 font-mono text-xs">
                      No photos available for this station
                    </div>
                  )}
                </div>

                {/* Cultural Landmark Details */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Station Intel & History
                    </h4>
                    <span className="text-xs font-mono text-amber-400">
                      Req: {formatDuration(selectedDestination.requiredSeconds)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {selectedDestination.fact}
                  </p>

                  {/* Passport Badge */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
                    <Award className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-amber-300">
                        Passport Stamp: {selectedDestination.badge.title} ({selectedDestination.badge.rarity})
                      </div>
                      <p className="text-[11px] text-amber-200/80">
                        {selectedDestination.badge.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider transition shadow-[0_0_20px_rgba(245,158,11,0.3)]"
        >
          CLOSE WORLD ALBUM
        </button>
      </div>
    </div>
  );
}
