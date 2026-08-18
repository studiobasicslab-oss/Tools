import { useState, useEffect } from 'react';
import HobbyPicker from './components/HobbyPicker';
import Tracker from './components/Tracker';
import Auth from './components/Auth';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('picker');
  const [trackedHobbies, setTrackedHobbies] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
      if (!currentUser) {
        setTrackedHobbies([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadHobbiesFromFirestore(user.uid);
    }
  }, [user]);

  const loadHobbiesFromFirestore = async (userId) => {
    try {
      const q = query(collection(db, "tracked_hobbies"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const hobbies = [];
      querySnapshot.forEach((doc) => {
        hobbies.push(doc.data());
      });
      // Sort by datePicked descending (newest first)
      hobbies.sort((a, b) => new Date(b.datePicked) - new Date(a.datePicked));
      setTrackedHobbies(hobbies);
    } catch (error) {
      console.error("Error loading hobbies from Firestore:", error);
    }
  };

  const handleAddHobby = async (hobby) => {
    if (!user) return;
    
    // Prevent duplicates
    if (!trackedHobbies.some(h => h.name === hobby.name)) {
      const newHobby = {
        ...hobby,
        userId: user.uid,
        datePicked: new Date().toISOString(),
        rating: 0,
        status: 'Not yet tried'
      };
      
      // Optimistic update
      setTrackedHobbies(prev => [newHobby, ...prev]);

      try {
        const docRef = doc(db, "tracked_hobbies", `${user.uid}_${hobby.name.replace(/[^a-zA-Z0-9]/g, '')}`);
        await setDoc(docRef, newHobby);
      } catch (error) {
        console.error("Error adding hobby to Firestore:", error);
      }
    }
  };

  const handleUpdateHobby = async (hobbyName, updates) => {
    if (!user) return;
    
    // Optimistic update
    setTrackedHobbies(prev => prev.map(h => 
      h.name === hobbyName ? { ...h, ...updates } : h
    ));

    try {
      const docRef = doc(db, "tracked_hobbies", `${user.uid}_${hobbyName.replace(/[^a-zA-Z0-9]/g, '')}`);
      // Merge updates with existing document
      await setDoc(docRef, updates, { merge: true });
    } catch (error) {
      console.error("Error updating hobby in Firestore:", error);
    }
  };

  const handleDeleteHobby = async (hobbyName) => {
    if (!user) return;

    // Optimistic update
    setTrackedHobbies(prev => prev.filter(h => h.name !== hobbyName));

    try {
      const docRef = doc(db, "tracked_hobbies", `${user.uid}_${hobbyName.replace(/[^a-zA-Z0-9]/g, '')}`);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting hobby from Firestore:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loadingAuth) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#666' }}>Loading...</div>;
  }

  return (
    <div className="app-container">
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a href="https://haris-lab.vercel.app/" style={{ textDecoration: 'none', color: '#666', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            &larr; Back to Studio
          </a>
          <div className="logo" style={{ marginLeft: '10px' }}>Hobbyist</div>
        </div>
        
        {user && (
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
            <button className="nav-btn" onClick={handleLogout} style={{ color: '#ef4444' }}>
              Logout
            </button>
          </nav>
        )}
      </header>

      <main>
        {!user ? (
          <Auth />
        ) : activeTab === 'picker' ? (
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
