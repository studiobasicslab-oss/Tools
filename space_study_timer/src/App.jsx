import React, { useState, useEffect } from 'react';
import { useMissionStore } from './state/useMissionStore';
import Navbar from './components/Navbar';
import TelemetryHUD from './components/TelemetryHUD';
import SpaceCanvas from './canvas/SpaceCanvas';
import TrainCanvas from './canvas/TrainCanvas';
import SolarSystemMap from './components/SolarSystemMap';
import DebriefModal from './components/DebriefModal';
import LogbookModal from './components/LogbookModal';
import MilestonesModal from './components/MilestonesModal';
import DestinationGalleryModal from './components/DestinationGalleryModal';
import AudioSettingsModal from './components/AudioSettingsModal';
import { 
  Play, 
  Pause, 
  Square, 
  Maximize2, 
  Minimize2, 
  Focus, 
  X, 
  Sparkles 
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

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-x-hidden selection:bg-amber-500 selection:text-slate-950">
      
      {/* Dynamic 60FPS Canvas Visualizer */}
      {store.theme === 'space' ? (
        <SpaceCanvas
          isRunning={store.isFlying && !store.isPaused}
          totalSeconds={store.currentTotalSeconds}
          currentMilestone={store.progressInfo.currentMilestone}
          nextMilestone={store.progressInfo.nextMilestone}
          progressPercent={store.progressInfo.progressPercent}
        />
      ) : (
        <TrainCanvas
          isRunning={store.isFlying && !store.isPaused}
          totalSeconds={store.currentTotalSeconds}
          currentMilestone={store.progressInfo.currentMilestone}
          nextMilestone={store.progressInfo.nextMilestone}
          progressPercent={store.progressInfo.progressPercent}
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
              <span>ZEN FOCUS MODE • {store.progressInfo.currentMilestone.name}</span>
            </div>

            <button
              onClick={() => setIsZenMode(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition"
            >
              <X className="w-3.5 h-3.5" />
              Exit Zen (Press Z)
            </button>
          </div>

          {/* Center Minimalist Floating Clock */}
          <div className="pointer-events-auto flex flex-col items-center my-auto">
            <div className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-amber-300 font-mono drop-shadow-[0_0_40px_rgba(245,158,11,0.3)]">
              {zenDisplayTime}
            </div>

            <p className="text-xs font-mono text-amber-300/80 tracking-widest uppercase mt-2 mb-6">
              {store.isFlying 
                ? (store.isPaused ? 'PAUSED' : 'STUDYING IN PROGRESS') 
                : 'ENGINES IDLE'}
            </p>

            {/* Quick Minimal Controls */}
            <div className="flex items-center gap-3 bg-slate-950/60 p-2 rounded-2xl border border-slate-800/80 backdrop-blur-md">
              {!store.isFlying ? (
                <button
                  onClick={() => store.startFlight(store.sessionMode)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 transition shadow-lg"
                >
                  <Play className="w-4 h-4 fill-current" />
                  START FOCUS
                </button>
              ) : (
                <>
                  {store.isPaused ? (
                    <button
                      onClick={store.resumeFlight}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 transition"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      RESUME
                    </button>
                  ) : (
                    <button
                      onClick={store.pauseFlight}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 transition"
                    >
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      PAUSE
                    </button>
                  )}

                  <button
                    onClick={store.concludeFlight}
                    className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-mono flex items-center gap-1.5 transition"
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
