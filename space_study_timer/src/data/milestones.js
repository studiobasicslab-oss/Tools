export const MILESTONES = [
  {
    id: 'launchpad',
    name: 'Launchpad Ignition',
    subtitle: 'Cape Canaveral / Spaceport Earth',
    requiredSeconds: 0,
    distanceKm: 0,
    displayDistance: '0 km',
    stage: 'surface',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    icon: 'Rocket',
    badge: {
      title: 'First Ignition',
      desc: 'Embark on the boundless journey of lifelong learning.',
      rarity: 'Initiate'
    },
    fact: 'Reaching orbit requires a spacecraft to accelerate to nearly 28,000 km/h (17,500 mph) to balance gravitational pull with centrifugal speed.',
    body: { type: 'earth', radius: 45, color: '#3b82f6', secondary: '#10b981', atmosphere: '#60a5fa' }
  },
  {
    id: 'troposphere',
    name: 'Troposphere & Cloud Layer',
    subtitle: 'Atmospheric Ascent',
    requiredSeconds: 600, // 10 minutes
    distanceKm: 12,
    displayDistance: '12 km',
    stage: 'atmosphere',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    icon: 'Cloud',
    badge: {
      title: 'Cloud Piercer',
      desc: 'Pushed through initial resistance and ascended past the storm clouds.',
      rarity: 'Common'
    },
    fact: 'The troposphere contains roughly 75% of the atmosphere’s mass and 99% of its water vapor. Commercial jetliners cruise right at its upper limit.',
    body: { type: 'atmosphere', radius: 48, color: '#bae6fd', secondary: '#e0f2fe', clouds: true }
  },
  {
    id: 'karman',
    name: 'The Kármán Line',
    subtitle: 'Boundary of Outer Space',
    requiredSeconds: 1500, // 25 minutes (1 Pomodoro)
    distanceKm: 100,
    displayDistance: '100 km',
    stage: 'space_boundary',
    color: '#818cf8',
    glowColor: 'rgba(129, 140, 248, 0.4)',
    icon: 'Sparkles',
    badge: {
      title: 'Astronaut Wings',
      desc: 'Officially crossed into space! Completed your first 25 minutes of deep focus.',
      rarity: 'Uncommon'
    },
    fact: 'The Kármán line at 100 km altitude marks the threshold where aeronautical flight becomes impossible without reaching orbital velocity.',
    body: { type: 'orbit_low', radius: 52, color: '#1e3a8a', atmosphere: '#818cf8' }
  },
  {
    id: 'iss_leo',
    name: 'Low Earth Orbit (LEO & ISS)',
    subtitle: 'International Space Station',
    requiredSeconds: 3600, // 1 Hour
    distanceKm: 420,
    displayDistance: '420 km',
    stage: 'orbit',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    icon: 'Satellite',
    badge: {
      title: 'Orbital Pioneer',
      desc: 'Completed 1 full hour of dedicated study. Floating alongside the ISS.',
      rarity: 'Rare'
    },
    fact: 'The ISS orbits Earth every 90 minutes at 7.66 km/s, witnessing 16 sunrises and sunsets every single day.',
    body: { type: 'station', radius: 35, color: '#e2e8f0', solarPanels: true }
  },
  {
    id: 'geostationary',
    name: 'Geostationary Earth Orbit (GEO)',
    subtitle: 'Van Allen Belts Crossing',
    requiredSeconds: 10800, // 3 Hours
    distanceKm: 35786,
    displayDistance: '35,786 km',
    stage: 'orbit_high',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    icon: 'Radio',
    badge: {
      title: 'High Orbit Master',
      desc: '3 hours of deep cosmic study. Earth is now a majestic glowing blue marble below.',
      rarity: 'Rare'
    },
    fact: 'At 35,786 km, satellites orbit Earth in exactly 24 hours, remaining permanently locked above the exact same spot on the ground.',
    body: { type: 'earth_distant', radius: 28, color: '#2563eb', continents: '#16a34a' }
  },
  {
    id: 'moon',
    name: 'The Moon (Lunar Orbit)',
    subtitle: 'Sea of Tranquility & Apollo Site',
    requiredSeconds: 36000, // 10 Hours (~3-4 days of regular study)
    distanceKm: 384400,
    displayDistance: '384,400 km',
    stage: 'lunar',
    color: '#f3f4f6',
    glowColor: 'rgba(243, 244, 246, 0.4)',
    icon: 'Moon',
    badge: {
      title: 'Lunar Conqueror',
      desc: '10 hours of focused study logged! One giant leap for your knowledge and intellect.',
      rarity: 'Epic'
    },
    fact: 'The Moon is tidally locked with Earth, meaning the same face always points toward us. Its surface is covered in fine grey regolith from billions of years of impacts.',
    body: { type: 'moon', radius: 40, color: '#9ca3af', craters: true }
  },
  {
    id: 'jwst_l2',
    name: 'Lagrange Point L2 (JWST)',
    subtitle: 'Deep Space Cosmic Observatory',
    requiredSeconds: 72000, // 20 Hours
    distanceKm: 1500000,
    displayDistance: '1,500,000 km',
    stage: 'deep_space',
    color: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.4)',
    icon: 'Eye',
    badge: {
      title: 'Cosmic Visionary',
      desc: '20 hours of cosmic focus. Gaze upon the earliest galaxies of the universe.',
      rarity: 'Epic'
    },
    fact: 'Lagrange Point L2 is a gravitational sweet spot where the combined pull of the Sun and Earth balances out, keeping telescopes in perpetual equilibrium.',
    body: { type: 'jwst', radius: 30, color: '#fbbf24', shield: '#e2e8f0' }
  },
  {
    id: 'mars',
    name: 'Mars (The Red Planet)',
    subtitle: 'Olympus Mons & Valles Marineris',
    requiredSeconds: 162000, // 45 Hours (~2-3 weeks of study)
    distanceKm: 78340000,
    displayDistance: '78.3 Million km (0.52 AU)',
    stage: 'planetary',
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    icon: 'Globe',
    badge: {
      title: 'Martian Colonist',
      desc: '45 hours achieved! You have journeyed to Mars and established a study research outpost.',
      rarity: 'Legendary'
    },
    fact: 'Mars hosts Olympus Mons, a shield volcano three times taller than Mount Everest, and canyons deep enough to span the entire North American continent.',
    body: { type: 'mars', radius: 42, color: '#dc2626', canyons: '#991b1b', polarCap: true }
  },
  {
    id: 'asteroid_belt',
    name: 'Asteroid Belt & Dwarf Ceres',
    subtitle: 'Cosmic Rubble Navigation',
    requiredSeconds: 288000, // 80 Hours
    distanceKm: 414000000,
    displayDistance: '414 Million km (2.77 AU)',
    stage: 'asteroid_belt',
    color: '#a8a29e',
    glowColor: 'rgba(168, 162, 158, 0.4)',
    icon: 'Disc',
    badge: {
      title: 'Asteroid Navigator',
      desc: '80 hours of relentless focus. Braved millions of ancient planetesimals and charted Ceres.',
      rarity: 'Legendary'
    },
    fact: 'Despite sci-fi depictions, the Asteroid Belt is mostly empty vacuum: the average distance between asteroids is over 960,000 km!',
    body: { type: 'ceres', radius: 32, color: '#78716c', spots: '#d6d3d1' }
  },
  {
    id: 'jupiter',
    name: 'Jupiter (The King of Planets)',
    subtitle: 'Great Red Spot & Europa Ocean',
    requiredSeconds: 468000, // 130 Hours (~1-2 months)
    distanceKm: 628730000,
    displayDistance: '628 Million km (5.2 AU)',
    stage: 'gas_giant',
    color: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    icon: 'Sun',
    badge: {
      title: 'Jovian Sovereign',
      desc: '130 hours of monumental dedication! Swirling with the great storms of Jupiter.',
      rarity: 'Mythic'
    },
    fact: 'Jupiter is more massive than all other planets in the solar system combined. Its Great Red Spot is a persistent anticyclone storm larger than planet Earth.',
    body: { type: 'jupiter', radius: 64, color: '#ea580c', bands: ['#c2410c', '#fb923c', '#fdba74'], redSpot: true }
  },
  {
    id: 'saturn',
    name: 'Saturn & The Ring Symphony',
    subtitle: 'Titan Atmosphere & Ring Crossing',
    requiredSeconds: 720000, // 200 Hours
    distanceKm: 1429000000,
    displayDistance: '1.43 Billion km (9.5 AU)',
    stage: 'gas_giant',
    color: '#fde047',
    glowColor: 'rgba(253, 224, 71, 0.4)',
    icon: 'Target',
    badge: {
      title: 'Ringlord of Saturn',
      desc: '200 hours of pure discipline. Sailing through the glittering ice rings of Saturn.',
      rarity: 'Mythic'
    },
    fact: 'Saturn’s rings are over 280,000 km wide but on average only 10 to 30 meters thick, composed of billions of chunks of pure water ice.',
    body: { type: 'saturn', radius: 55, color: '#eab308', rings: true, ringColor: '#fef08a' }
  },
  {
    id: 'uranus_neptune',
    name: 'Uranus & Neptune (The Ice Giants)',
    subtitle: 'Outer Solar Abyss & Triton',
    requiredSeconds: 1080000, // 300 Hours
    distanceKm: 4350000000,
    displayDistance: '4.35 Billion km (29 AU)',
    stage: 'ice_giant',
    color: '#2dd4bf',
    glowColor: 'rgba(45, 212, 191, 0.4)',
    icon: 'Compass',
    badge: {
      title: 'Ice Giant Voyager',
      desc: '300 hours reached! You have pierced the deep, diamond-raining azure atmosphere.',
      rarity: 'Exalted'
    },
    fact: 'Neptune experiences the most violent winds in the solar system, exceeding 2,100 km/h (Mach 1.7), powered by internal heat.',
    body: { type: 'neptune', radius: 46, color: '#0284c7', storms: '#38bdf8' }
  },
  {
    id: 'pluto_kuiper',
    name: 'Pluto & The Kuiper Belt',
    subtitle: 'Tombaugh Regio & Nitrogen Ice',
    requiredSeconds: 1512000, // 420 Hours
    distanceKm: 5906000000,
    displayDistance: '5.9 Billion km (39.5 AU)',
    stage: 'kuiper_belt',
    color: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.4)',
    icon: 'Heart',
    badge: {
      title: 'Guardian of the Kuiper Belt',
      desc: '420 hours achieved! Gazing upon the frozen nitrogen heart of Pluto.',
      rarity: 'Exalted'
    },
    fact: 'Pluto has a giant heart-shaped nitrogen glacier named Tombaugh Regio, actively circulating and renewing itself like a beating cosmic heart.',
    body: { type: 'pluto', radius: 26, color: '#a855f7', heart: '#f3e8ff' }
  },
  {
    id: 'heliopause',
    name: 'Heliopause (Voyager Threshold)',
    subtitle: 'Boundary of the Solar System',
    requiredSeconds: 2160000, // 600 Hours
    distanceKm: 18000000000,
    displayDistance: '18 Billion km (120 AU)',
    stage: 'heliopause',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    icon: 'Shield',
    badge: {
      title: 'Interstellar Voyager',
      desc: '600 hours of lifelong study! You have officially departed the Sun’s magnetic sphere.',
      rarity: 'Transcendent'
    },
    fact: 'At the Heliopause, the solar wind collides with the interstellar medium, where interstellar plasma density jumps by a factor of 40.',
    body: { type: 'heliopause', radius: 50, color: '#6366f1', plasma: true }
  },
  {
    id: 'proxima',
    name: 'Proxima Centauri & Alpha Centauri',
    subtitle: 'First Interstellar Star System',
    requiredSeconds: 3600000, // 1000 Hours (The 1000-Hour Master)
    distanceKm: 40140000000000,
    displayDistance: '4.24 Light Years (40.1 Trillion km)',
    stage: 'interstellar',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.6)',
    icon: 'Award',
    badge: {
      title: 'Cosmic Arch-Scholar',
      desc: '1,000 HOURS OF FOCUS! You have achieved interstellar mastery, bridging stellar worlds.',
      rarity: 'Cosmic God'
    },
    fact: 'Proxima Centauri is the nearest known star to our Sun, hosting an Earth-sized exoplanet in its habitable zone (Proxima b).',
    body: { type: 'star_proxima', radius: 50, color: '#f43f5e', corona: '#fb7185' }
  }
];

