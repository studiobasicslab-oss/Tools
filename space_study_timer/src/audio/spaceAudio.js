// Procedural Web Audio Synthesizer for Space & Train Expeditions
class SpaceAudioEngine {
  constructor() {
    this.ctx = null;
    this.ambientNode = null;
    this.ambientGain = null;
    this.isMuted = false;
    this.currentMode = 'drone'; // 'drone', 'engine', 'alpha', 'whitenoise', 'train_tracks', 'train_rain', 'off'
    this.volume = 0.35;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.25, this.ctx.currentTime);
    }
    if (this.ambientNode && this.ambientNode.audio) {
      this.ambientNode.audio.volume = this.isMuted ? 0 : this.volume * 0.5;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.setVolume(this.volume);
    return this.isMuted;
  }

  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.1 * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playLaunchIgnition() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, t);
    filter.frequency.exponentialRampToValueAtTime(800, t + 0.8);
    filter.frequency.exponentialRampToValueAtTime(200, t + 1.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.3 * this.volume, t + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  }

  playTrainWhistle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // Classic train station whistle chord (D5 + F#5 + A5)
    const t = this.ctx.currentTime;
    const notes = [587.33, 739.99, 880.00];

    notes.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.02, t + 0.4);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, t + 1.2);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15 * this.volume, t + 0.2);
      gain.gain.setValueAtTime(0.12 * this.volume, t + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 1.6);
    });
  }

  playCandleLight() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Match strike swoosh
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.4);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.frequency.exponentialRampToValueAtTime(600, t + 0.3);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  }

  playIceChime() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // Glassy crystalline shimmer notes
    const t = this.ctx.currentTime;
    [1046.50, 1318.51, 1567.98, 2093.00].forEach((freq, idx) => {
      const startTime = t + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.12 * this.volume, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 1.2);
    });
  }

  playMilestoneChime() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // Celestial pentatonic fanfare: C5, E5, G5, B5, D6, G6
    const freqs = [523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98];
    const t = this.ctx.currentTime;

    freqs.forEach((f, idx) => {
      const startTime = t + idx * 0.12;
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, startTime);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(f * 2.002, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.2 * this.volume, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.8);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc2.start(startTime);
      osc.stop(startTime + 2.0);
      osc2.stop(startTime + 2.0);
    });
  }

  playTimerComplete() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [440, 554.37, 659.25, 880].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.15);
      gain.gain.setValueAtTime(0.2 * this.volume, t + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.15 + 1.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + i * 0.15);
      osc.stop(t + i * 0.15 + 1.5);
    });
  }

  setAmbientMode(mode) {
    this.currentMode = mode;
    this.stopAmbient();

    if (mode === 'off' || this.isMuted) return;

    this.init();
    if (!this.ctx) return;

    try {
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.25, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);

      if (mode === 'drone') {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const osc3 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(108, this.ctx.currentTime);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(112, this.ctx.currentTime);
        osc3.type = 'triangle';
        osc3.frequency.setValueAtTime(54, this.ctx.currentTime);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(250, this.ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        osc3.connect(filter);
        filter.connect(this.ambientGain);

        osc1.start();
        osc2.start();
        osc3.start();
        this.ambientNode = { stop: () => { osc1.stop(); osc2.stop(); osc3.stop(); } };

      } else if (mode === 'train_tracks') {
        // Rhythmic Train Tracks Click-Clack & Low Carriage Rumble
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.3;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const subOsc = this.ctx.createOscillator();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(48, this.ctx.currentTime);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(180, this.ctx.currentTime);

        // LFO for rhythmic track click-clack pulses
        const lfo = this.ctx.createOscillator();
        lfo.type = 'triangle';
        lfo.frequency.setValueAtTime(2.2, this.ctx.currentTime); // 2.2 beats per second

        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        lfo.connect(lfoGain.gain);

        noise.connect(filter);
        subOsc.connect(filter);
        filter.connect(lfoGain);
        lfoGain.connect(this.ambientGain);

        noise.start();
        subOsc.start();
        lfo.start();
        this.ambientNode = { stop: () => { noise.stop(); subOsc.stop(); lfo.stop(); } };

      } else if (mode === 'train_rain') {
        // Rain on Train Window Glass
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.25;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(900, this.ctx.currentTime);

        noise.connect(filter);
        filter.connect(this.ambientGain);

        noise.start();
        this.ambientNode = { stop: () => { noise.stop(); } };

      } else if (mode === 'engine') {
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.4;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const subOsc = this.ctx.createOscillator();
        subOsc.type = 'sawtooth';
        subOsc.frequency.setValueAtTime(65, this.ctx.currentTime);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(140, this.ctx.currentTime);
        filter.Q.setValueAtTime(2, this.ctx.currentTime);

        noise.connect(filter);
        subOsc.connect(filter);
        filter.connect(this.ambientGain);

        noise.start();
        subOsc.start();
        this.ambientNode = { stop: () => { noise.stop(); subOsc.stop(); } };

      } else if (mode === 'alpha') {
        const oscLeft = this.ctx.createOscillator();
        const oscRight = this.ctx.createOscillator();
        oscLeft.type = 'sine';
        oscLeft.frequency.setValueAtTime(200, this.ctx.currentTime);
        oscRight.type = 'sine';
        oscRight.frequency.setValueAtTime(210, this.ctx.currentTime);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, this.ctx.currentTime);

        oscLeft.connect(filter);
        oscRight.connect(filter);
        filter.connect(this.ambientGain);

        oscLeft.start();
        oscRight.start();
        this.ambientNode = { stop: () => { oscLeft.stop(); oscRight.stop(); } };

      } else if (mode === 'whitenoise') {
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.15;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, this.ctx.currentTime);

        noise.connect(filter);
        filter.connect(this.ambientGain);

        noise.start();
        this.ambientNode = { stop: () => { noise.stop(); } };

      } else if (mode === 'brownnoise') {
        const audio = new Audio('/audio/brown_noise.mp3');
        audio.loop = true;
        audio.volume = this.isMuted ? 0 : this.volume * 0.5;
        audio.play().catch(e => console.warn(e));
        this.ambientNode = { stop: () => { audio.pause(); audio.src = ''; }, audio };

      } else if (mode === 'heavy_rain') {
        const audio = new Audio('/audio/heavy_rain.mp3');
        audio.loop = true;
        audio.volume = this.isMuted ? 0 : this.volume * 0.5;
        audio.play().catch(e => console.warn(e));
        this.ambientNode = { stop: () => { audio.pause(); audio.src = ''; }, audio };

      } else if (mode === 'stream') {
        const audio = new Audio('/audio/stream.mp3');
        audio.loop = true;
        audio.volume = this.isMuted ? 0 : this.volume * 0.5;
        audio.play().catch(e => console.warn(e));
        this.ambientNode = { stop: () => { audio.pause(); audio.src = ''; }, audio };

      } else if (mode === 'campfire_night') {
        const audio = new Audio('/audio/campfire_night.mp3');
        audio.loop = true;
        audio.volume = this.isMuted ? 0 : this.volume * 0.5;
        audio.play().catch(e => console.warn(e));
        this.ambientNode = { stop: () => { audio.pause(); audio.src = ''; }, audio };

      } else if (mode === 'coffee_shop') {
        const audio = new Audio('/audio/coffee_shop.mp3');
        audio.loop = true;
        audio.volume = this.isMuted ? 0 : this.volume * 0.5;
        audio.play().catch(e => console.warn(e));
        this.ambientNode = { stop: () => { audio.pause(); audio.src = ''; }, audio };

      } else if (mode === 'thunderstorm') {
        const audio = new Audio('/audio/thunderstorm.mp3');
        audio.loop = true;
        audio.volume = this.isMuted ? 0 : this.volume * 0.5;
        audio.play().catch(e => console.warn(e));
        this.ambientNode = { stop: () => { audio.pause(); audio.src = ''; }, audio };

      } else if (mode === 'waves') {
        const audio = new Audio('/audio/waves.mp3');
        audio.loop = true;
        audio.volume = this.isMuted ? 0 : this.volume * 0.5;
        audio.play().catch(e => console.warn(e));
        this.ambientNode = { stop: () => { audio.pause(); audio.src = ''; }, audio };

      } else if (mode === 'solfeggio_528') {
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(528, this.ctx.currentTime);
        const subOsc = this.ctx.createOscillator();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(264, this.ctx.currentTime);
        osc.connect(this.ambientGain);
        subOsc.connect(this.ambientGain);
        osc.start();
        subOsc.start();
        this.ambientNode = { stop: () => { osc.stop(); subOsc.stop(); } };

      } else if (mode === 'candle_crackle') {
        // Cozy crackling wood wick & warm fireplace hum
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          // Sparse micro-sparks and low rumble
          const isCrack = Math.random() < 0.003;
          data[i] = isCrack 
            ? (Math.random() * 2 - 1) * 0.85 
            : (Math.random() * 2 - 1) * 0.08;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const lowOsc = this.ctx.createOscillator();
        lowOsc.type = 'sine';
        lowOsc.frequency.setValueAtTime(62, this.ctx.currentTime);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1100, this.ctx.currentTime);
        filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

        const lowFilter = this.ctx.createBiquadFilter();
        lowFilter.type = 'lowpass';
        lowFilter.frequency.setValueAtTime(120, this.ctx.currentTime);

        noise.connect(filter);
        filter.connect(this.ambientGain);

        lowOsc.connect(lowFilter);
        lowFilter.connect(this.ambientGain);

        noise.start();
        lowOsc.start();
        this.ambientNode = { stop: () => { noise.stop(); lowOsc.stop(); } };

      } else if (mode === 'ice_drip') {
        // Sub-zero polar wind & gentle crystal melt water drops
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.12;
        }

        const windSource = this.ctx.createBufferSource();
        windSource.buffer = buffer;
        windSource.loop = true;

        const windFilter = this.ctx.createBiquadFilter();
        windFilter.type = 'bandpass';
        windFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
        windFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);

        // Wind LFO
        const windLfo = this.ctx.createOscillator();
        windLfo.type = 'sine';
        windLfo.frequency.setValueAtTime(0.2, this.ctx.currentTime);
        windLfo.connect(windFilter.frequency);

        windSource.connect(windFilter);
        windFilter.connect(this.ambientGain);

        windSource.start();
        windLfo.start();

        // Rhythmic gentle water drop oscillator
        let dropInterval = setInterval(() => {
          if (!this.ctx || this.isMuted || this.currentMode !== 'ice_drip') return;
          try {
            const dropTime = this.ctx.currentTime;
            const dropOsc = this.ctx.createOscillator();
            const dropGain = this.ctx.createGain();
            const dropFreq = 1600 + Math.random() * 800;

            dropOsc.type = 'sine';
            dropOsc.frequency.setValueAtTime(dropFreq, dropTime);
            dropOsc.frequency.exponentialRampToValueAtTime(dropFreq * 0.5, dropTime + 0.08);

            dropGain.gain.setValueAtTime(0.12 * this.volume, dropTime);
            dropGain.gain.exponentialRampToValueAtTime(0.001, dropTime + 0.08);

            dropOsc.connect(dropGain);
            dropGain.connect(this.ctx.destination);
            dropOsc.start(dropTime);
            dropOsc.stop(dropTime + 0.08);
          } catch (e) {}
        }, 2200);

        this.ambientNode = {
          stop: () => {
            windSource.stop();
            windLfo.stop();
            clearInterval(dropInterval);
          }
        };
      }
    } catch (e) {
      console.warn('Audio start error:', e);
    }
  }

  stopAmbient() {
    if (this.ambientNode) {
      try {
        this.ambientNode.stop();
      } catch (e) {}
      this.ambientNode = null;
    }
  }
}

export const spaceAudio = new SpaceAudioEngine();
