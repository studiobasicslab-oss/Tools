import React, { useState, useEffect } from 'react';
import { useMissionStore } from './state/useMissionStore';
import Navbar from './components/Navbar';
import TelemetryHUD from './components/TelemetryHUD';
import SpaceCanvas from './canvas/SpaceCanvas';
import TrainCanvas from './canvas/TrainCanvas';
import IceCanvas from './canvas/IceCanvas';
import CandleCanvas from './canvas/CandleCanvas';
import SolarSystemMap from './components/SolarSystemMap';
import DebriefModal from './components/DebriefModal';
import LogbookModal from './components/LogbookModal';
import MilestonesModal from './components/MilestonesModal';
import DestinationGalleryModal from './components/DestinationGalleryModal';
import AudioSettingsModal from './components/AudioSettingsModal';
import StylePickerModal from './components/StylePickerModal';
import { 
  Play, 
  Pause, 
  Square, 
  Maximize2, 
  Minimize2, 
  Focus, 
  X, 
  Sparkles,
  Droplet,
  Flame,
  Rocket,
  TrainTrack
} from 'lucide-react';
import { formatTimeDigital, formatDuration } from './data/milestones';

export default function App() {
  const store = useMissionStore();
  const [isZenMode, setIsZenMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Global Keyboard Shortcuts (F: Fullscreen, Z: Zen Mode, Space: Start/Pause)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        return;
      }

      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen?.().catch(() => {});
        }
      } else if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        setIsZenMode((prev) => !prev);
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (!store.isFlying) {
          store.startFlight(store.sessionMode);
        } else {
          if (store.isPaused) {
            store.resumeFlight();
          } else {
            store.pauseFlight();
          }
        }
      } else if (e.key === 'Escape') {
        if (isZenMode) {
          setIsZenMode(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [store.isFlying, store.isPaused, store.sessionMode, isZenMode]);

  // Compute display time for Zen Mode
  let zenDisplayTime = '';
  if (store.sessionMode === 'open') {
    zenDisplayTime = formatTimeDigital(store.sessionSeconds);
  } else if (store.targetDurationSeconds > 0) {
    const rem = Math.max(0, store.targetDurationSeconds - store.sessionSeconds);
    zenDisplayTime = formatTimeDigital(rem);
  } else {
    zenDisplayTime = '00:00';
  }

  // Zen Mode Title
  const getZenSubtitle = () => {
    switch (store.theme) {
      case 'ice':
        return 'UNTIL ICE MELTS • GLACIAL FOCUS';
      case 'candle':
        return 'UNTIL CANDLE BURNS • SANCTUARY GLOW';
      case 'train':
        return `WORLD RAIL • ${store.progressInfo.currentMilestone.name}`;
      default:
        return `COSMIC ODYSSEY • ${store.progressInfo.currentMilestone.name}`;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-x-hidden selection:bg-amber-500 selection:text-slate-950">
      
      {/* Dynamic 60FPS Canvas Visualizer across 4 Themes */}
      {store.theme === 'space' && (
        <SpaceCanvas
          isRunning={store.isFlying && !store.isPaused}
          totalSeconds={store.currentTotalSeconds}
          currentMilestone={store.progressInfo.currentMilestone}
          nextMilestone={store.progressInfo.nextMilestone}
          progressPercent={store.progressInfo.progressPercent}
        />
      )}

      {store.theme === 'train' && (
        <TrainCanvas
          isRunning={store.isFlying && !store.isPaused}
          totalSeconds={store.currentTotalSeconds}
          currentMilestone={store.progressInfo.currentMilestone}
          nextMilestone={store.progressInfo.nextMilestone}
          progressPercent={store.progressInfo.progressPercent}
        />
      )}

      {store.theme === 'ice' && (
        <IceCanvas
          isRunning={store.isFlying && !store.isPaused}
          sessionSeconds={store.sessionSeconds}
          targetDurationSeconds={store.targetDurationSeconds}
          currentTotalSeconds={store.currentTotalSeconds}
          activeStyleId={store.selectedIceStyle}
        />
      )}

      {store.theme === 'candle' && (
        <CandleCanvas
          isRunning={store.isFlying && !store.isPaused}
          sessionSeconds={store.sessionSeconds}
          targetDurationSeconds={store.targetDurationSeconds}
          currentTotalSeconds={store.currentTotalSeconds}
          activeStyleId={store.selectedCandleStyle}
        />
      )}

      {/* Main UI Container */}
      {!isZenMode ? (
        <div className="relative z-10 flex flex-col min-h-screen animate-fadeIn">
          <Navbar
            theme={store.theme}
            setTheme={store.setTheme}
            currentTotalSeconds={store.currentTotalSeconds}
            careerSeconds={store.careerSeconds}
            streakDays={store.streakDays}
            viewMode={store.viewMode}
            setViewMode={store.setViewMode}
            isMuted={store.isMuted}
            toggleMute={store.toggleMute}
            setShowLogbookModal={store.setShowLogbookModal}
            setShowMilestonesModal={store.setShowMilestonesModal}
            setShowGalleryModal={store.setShowGalleryModal}
            setShowSettingsModal={store.setShowSettingsModal}
            setShowStylePickerModal={store.setShowStylePickerModal}
            isFlying={store.isFlying && !store.isPaused}
            isZenMode={isZenMode}
            setIsZenMode={setIsZenMode}
          />

          <main className="flex-1 flex flex-col justify-center">
            {store.viewMode === 'cockpit' ? (
              <TelemetryHUD
                theme={store.theme}
                isFlying={store.isFlying}
                isPaused={store.isPaused}
                sessionSeconds={store.sessionSeconds}
                sessionMode={store.sessionMode}
                targetDurationSeconds={store.targetDurationSeconds}
                currentTotalSeconds={store.currentTotalSeconds}
                progressInfo={store.progressInfo}
                currentSubject={store.currentSubject}
                setCurrentSubject={store.setCurrentSubject}
                selectedIceStyle={store.selectedIceStyle}
                selectedCandleStyle={store.selectedCandleStyle}
                setShowStylePickerModal={store.setShowStylePickerModal}
                startFlight={store.startFlight}
                pauseFlight={store.pauseFlight}
                resumeFlight={store.resumeFlight}
                concludeFlight={store.concludeFlight}
              />
            ) : (
              <SolarSystemMap
                theme={store.theme}
                currentTotalSeconds={store.currentTotalSeconds}
                unlockedMilestoneIds={store.unlockedMilestoneIds}
                onClose={() => store.setViewMode('cockpit')}
              />
            )}
          </main>
        </div>
      ) : (
        /* ZEN / DISTRACTION-FREE FOCUS MODE (Minimalist Clean Floating HUD) */
        <div className="relative z-20 flex flex-col items-center justify-between min-h-screen p-8 pointer-events-none animate-fadeIn">
          {/* Top Bar with Minimal Indicator */}
          <div className="w-full flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/60 border border-slate-800 backdrop-blur-md text-xs font-mono text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ZEN FOCUS MODE • {getZenSubtitle()}</span>
            </div>

            <button
              onClick={() => setIsZenMode(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition"
            >
              <X className="w-3.5 h-3.5" />
              Exit Zen (Press Z)
            </button>
          </div>

          {/* Visualizer Stage Spacer for Zen Mode */}
          <div className="flex-1 w-full pointer-events-none" />

          {/* Bottom Floating Minimalist Dock for Zen Mode */}
          <div className="pointer-events-auto flex flex-col items-center mb-4 p-4 rounded-3xl bg-slate-950/50 backdrop-blur-md border border-slate-800/80 shadow-2xl">
            <div className={`text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text font-mono ${
              store.theme === 'ice'
                ? 'bg-gradient-to-b from-white via-sky-100 to-sky-400 drop-shadow-[0_0_30px_rgba(56,189,248,0.3)]'
                : store.theme === 'candle'
                ? 'bg-gradient-to-b from-white via-amber-100 to-orange-400 drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]'
                : 'bg-gradient-to-b from-white via-slate-100 to-amber-300 drop-shadow-[0_0_30px_rgba(245,158,11,0.3)]'
            }`}>
              {zenDisplayTime}
            </div>

            <p className="text-[11px] font-mono text-amber-300/80 tracking-widest uppercase mt-1 mb-3">
              {store.isFlying 
                ? (store.isPaused 
                    ? 'FOCUS PAUSED' 
                    : store.theme === 'ice' 
                    ? 'ICE MELTING • STUDY IN PROGRESS' 
                    : store.theme === 'candle'
                    ? 'CANDLE BURNING • SANCTUARY ACTIVE'
                    : 'STUDYING IN PROGRESS') 
                : 'READY TO BEGIN'}
            </p>

            {/* Quick Minimal Controls */}
            <div className="flex items-center gap-3">
              {!store.isFlying ? (
                <button
                  onClick={() => store.startFlight(store.sessionMode)}
                  className={`px-6 py-2 rounded-xl font-bold text-xs font-mono flex items-center gap-2 transition shadow-lg ${
                    store.theme === 'ice'
                      ? 'bg-sky-400 hover:bg-sky-300 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                      : store.theme === 'candle'
                      ? 'bg-orange-500 hover:bg-orange-400 text-slate-950 shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  START FOCUS
                </button>
              ) : (
                <>
                  {store.isPaused ? (
                    <button
                      onClick={store.resumeFlight}
                      className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 transition"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      RESUME
                    </button>
                  ) : (
                    <button
                      onClick={store.pauseFlight}
                      className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 transition"
                    >
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      PAUSE
                    </button>
                  )}

                  <button
                    onClick={store.concludeFlight}
                    className="px-4 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-mono flex items-center gap-1.5 transition"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    CONCLUDE
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bottom Hint */}
          <div className="text-[11px] font-mono text-slate-500 pointer-events-auto">
            Shortcuts: <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">Space</kbd> Play/Pause • <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">F</kbd> Fullscreen • <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">Z</kbd> Zen Mode
          </div>
        </div>
      )}

      {/* Modals */}
      {store.showStylePickerModal && (
        <StylePickerModal
          currentTheme={store.theme}
          careerSeconds={store.careerSeconds}
          selectedIceStyle={store.selectedIceStyle}
          setSelectedIceStyle={store.setSelectedIceStyle}
          selectedCandleStyle={store.selectedCandleStyle}
          setSelectedCandleStyle={store.setSelectedCandleStyle}
          onClose={() => store.setShowStylePickerModal(false)}
        />
      )}

      {store.showDebriefModal && (
        <DebriefModal
          theme={store.theme}
          debriefData={store.activeDebriefData}
          onClose={() => store.setShowDebriefModal(false)}
          streakDays={store.streakDays}
          onOpenGallery={() => {
            store.setShowDebriefModal(false);
            store.setShowGalleryModal(true);
          }}
        />
      )}

      {store.showLogbookModal && (
        <LogbookModal
          careerSeconds={store.careerSeconds}
          sessions={store.sessions}
          streakDays={store.streakDays}
          exportDataJSON={store.exportDataJSON}
          importDataJSON={store.importDataJSON}
          resetMissionProgress={store.resetMissionProgress}
          addDebugSeconds={store.addDebugSeconds}
          onClose={() => store.setShowLogbookModal(false)}
        />
      )}

      {store.showMilestonesModal && (
        <MilestonesModal
          currentTotalSeconds={store.currentTotalSeconds}
          unlockedMilestoneIds={store.unlockedMilestoneIds}
          onClose={() => store.setShowMilestonesModal(false)}
        />
      )}

      {store.showGalleryModal && (
        <DestinationGalleryModal
          currentTotalSeconds={store.currentTotalSeconds}
          unlockedMilestoneIds={store.unlockedMilestoneIds}
          onClose={() => store.setShowGalleryModal(false)}
        />
      )}

      {store.showSettingsModal && (
        <AudioSettingsModal
          audioMode={store.audioMode}
          setAudioMode={store.setAudioMode}
          audioVolume={store.audioVolume}
          setAudioVolume={store.setAudioVolume}
          isMuted={store.isMuted}
          toggleMute={store.toggleMute}
          onClose={() => store.setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}
