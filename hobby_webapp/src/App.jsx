import { useState, useEffect } from 'react';
import HobbyPicker from './components/HobbyPicker';
import Tracker from './components/Tracker';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('picker');
  const [trackedHobbies, setTrackedHobbies] = useState([]);

  // Load from localStorage on initial render
  useEffect(() => {
    const saved = localStorage.getItem('hobbyTrackerData');
    if (saved) {
      try {
        setTrackedHobbies(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse tracked hobbies');
      }
    }
  }, []);

  // Save to localStorage whenever trackedHobbies changes
  useEffect(() => {
    localStorage.setItem('hobbyTrackerData', JSON.stringify(trackedHobbies));
  }, [trackedHobbies]);

  const handleAddHobby = (hobby) => {
    // Prevent duplicates
    if (!trackedHobbies.some(h => h.name === hobby.name)) {
      setTrackedHobbies(prev => [
        {
          ...hobby,
          datePicked: new Date().toISOString(),
          rating: 0,
          status: 'Not yet tried'
        },
        ...prev
      ]);
    }
  };

  const handleUpdateHobby = (hobbyName, updates) => {
    setTrackedHobbies(prev => prev.map(h => 
      h.name === hobbyName ? { ...h, ...updates } : h
    ));
  };

  const handleDeleteHobby = (hobbyName) => {
    setTrackedHobbies(prev => prev.filter(h => h.name !== hobbyName));
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo">Hobbyist</div>
        <nav className="nav-links">
          <button 
            className={`nav-btn ${activeTab === 'picker' ? 'active' : ''}`}
            onClick={() => setActiveTab('picker')}
          >
            Discover
          </button>
          <button 
            className={`nav-btn ${activeTab === 'tracker' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracker')}
          >
            My Tracker ({trackedHobbies.length})
          </button>
        </nav>
      </header>

      <main>
        {activeTab === 'picker' ? (
          <HobbyPicker onHobbyPicked={handleAddHobby} />
        ) : (
          <Tracker 
            hobbies={trackedHobbies} 
            onUpdate={handleUpdateHobby} 
            onDelete={handleDeleteHobby} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
