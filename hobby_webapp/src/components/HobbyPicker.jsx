import { useState } from 'react';
import hobbiesData from '../data/all_hobbies.json';
import './HobbyPicker.css';

let audioCtx = null;

const initAudio = () => {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

const playTickSound = () => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(400, audioCtx.currentTime); 
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
  
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
};

const playSuccessSound = () => {
  if (!audioCtx) return;
  const frequencies = [523.25, 659.25, 783.99, 1046.50]; 
  frequencies.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    const startTime = audioCtx.currentTime + (i * 0.08);
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.5);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(startTime);
    osc.stop(startTime + 1.5);
  });
};

function HobbyPicker({ onHobbyPicked }) {
  const [hobby, setHobby] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinText, setSpinText] = useState('Discover a Hobby');

  const spinWheel = () => {
    if (isSpinning) return;
    initAudio();
    setIsSpinning(true);
    setHobby(null);
    
    let counter = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * hobbiesData.length);
      setSpinText(hobbiesData[randomIdx].name);
      playTickSound();
      counter++;
      
      if (counter > 15) {
        clearInterval(interval);
        const finalHobby = hobbiesData[randomIdx];
        setHobby(finalHobby);
        setSpinText('Spin Again');
        setIsSpinning(false);
        playSuccessSound();
        // Automatically add to tracker
        if (onHobbyPicked) {
          onHobbyPicked(finalHobby);
        }
      }
    }, 100);
  };

  const renderStars = (diff) => {
    return '★'.repeat(diff) + '☆'.repeat(5 - diff);
  };

  return (
    <div className="picker-container">
      <button 
        className="spin-btn" 
        onClick={spinWheel}
        disabled={isSpinning}
      >
        {isSpinning ? spinText : (hobby ? 'Spin Again' : 'Discover a Hobby')}
      </button>

      {isSpinning && !hobby && (
        <div className="spinner">Selecting...</div>
      )}

      {hobby && !isSpinning && (
        <div className="hobby-card glass-panel">
          <span className="hobby-category">{hobby.category}</span>
          <h2 className="hobby-name text-gradient">{hobby.name}</h2>
          <p className="hobby-oneliner">"{hobby.oneLiner}"</p>
          
          <div className="hobby-details">
            <div className="detail-section">
              <h4>What is it?</h4>
              <p>{hobby.whatIsIt}</p>
            </div>
            
            <div className="detail-section">
              <h4>How to start</h4>
              <p><strong>Need:</strong> {hobby.howToStart.need}</p>
              <p><strong>First Step:</strong> {hobby.howToStart.firstThing}</p>
            </div>
          </div>
          
          <div className="hobby-stats">
            <div className="stat-item">
              <span className="stat-label">Cost</span>
              <span className="stat-val">{hobby.cost.starting}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Time</span>
              <span className="stat-val">{hobby.time}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Difficulty</span>
              <span className="stat-val">{renderStars(hobby.difficulty)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HobbyPicker;
