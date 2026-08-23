import { useState, useEffect, useCallback } from 'react';
import { MILESTONES, getProgressToNextMilestone, formatDistance } from '../data/milestones';
import { TRAIN_MILESTONES, getTrainProgressToNextMilestone, formatTrainDistance } from '../data/trainMilestones';
import { spaceAudio } from '../audio/spaceAudio';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'cosmic_odyssey_mission_state_v2';

const DEFAULT_STATE = {
  theme: 'space', // 'space' | 'train'
  careerSeconds: 0,
  sessions: [],
  unlockedMilestoneIds: ['launchpad', 'tokyo_departure'],
  streakDays: 0,
  lastStudyDate: null,
  soundMode: 'drone',
  soundVolume: 0.35,
  isMuted: false,
  pilotName: 'Explorer'
};

export function useMissionStore() {
  // Load persisted state
  const [persisted, setPersisted] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return { ...DEFAULT_STATE, ...JSON.parse(raw) };
      }
    } catch (e) {
      console.warn('Failed to load mission state:', e);
    }
    return DEFAULT_STATE;
  });

  // Active Session State
  const [isFlying, setIsFlying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [sessionMode, setSessionMode] = useState('open'); // 'open', '25', '45', '60', '90', 'break_5', 'break_15'
  const [targetDurationSeconds, setTargetDurationSeconds] = useState(0);
  const [currentSubject, setCurrentSubject] = useState('coding');
  const [sessionMilestonesGained, setSessionMilestonesGained] = useState([]);
  
  // Modals & View Modes
  const [viewMode, setViewMode] = useState('cockpit'); // 'cockpit' | 'map'
  const [showDebriefModal, setShowDebriefModal] = useState(false);
  const [showLogbookModal, setShowLogbookModal] = useState(false);
  const [showMilestonesModal, setShowMilestonesModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeDebriefData, setActiveDebriefData] = useState(null);

  const activeTheme = persisted.theme || 'space';

  // Audio state
  const [audioMode, setAudioMode] = useState(persisted.soundMode || (activeTheme === 'space' ? 'drone' : 'train_tracks'));
  const [audioVolume, setAudioVolume] = useState(persisted.soundVolume || 0.35);
  const [isMuted, setIsMuted] = useState(persisted.isMuted || false);

  // Sync back to local storage
  const savePersisted = useCallback((updater) => {
    setPersisted((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Save error', e);
      }
      return next;
    });
  }, []);

  const setTheme = (t) => {
    savePersisted((prev) => ({
      ...prev,
      theme: t,
      soundMode: t === 'space' ? 'drone' : 'train_tracks'
    }));
    setAudioMode(t === 'space' ? 'drone' : 'train_tracks');
  };

  // Update streak on date change
  const checkStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    savePersisted((prev) => {
      if (!prev.lastStudyDate) return prev;
      if (prev.lastStudyDate === today) return prev;

      const lastDate = new Date(prev.lastStudyDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 2) {
        return { ...prev, streakDays: 0 };
      }
      return prev;
    });
  }, [savePersisted]);

  useEffect(() => {
    checkStreak();
  }, [checkStreak]);

  // Total current seconds (career + active session)
  const currentTotalSeconds = persisted.careerSeconds + sessionSeconds;
  
  // Progress calculations according to active theme
  const progressInfo = activeTheme === 'space' 
    ? getProgressToNextMilestone(currentTotalSeconds)
    : getTrainProgressToNextMilestone(currentTotalSeconds);

  const activeMilestonesList = activeTheme === 'space' ? MILESTONES : TRAIN_MILESTONES;

  // Timer Tick Engine
  useEffect(() => {
    let interval = null;
    if (isFlying && !isPaused) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => {
          const nextSec = prev + 1;
          const totalNow = persisted.careerSeconds + nextSec;

          // Check if a new milestone is reached
          activeMilestonesList.forEach((m) => {
            if (totalNow >= m.requiredSeconds) {
              setPersisted((curr) => {
                if (!curr.unlockedMilestoneIds.includes(m.id)) {
                  spaceAudio.playMilestoneChime();
                  try {
                    confetti({
                      particleCount: 90,
                      spread: 80,
                      origin: { y: 0.6 }
                    });
                  } catch (e) {}

                  setSessionMilestonesGained((gained) => {
                    if (!gained.some((x) => x.id === m.id)) {
                      return [...gained, m];
                    }
                    return gained;
                  });

                  return {
                    ...curr,
                    unlockedMilestoneIds: [...curr.unlockedMilestoneIds, m.id]
                  };
                }
                return curr;
              });
            }
          });

          // If in countdown target mode and finished
          if (sessionMode !== 'open' && targetDurationSeconds > 0 && nextSec >= targetDurationSeconds) {
            spaceAudio.playTimerComplete();
            setIsFlying(false);
            setIsPaused(false);
            finishAndDebrief(nextSec);
            return 0;
          }

          return nextSec;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFlying, isPaused, persisted.careerSeconds, sessionMode, targetDurationSeconds, activeTheme, activeMilestonesList]);

  // Audio mode updates
  useEffect(() => {
    if (isFlying && !isPaused && !isMuted) {
      spaceAudio.setVolume(audioVolume);
      spaceAudio.setAmbientMode(audioMode);
    } else {
      spaceAudio.stopAmbient();
    }
  }, [isFlying, isPaused, audioMode, audioVolume, isMuted]);

  // Flight/Train Controls
  const startFlight = (mode = sessionMode, targetMins = 0) => {
    if (activeTheme === 'space') {
      spaceAudio.playLaunchIgnition();
    } else {
      spaceAudio.playTrainWhistle();
    }
    setSessionMode(mode);

    if (mode === 'open') {
      setTargetDurationSeconds(0);
    } else if (targetMins > 0) {
      setTargetDurationSeconds(targetMins * 60);
    } else if (mode === '25') {
      setTargetDurationSeconds(25 * 60);
    } else if (mode === '45') {
      setTargetDurationSeconds(45 * 60);
    } else if (mode === '60') {
      setTargetDurationSeconds(60 * 60);
    } else if (mode === '90') {
      setTargetDurationSeconds(90 * 60);
    } else if (mode === 'break_5') {
      setTargetDurationSeconds(5 * 60);
    } else if (mode === 'break_15') {
      setTargetDurationSeconds(15 * 60);
    }

    setIsFlying(true);
    setIsPaused(false);
  };

  const pauseFlight = () => {
    spaceAudio.playClick();
    setIsPaused(true);
  };

  const resumeFlight = () => {
    spaceAudio.playClick();
    setIsPaused(false);
  };

  // Conclude Session & Trigger Debriefing
  const finishAndDebrief = (finalSessionSeconds = sessionSeconds) => {
    spaceAudio.stopAmbient();
    spaceAudio.playMilestoneChime();

    const today = new Date().toISOString().split('T')[0];
    const newMilestones = [...sessionMilestonesGained];

    const report = {
      id: 'session_' + Date.now(),
      date: today,
      timestamp: Date.now(),
      theme: activeTheme,
      durationSeconds: finalSessionSeconds,
      subject: currentSubject,
      milestonesGained: newMilestones,
      careerSecondsBefore: persisted.careerSeconds,
      careerSecondsAfter: persisted.careerSeconds + finalSessionSeconds
    };

    savePersisted((prev) => {
      let streak = prev.streakDays;
      if (prev.lastStudyDate !== today) {
        streak += 1;
      }
      return {
        ...prev,
        careerSeconds: prev.careerSeconds + finalSessionSeconds,
        sessions: [report, ...prev.sessions],
        streakDays: streak,
        lastStudyDate: today
      };
    });

    setActiveDebriefData(report);
    setShowDebriefModal(true);

    setIsFlying(false);
    setIsPaused(false);
    setSessionSeconds(0);
    setSessionMilestonesGained([]);

    try {
      confetti({
        particleCount: 130,
        spread: 90,
        origin: { y: 0.5 }
      });
    } catch (e) {}
  };

  const concludeFlight = () => {
    if (sessionSeconds < 10) {
      setIsFlying(false);
      setIsPaused(false);
      setSessionSeconds(0);
      setSessionMilestonesGained([]);
      return;
    }
    finishAndDebrief(sessionSeconds);
  };

  const resetMissionProgress = () => {
    if (window.confirm('Are you sure you want to reset all journey progress back to the departure station / launchpad? This cannot be undone.')) {
      savePersisted(DEFAULT_STATE);
      setIsFlying(false);
      setIsPaused(false);
      setSessionSeconds(0);
      setSessionMilestonesGained([]);
    }
  };

  const exportDataJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(persisted, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `study_journey_backup_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchor.click();
  };

  const importDataJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed.careerSeconds === 'number') {
        savePersisted(parsed);
        alert('Journey data successfully imported!');
      } else {
        alert('Invalid data file structure.');
      }
    } catch (e) {
      alert('Failed to parse JSON file.');
    }
  };

  const addDebugSeconds = (secs) => {
    savePersisted((prev) => ({
      ...prev,
      careerSeconds: prev.careerSeconds + secs
    }));
  };

  return {
    theme: activeTheme,
    setTheme,
    careerSeconds: persisted.careerSeconds,
    currentTotalSeconds,
    sessions: persisted.sessions,
    unlockedMilestoneIds: persisted.unlockedMilestoneIds,
    streakDays: persisted.streakDays,
    lastStudyDate: persisted.lastStudyDate,
    pilotName: persisted.pilotName,

    isFlying,
    isPaused,
    sessionSeconds,
    sessionMode,
    targetDurationSeconds,
    currentSubject,
    setCurrentSubject,
    progressInfo,
    activeMilestonesList,
    formatCurrentDistance: (secs) => activeTheme === 'space' ? formatDistance(secs) : formatTrainDistance(secs),

    viewMode,
    setViewMode,
    showDebriefModal,
    setShowDebriefModal,
    showLogbookModal,
    setShowLogbookModal,
    showMilestonesModal,
    setShowMilestonesModal,
    showGalleryModal,
    setShowGalleryModal,
    showSettingsModal,
    setShowSettingsModal,
    activeDebriefData,

    audioMode,
    setAudioMode: (m) => {
      setAudioMode(m);
      savePersisted((prev) => ({ ...prev, soundMode: m }));
    },
    audioVolume,
    setAudioVolume: (v) => {
      setAudioVolume(v);
      spaceAudio.setVolume(v);
      savePersisted((prev) => ({ ...prev, soundVolume: v }));
    },
    isMuted,
    toggleMute: () => {
      const nextMuted = spaceAudio.toggleMute();
      setIsMuted(nextMuted);
      savePersisted((prev) => ({ ...prev, isMuted: nextMuted }));
    },

    startFlight,
    pauseFlight,
    resumeFlight,
    concludeFlight,
    resetMissionProgress,
    exportDataJSON,
    importDataJSON,
    addDebugSeconds
  };
}
