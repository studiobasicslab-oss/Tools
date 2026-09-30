import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  TrainTrack, 
  BookOpen, 
  Award, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Map, 
  Eye, 
  Flame,
  Camera,
  Maximize2,
  Minimize2,
  Focus,
  Droplet,
  Palette,
  Sparkles
} from 'lucide-react';
import { formatDuration } from '../data/milestones';

export default function Navbar({
  theme,
  setTheme,
  currentTotalSeconds,
  streakDays,
  viewMode,
  setViewMode,
  isMuted,
  toggleMute,
  setShowLogbookModal,
  setShowMilestonesModal,
  setShowGalleryModal,
  setShowSettingsModal,
  setShowStylePickerModal,
  isFlying,
  isZenMode,
  setIsZenMode
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Error attempting to enable fullscreen:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const getThemeDetails = () => {
    switch (theme) {
      case 'space':
        return {
          title: 'COSMIC ODYSSEY',
          badge: 'DEEP SPACE',
          icon: Rocket,
          badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          logoClass: 'bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border-cyan-500/30 text-cyan-400',
          pingColor: 'bg-cyan-400'
        };
      case 'train':
        return {
          title: 'GLOBAL EXPRESS',
          badge: 'WORLD RAIL',
          icon: TrainTrack,
          badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          logoClass: 'bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-rose-500/20 border-amber-500/30 text-amber-400',
          pingColor: 'bg-amber-400'
        };
      case 'ice':
        return {
          title: 'GLACIAL FOCUS',
          badge: 'UNTIL ICE MELTS',
          icon: Droplet,
          badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
          logoClass: 'bg-gradient-to-br from-sky-400/20 via-cyan-500/20 to-blue-600/20 border-sky-400/30 text-sky-400',
          pingColor: 'bg-sky-400'
        };
      case 'candle':
        return {
          title: 'SANCTUARY GLOW',
          badge: 'UNTIL CANDLE BURNS',
          icon: Flame,
          badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
          logoClass: 'bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-rose-600/20 border-orange-400/30 text-orange-400',
          pingColor: 'bg-orange-400'
        };
      default:
        return {
          title: 'COSMIC ODYSSEY',
          badge: 'DEEP SPACE',
          icon: Rocket,
          badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          logoClass: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400',
          pingColor: 'bg-cyan-400'
        };
    }
  };

  const currentThemeInfo = getThemeDetails();
  const IconComponent = currentThemeInfo.icon;

  return (
    <header className="relative z-20 flex items-center justify-between px-3 sm:px-6 py-3 border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-md transition-all duration-300">
      {/* Brand & Theme Header */}
      <div className="flex items-center gap-3">
        <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl border shadow-lg shrink-0 ${currentThemeInfo.logoClass}`}>
          <IconComponent className={`w-5 h-5 ${isFlying ? 'animate-pulse' : ''}`} />
          {isFlying && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentThemeInfo.pingColor}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${currentThemeInfo.pingColor}`}></span>
            </span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-wider text-white font-syne truncate">
              {currentThemeInfo.title}
            </h1>
            <span className={`hidden sm:inline-block px-2 py-0.5 text-[9px] sm:text-[10px] uppercase font-mono tracking-widest font-semibold rounded border ${currentThemeInfo.badgeClass}`}>
              {currentThemeInfo.badge}
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 font-mono flex items-center gap-2">
            <span>STUDY TIME: <strong className="text-slate-200">{formatDuration(currentTotalSeconds)}</strong></span>
            <span>•</span>
            <span className="text-amber-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              {streakDays} DAY STREAK
            </span>
          </p>
        </div>
      </div>

      {/* Nav Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* 4-Theme Switcher Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800">
          <button
            onClick={() => setTheme('space')}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              theme === 'space'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Switch to Cosmic Space Rocket Journey"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Space</span>
          </button>

          <button
            onClick={() => setTheme('train')}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              theme === 'train'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Switch to World Train Voyage with Friends"
          >
            <TrainTrack className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Train</span>
          </button>

          <button
            onClick={() => setTheme('ice')}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              theme === 'ice'
                ? 'bg-sky-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Switch to 'Until Ice Melts' Glacial Focus Timer"
          >
            <Droplet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Ice Melt</span>
          </button>

          <button
            onClick={() => setTheme('candle')}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              theme === 'candle'
                ? 'bg-orange-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(249,115,22,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Switch to 'Until Candle Burns' Sanctuary Glow Timer"
          >
            <Flame className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Candle</span>
          </button>
        </div>

        {/* Viewport Toggle: Cockpit vs Map (For Space & Train) */}
        {(theme === 'space' || theme === 'train') && (
          <div className="hidden lg:flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800">
            <button
              onClick={() => setViewMode('cockpit')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'cockpit'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{theme === 'space' ? 'Cockpit' : 'Train View'}</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'map'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Route Map</span>
            </button>
          </div>
        )}

        {/* World Landmarks Photo Album Button (For Train) */}
        {theme === 'train' && (
          <button
            onClick={() => setShowGalleryModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition"
            title="View World Destination Photography"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">Photos</span>
          </button>
        )}

        {/* Style & Unlocks Vault Button (For Ice, Candle, and quick access) */}
        <button
          onClick={() => setShowStylePickerModal(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition ${
            theme === 'ice'
              ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
              : theme === 'candle'
              ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.15)]'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
          title="Unlock & Equip Unique Candle & Ice Styles"
        >
          <Palette className={`w-3.5 h-3.5 ${theme === 'ice' ? 'text-cyan-400' : theme === 'candle' ? 'text-orange-400' : 'text-amber-400'}`} />
          <span className="hidden xl:inline">Styles & Unlocks</span>
        </button>

        {/* Milestones */}
        <button
          onClick={() => setShowMilestonesModal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition"
          title="View Checkpoints & Badges"
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden xl:inline">Milestones</span>
        </button>

        {/* Logbook */}
        <button
          onClick={() => setShowLogbookModal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition"
          title="Study Logs & Debug"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden xl:inline">Logbook</span>
        </button>

        {/* Sound Controls */}
        <button
          onClick={toggleMute}
          className={`p-2 rounded-xl border text-xs transition ${
            isMuted
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-slate-900/80 border-slate-800 text-cyan-400 hover:border-cyan-500/30'
          }`}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Audio Presets & Settings */}
        <button
          onClick={() => setShowSettingsModal(true)}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition"
          title="Audio Soundscapes & Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Zen / Distraction-Free Focus Mode Toggle */}
        <button
          onClick={() => setIsZenMode(!isZenMode)}
          className={`p-2 rounded-xl border transition ${
            isZenMode
              ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
              : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
          }`}
          title="Distraction-Free Zen Focus Mode (Press Z)"
        >
          <Focus className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle Button */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
          title={isFullscreen ? 'Exit Fullscreen (Press F or Esc)' : 'Enter Fullscreen Mode (Press F)'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