export const STUDY_SUBJECTS = [
  { id: 'math', name: 'Mathematics & Logic', icon: 'Calculator', color: '#38bdf8' },
  { id: 'coding', name: 'Computer Science & Code', icon: 'Code', color: '#4ade80' },
  { id: 'science', name: 'Natural Sciences & Physics', icon: 'Atom', color: '#a855f7' },
  { id: 'languages', name: 'Languages & Literature', icon: 'BookOpen', color: '#f472b6' },
  { id: 'engineering', name: 'Engineering & Design', icon: 'Cpu', color: '#fb923c' },
  { id: 'exam', name: 'Exam & Test Prep', icon: 'GraduationCap', color: '#facc15' },
  { id: 'general', name: 'Deep Work & Exploration', icon: 'Compass', color: '#94a3b8' }
];

export function getProgressToNextMilestone(totalSeconds) {
  let currentMilestone = MILESTONES[0];
  let nextMilestone = MILESTONES[1];

  for (let i = 0; i < MILESTONES.length; i++) {
    if (totalSeconds >= MILESTONES[i].requiredSeconds) {
      currentMilestone = MILESTONES[i];
      nextMilestone = MILESTONES[i + 1] || null;
    } else {
      break;
    }
  }

  if (!nextMilestone) {
    return {
      currentMilestone,
      nextMilestone: null,
      progressPercent: 100,
      remainingSeconds: 0,
      currentStageIndex: MILESTONES.length - 1
    };
  }

  const range = nextMilestone.requiredSeconds - currentMilestone.requiredSeconds;
  const elapsed = totalSeconds - currentMilestone.requiredSeconds;
  const progressPercent = Math.min(100, Math.max(0, (elapsed / range) * 100));
  const remainingSeconds = Math.max(0, nextMilestone.requiredSeconds - totalSeconds);

  return {
    currentMilestone,
    nextMilestone,
    progressPercent,
    remainingSeconds,
    currentStageIndex: MILESTONES.findIndex(m => m.id === currentMilestone.id)
  };
}

