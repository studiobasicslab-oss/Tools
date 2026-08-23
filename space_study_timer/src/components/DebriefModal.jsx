import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  Rocket, 
  TrainTrack, 
  CheckCircle2, 
  Navigation, 
  Clock, 
  Flame, 
  Share2, 
  X,
  FileText,
  Camera,
  MapPin
} from 'lucide-react';
import { formatDistance, formatDuration, getProgressToNextMilestone } from '../data/milestones';
import { formatTrainDistance, getTrainProgressToNextMilestone } from '../data/trainMilestones';

export default function DebriefModal({
  theme,
  debriefData,
  onClose,
  streakDays,
  onOpenGallery
}) {
  const [copied, setCopied] = useState(false);
  const [pilotNotes, setPilotNotes] = useState('');

  if (!debriefData) return null;

  const { durationSeconds, careerSecondsBefore, careerSecondsAfter, milestonesGained } = debriefData;
  const isTrainTheme = (debriefData.theme || theme) === 'train';

  const progressAfter = isTrainTheme 
    ? getTrainProgressToNextMilestone(careerSecondsAfter) 
    : getProgressToNextMilestone(careerSecondsAfter);

  const formattedDistance = isTrainTheme 
    ? formatTrainDistance(careerSecondsAfter) 
    : formatDistance(careerSecondsAfter);

  const handleCopySummary = () => {
    const summaryText = `${isTrainTheme ? '🚂 Global Express' : '🚀 Cosmic Study Odyssey'} - Trip Log\n` +
      `⏱️ Travel Focus Duration: ${formatDuration(durationSeconds)}\n` +
      `🗺️ Total Distance: ${formattedDistance}\n` +
      `📍 Current Station/Sector: ${progressAfter.currentMilestone.name}\n` +
      (milestonesGained.length > 0 
        ? `🏆 Landmarks Reached: ${milestonesGained.map(m => m.name).join(', ')}\n` 
        : `🎯 Next Stop: ${progressAfter.nextMilestone?.name || 'World Explorer'} (${Math.round(progressAfter.progressPercent)}%)\n`) +
      `🔥 Focus Streak: ${streakDays} Days\n` +
      (pilotNotes ? `📝 Travel Journal: ${pilotNotes}\n` : '') +
      `#StudyTimer #WorldJourney`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl bg-slate-950 border border-amber-500/50 shadow-[0_0_80px_rgba(245,158,11,0.25)]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            {isTrainTheme ? <TrainTrack className="w-3.5 h-3.5" /> : <Rocket className="w-3.5 h-3.5" />}
            {isTrainTheme ? 'WORLD RAILWAY EXPEDITION REPORT' : 'MISSION FLIGHT DEBRIEF'}
          </span>
          <span className="text-xs font-mono text-slate-400">
            {debriefData.date}
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white font-syne mb-1">
          {isTrainTheme ? 'STATION ARRIVAL & REST' : 'FLIGHT LEG CONCLUDED'}
        </h2>
        <p className="text-xs md:text-sm text-slate-400 font-mono mb-6">
          {isTrainTheme 
            ? <>Train pulled into station at <strong className="text-amber-300">{progressAfter.currentMilestone.name}</strong>. Enjoying the local sights with friends.</>
            : <>Engines cut safely. Spacecraft holding steady in orbit at <strong className="text-cyan-300">{progressAfter.currentMilestone.name}</strong>.</>}
        </p>

        {/* Milestone Celebration Box */}
        {milestonesGained.length > 0 ? (
          <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-950/40 to-slate-950/40 border border-amber-400/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold mb-3">
              <Sparkles className="w-4 h-4 animate-spin" />
              {isTrainTheme ? 'NEW WORLD DESTINATION REACHED!' : 'NEW CELESTIAL MILESTONE UNLOCKED!'}
            </div>

            {milestonesGained.map((m) => (
              <div key={m.id} className="space-y-3 mb-4 last:mb-0">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center text-slate-950 font-bold shrink-0 shadow-lg shadow-amber-500/20">
                    <Award className="w-7 h-7 text-slate-950" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-amber-200">
                        {m.name}
                      </h3>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        {m.badge.rarity}
                      </span>
                    </div>
                    <p className="text-xs text-amber-100/90 mt-1">
                      {m.badge.desc}
                    </p>
                  </div>
                </div>

                {/* Display Destination Photo if available */}
                {m.photos && m.photos.length > 0 && (
                  <div className="relative h-48 rounded-xl overflow-hidden border border-amber-500/30 mt-3 group">
                    <img
                      src={m.photos[0].url}
                      alt={m.photos[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[10px] font-mono text-amber-400 font-bold flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        LANDMARK SPOTLIGHT: {m.photos[0].title}
                      </span>
                      <p className="text-xs text-slate-200 mt-0.5">
                        {m.photos[0].caption}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          progressAfter.nextMilestone && (
            <div className="mb-6 p-4 rounded-2xl bg-slate-900/70 border border-amber-500/20">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-slate-300">
                  En Route to <strong className="text-amber-300">{progressAfter.nextMilestone.name}</strong>
                </span>
                <span className="text-amber-400 font-bold">
                  {Math.round(progressAfter.progressPercent)}% Traversed
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                  style={{ width: `${progressAfter.progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Study for another <strong className="text-slate-200">{formatDuration(progressAfter.remainingSeconds)}</strong> to pull into this destination.
              </p>
            </div>
          )
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              FOCUS TIME
            </div>
            <div className="text-sm sm:text-base font-bold text-white font-mono">
              {formatDuration(durationSeconds)}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center gap-1">
              <Navigation className="w-3 h-3 text-indigo-400" />
              TOTAL DISTANCE
            </div>
            <div className="text-xs sm:text-sm font-bold text-white font-mono truncate">
              {formattedDistance}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" />
              TRAVEL STREAK
            </div>
            <div className="text-sm sm:text-base font-bold text-amber-300 font-mono">
              {streakDays} Days
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              STATUS
            </div>
            <div className="text-xs sm:text-sm font-bold text-emerald-300 font-mono">
              Saved in Journal
            </div>
          </div>
        </div>

        {/* Pilot / Traveler Journal */}
        <div className="mb-6">
          <label className="block text-xs font-mono text-slate-300 mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            STUDY JOURNAL NOTES (OPTIONAL):
          </label>
          <textarea
            value={pilotNotes}
            onChange={(e) => setPilotNotes(e.target.value)}
            placeholder="Record what topics, problems, or chapters you solved during this study leg..."
            className="w-full h-20 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopySummary}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-mono text-xs font-medium flex items-center justify-center gap-2 transition"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            {copied ? 'LOG COPIED!' : 'SHARE TRIP REPORT'}
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider transition shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            REST & RECHARGE
          </button>
        </div>
      </div>
    </div>
  );
}
