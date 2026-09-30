import React from 'react';
import { 
  Sliders, 
  Volume2, 
  VolumeX, 
  Radio, 
  Flame, 
  Sparkles, 
  Wind, 
  TrainTrack, 
  CloudRain, 
  X 
} from 'lucide-react';

export default function AudioSettingsModal({
  audioMode,
  setAudioMode,
  audioVolume,
  setAudioVolume,
  isMuted,
  toggleMute,
  onClose
}) {
  const soundModes = [
    {
      id: 'candle_crackle',
      name: 'Cozy Crackling Wick',
      desc: 'Gentle wood wick crackle & warm soothing fireplace resonance.',
      icon: Flame,
      tag: 'Candle'
    },
    {
      id: 'campfire_night',
      name: 'Campfire & Crickets',
      desc: 'Roaring outdoor campfire with relaxing night crickets.',
      icon: Flame,
      tag: 'Nature'
    },
    {
      id: 'ice_drip',
      name: 'Melting Ice Droplets',
      desc: 'Sub-zero polar breeze and periodic crystal water drop resonance.',
      icon: CloudRain,
      tag: 'Ice'
    },
    {
      id: 'heavy_rain',
      name: 'Heavy Rainstorm',
      desc: 'Immersive and continuous heavy rainfall pouring down.',
      icon: CloudRain,
      tag: 'Nature'
    },
    {
      id: 'stream',
      name: 'Bubbling Stream',
      desc: 'Continuous bubbling forest stream over river rocks.',
      icon: CloudRain,
      tag: 'Nature'
    },
    {
      id: 'thunderstorm',
      name: 'Rolling Thunderstorm',
      desc: 'Distant thunder rumbling through a heavy downpour.',
      icon: CloudRain,
      tag: 'Nature'
    },
    {
      id: 'waves',
      name: 'Ocean Waves',
      desc: 'Calming waves crashing gently onto a sandy beach.',
      icon: Wind,
      tag: 'Nature'
    },
    {
      id: 'coffee_shop',
      name: 'Bustling Coffee Shop',
      desc: 'Warm ambiance of a lively cafe with faint chatter and cups clinking.',
      icon: Radio,
      tag: 'Ambience'
    },
    {
      id: 'train_tracks',
      name: 'Rhythmic Train Tracks',
      desc: 'Authentic rhythmic wheel click-clack and low cabin rail rumble.',
      icon: TrainTrack,
      tag: 'Train'
    },
    {
      id: 'train_rain',
      name: 'Rain on Train Glass',
      desc: 'Gentle raindrops tapping softly against the observation carriage window.',
      icon: CloudRain,
      tag: 'Train'
    },
    {
      id: 'drone',
      name: 'Deep Space Cosmic Drone',
      desc: '432Hz deep resonant frequency with 4Hz theta wave focus pulses.',
      icon: Radio,
      tag: 'Space'
    },
    {
      id: 'engine',
      name: 'Plasma Thruster Engine',
      desc: 'Sub-bass rumble and continuous ion exhaust stream.',
      icon: Flame,
      tag: 'Space'
    },
    {
      id: 'alpha',
      name: '10Hz Alpha Waves',
      desc: 'Binaural frequency tailored for prolonged analytical study.',
      icon: Sparkles,
      tag: 'Focus'
    },
    {
      id: 'solfeggio_528',
      name: '528Hz Solfeggio',
      desc: 'Miracle frequency known to repair DNA and bring deep peace.',
      icon: Sparkles,
      tag: 'Focus'
    },
    {
      id: 'whitenoise',
      name: 'Cosmic Pink Noise',
      desc: 'Balanced acoustic spectrum blocking room background distractions.',
      icon: Wind,
      tag: 'Noise'
    },
    {
      id: 'brownnoise',
      name: 'Deep Brown Noise',
      desc: 'Deep soothing rumble mimicking ocean roars or heavy winds.',
      icon: Wind,
      tag: 'Noise'
    },
    {
      id: 'off',
      name: 'Silence / Muted',
      desc: 'No ambient background noise.',
      icon: VolumeX,
      tag: 'Off'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 md:p-8 rounded-3xl bg-slate-950 border border-slate-700 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-syne">
                EXPEDITION AUDIO & SOUNDSCAPES
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Procedural Train & Space Sound Synthesizer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mute & Volume Control */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              MASTER VOLUME: {Math.round(audioVolume * 100)}%
            </span>
            <button
              onClick={toggleMute}
              className={`px-3 py-1 rounded-xl text-xs font-mono border transition ${
                isMuted
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
              }`}
            >
              {isMuted ? 'MUTED' : 'ACTIVE'}
            </button>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={audioVolume}
            onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Ambient Mode Presets */}
        <div className="space-y-2.5 mb-6 max-h-64 overflow-y-auto pr-1">
          <label className="block text-xs font-mono text-slate-400 mb-2">
            MIX FOCUS SOUNDSCAPES (Select multiple):
          </label>
          {soundModes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = Array.isArray(audioMode) 
              ? audioMode.includes(mode.id) 
              : audioMode === mode.id;

            return (
              <div
                key={mode.id}
                onClick={() => {
                  if (mode.id === 'off') {
                    setAudioMode(['off']);
                  } else {
                    const current = Array.isArray(audioMode) ? audioMode : [audioMode];
                    let nextModes;
                    if (current.includes(mode.id)) {
                      // Deselect
                      nextModes = current.filter(m => m !== mode.id && m !== 'off');
                      if (nextModes.length === 0) nextModes = ['off'];
                    } else {
                      // Select
                      nextModes = [...current.filter(m => m !== 'off'), mode.id];
                    }
                    setAudioMode(nextModes);
                  }
                }}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 ${isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isSelected ? 'text-cyan-200' : 'text-slate-200'}`}>
                      {mode.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {mode.desc}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {mode.tag}
                </span>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wider transition"
        >
          CONFIRM SOUNDSCAPE
        </button>
      </div>
    </div>
  );
}