export function formatDistance(totalSeconds) {
  if (totalSeconds <= 0) return '0 km';
  
  // Find current bracket for accurate smooth distance interpolation
  for (let i = 0; i < MILESTONES.length - 1; i++) {
    const cur = MILESTONES[i];
    const nxt = MILESTONES[i + 1];
    if (totalSeconds >= cur.requiredSeconds && totalSeconds < nxt.requiredSeconds) {
      const frac = (totalSeconds - cur.requiredSeconds) / (nxt.requiredSeconds - cur.requiredSeconds);
      const km = cur.distanceKm + frac * (nxt.distanceKm - cur.distanceKm);
      return formatKm(km);
    }
  }

  // Beyond last milestone:
  const last = MILESTONES[MILESTONES.length - 1];
  const excess = totalSeconds - last.requiredSeconds;
  const km = last.distanceKm + excess * 1000000;
  return formatKm(km);
}

function formatKm(km) {
  if (km < 1000) return `${Math.round(km)} km`;
  if (km < 1000000) return `${(km / 1000).toFixed(1)}k km`;
  if (km < 149597870) return `${(km / 1000000).toFixed(2)} Million km`;
  
  // In AU (Astronomical Units)
  const au = km / 149597870.7;
  if (au < 63241) return `${au.toFixed(2)} AU (${(km / 1000000000).toFixed(2)}B km)`;
  
  // In Light Years
  const ly = km / 9460730472580.8;
  return `${ly.toFixed(3)} Light Years`;
}

export function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  }
  return `${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
}

export function formatTimeDigital(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
