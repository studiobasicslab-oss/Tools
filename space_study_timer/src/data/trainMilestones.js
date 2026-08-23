export const TRAIN_MILESTONES = [
  {
    id: 'tokyo_departure',
    name: 'Departure: Tokyo Station',
    subtitle: 'Japan Rail Shinkansen Hub',
    requiredSeconds: 0,
    distanceKm: 0,
    displayDistance: '0 km (Departure)',
    region: 'East Asia',
    color: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    badge: {
      title: 'First Boarding Pass',
      desc: 'Stepped aboard the Global Express with your study crew.',
      rarity: 'Traveler'
    },
    fact: 'Tokyo Station operates more than 4,000 trains each day, renowned for world-leading punctuality measured down to the second.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
        title: 'Tokyo Skytree & City Skyline',
        caption: 'The vibrant neon metropolis glowing before the journey begins.'
      },
      {
        url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80',
        title: 'Shibuya Crossing',
        caption: 'The pulse of Tokyo, packed with energy and innovation.'
      }
    ]
  },
  {
    id: 'kyoto_gardens',
    name: 'Kyoto & Arashiyama Groves',
    subtitle: 'Bamboo Forest & Ancient Temples',
    requiredSeconds: 600, // 10 minutes
    distanceKm: 450,
    displayDistance: '450 km',
    region: 'Japan',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    badge: {
      title: 'Zen Scholar',
      desc: '10 minutes of serene focus. Strolling through whispering green bamboo paths.',
      rarity: 'Common'
    },
    fact: 'Kyoto was the imperial capital of Japan for over a thousand years and preserves over 1,600 historic Buddhist temples.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
        title: 'Fushimi Inari Torii Gates',
        caption: 'Thousands of vermilion torii gates winding through sacred mountaintop trails.'
      },
      {
        url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
        title: 'Arashiyama Bamboo Forest',
        caption: 'Towering green bamboo stalks swaying with the mountain wind.'
      }
    ]
  },
  {
    id: 'darjeeling_tea',
    name: 'Darjeeling Himalayan Express',
    subtitle: 'Kanchenjunga & Tea Plantations',
    requiredSeconds: 1500, // 25 minutes (1 Pomodoro)
    distanceKm: 4800,
    displayDistance: '4,800 km',
    region: 'Himalayas, India',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    badge: {
      title: 'Himalayan Climber',
      desc: 'Completed your first 25-minute Pomodoro! Riding the misty mountain toy train.',
      rarity: 'Uncommon'
    },
    fact: 'The Darjeeling Himalayan Railway is a UNESCO World Heritage site built in 1881, navigating zigzag loops up to 2,200 meters altitude.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        title: 'Rolling Tea Gardens',
        caption: 'Emerald green tea hills shrouded in fresh morning mountain mist.'
      },
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        title: 'Kanchenjunga Snow Peaks',
        caption: 'The third highest mountain in the world glowing in golden sunrise.'
      }
    ]
  },
  {
    id: 'samarkand_silk',
    name: 'Samarkand Silk Road',
    subtitle: 'Registan Turquoise Domes',
    requiredSeconds: 3600, // 1 Hour
    distanceKm: 7600,
    displayDistance: '7,600 km',
    region: 'Uzbekistan',
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    badge: {
      title: 'Silk Road Caravaner',
      desc: '1 full hour of deep study logged! Arrived at the crossroads of world history.',
      rarity: 'Rare'
    },
    fact: 'Samarkand is over 2,750 years old and was the jewel of the ancient Silk Road connecting Asia, the Middle East, and Europe.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
        title: 'Registan Square',
        caption: 'Majestic Islamic architecture with intricate turquoise and cobalt tile mosaics.'
      },
      {
        url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
        title: 'Shah-i-Zinda Necropolis',
        caption: 'A stunning avenue of sky-blue domed mausoleums built across centuries.'
      }
    ]
  },
  {
    id: 'cappadocia_balloons',
    name: 'Cappadocia Valley of Balloons',
    subtitle: 'Fairy Chimneys & Cave Dwellings',
    requiredSeconds: 10800, // 3 Hours
    distanceKm: 10500,
    displayDistance: '10,500 km',
    region: 'Turkey',
    color: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    badge: {
      title: 'Skyward Dreamer',
      desc: '3 hours of focused study! Watching hundreds of hot air balloons rise over rocky spires.',
      rarity: 'Rare'
    },
    fact: 'Cappadocia’s unique landscape was sculpted by volcanic eruptions and millennia of erosion, carving out subterranean underground cities.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=80',
        title: 'Sunrise Hot Air Balloons',
        caption: 'Hundreds of colorful balloons soaring over golden volcanic ridges at dawn.'
      },
      {
        url: 'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=1200&q=80',
        title: 'Goreme Fairy Chimneys',
        caption: 'Ancient honeycombed cave dwellings carved directly into soft tuff rock.'
      }
    ]
  },
  {
    id: 'venice_canals',
    name: 'Venice & The Grand Canal',
    subtitle: 'Floating City of Bridges & Gondolas',
    requiredSeconds: 36000, // 10 Hours (~3-4 days)
    distanceKm: 13200,
    displayDistance: '13,200 km',
    region: 'Italy',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    badge: {
      title: 'Venetian Navigator',
      desc: '10 hours logged! Cruising past Renaissance palazzos along the sparkling lagoon.',
      rarity: 'Epic'
    },
    fact: 'Venice is built across 118 small islands separated by 150 canals and connected by over 400 bridges, with zero cars.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1200&q=80',
        title: 'The Grand Canal at Twilight',
        caption: 'Historic Venetian palaces glowing along the shimmering blue waterway.'
      },
      {
        url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80',
        title: 'Piazza San Marco & Gondolas',
        caption: 'Traditional wooden gondolas moored near St. Mark’s Campanile tower.'
      }
    ]
  },
  {
    id: 'swiss_alps',
    name: 'The Swiss Alps & Glacier Express',
    subtitle: 'The Matterhorn & Zermatt Valleys',
    requiredSeconds: 72000, // 20 Hours
    distanceKm: 14800,
    displayDistance: '14,800 km',
    region: 'Switzerland',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    badge: {
      title: 'Alpine Peak Explorer',
      desc: '20 hours of pure discipline. Surrounded by crystalline glaciers and snow peaks.',
      rarity: 'Epic'
    },
    fact: 'The Glacier Express is known as the slowest express train in the world, taking 8 hours to traverse 291 bridges and 91 tunnels through the Alps.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
        title: 'The Iconic Matterhorn',
        caption: 'The jagged pyramid peak piercing through crisp alpine clouds.'
      },
      {
        url: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=1200&q=80',
        title: 'Glacier Express Viaduct Crossing',
        caption: 'The red train crossing soaring curved stone viaducts high above the pine gorge.'
      }
    ]
  },
  {
    id: 'paris_seine',
    name: 'Paris & The Seine Riverbank',
    subtitle: 'Eiffel Tower Sunset & Montmartre',
    requiredSeconds: 162000, // 45 Hours (~2-3 weeks)
    distanceKm: 16200,
    displayDistance: '16,200 km',
    region: 'France',
    color: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.4)',
    badge: {
      title: 'Philosopher of Paris',
      desc: '45 hours achieved! Writing essays and studying by cozy Parisian street cafés.',
      rarity: 'Legendary'
    },
    fact: 'The Eiffel Tower shrinks by about 15 cm in the winter due to thermal contraction of the puddle iron metal.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
        title: 'Eiffel Tower Sunset Glow',
        caption: 'The golden monument illuminated above the city lights of Paris.'
      },
      {
        url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
        title: 'Pont Alexandre III on the Seine',
        caption: 'Ornate Beaux-Arts lanterns framing the tranquil river waterway.'
      }
    ]
  },
  {
    id: 'scottish_highlands',
    name: 'Scottish Highlands & Glenfinnan',
    subtitle: 'Jacobite Steam Train & Misty Lochs',
    requiredSeconds: 288000, // 80 Hours
    distanceKm: 18500,
    displayDistance: '18,500 km',
    region: 'Scotland, UK',
    color: '#818cf8',
    glowColor: 'rgba(129, 140, 248, 0.4)',
    badge: {
      title: 'Highland Arch-Scholar',
      desc: '80 hours of relentless focus. Chugging through rolling heather moors and viaducts.',
      rarity: 'Legendary'
    },
    fact: 'The Glenfinnan Viaduct has 21 soaring concrete arches built in 1898, famously featured as the route of the Hogwarts Express.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80',
        title: 'Glenfinnan Viaduct Steam Train',
        caption: 'Vintage steam plume billowing over the lush green Scottish glen.'
      },
      {
        url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
        title: 'Isle of Skye & Misty Lochs',
        caption: 'Dramatic crags, emerald hills, and reflective mountain lochs.'
      }
    ]
  },
  {
    id: 'giza_pyramids',
    name: 'Giza Pyramids & The Nile',
    subtitle: 'Sphinx & Ancient Pharaoh Wonders',
    requiredSeconds: 468000, // 130 Hours
    distanceKm: 24000,
    displayDistance: '24,000 km',
    region: 'Egypt',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    badge: {
      title: 'Keeper of the Pyramids',
      desc: '130 hours reached! Gazing upon the only surviving Ancient Wonder of the World.',
      rarity: 'Mythic'
    },
    fact: 'The Great Pyramid of Giza was the tallest man-made structure in the world for over 3,800 years, aligned almost perfectly to true north.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
        title: 'The Great Pyramids at Dusk',
        caption: 'Ancient limestone monuments standing tall against the desert sunset.'
      },
      {
        url: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=1200&q=80',
        title: 'The Great Sphinx of Giza',
        caption: 'The mythical lion-bodied guardian carved from natural limestone bedrock.'
      }
    ]
  },
  {
    id: 'machu_picchu',
    name: 'Machu Picchu & The Sacred Valley',
    subtitle: 'Inca Citadel in the Cloud Forest',
    requiredSeconds: 720000, // 200 Hours
    distanceKm: 33000,
    displayDistance: '33,000 km',
    region: 'Andes Mountains, Peru',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    badge: {
      title: 'Inca Empire Chronicler',
      desc: '200 hours logged! Riding the Belmond rail deep into misty Andean peaks.',
      rarity: 'Mythic'
    },
    fact: 'Machu Picchu was built around 1450 AD using ashlar masonry, where stones are fit together so precisely without mortar that not even a knife blade can fit between them.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80',
        title: 'Machu Picchu Mountain Citadel',
        caption: 'Terraced stone ruins perched dramatically above the Urubamba river valley.'
      },
      {
        url: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=1200&q=80',
        title: 'Llamas & Sacred Valley Terraces',
        caption: 'Gentle native llamas grazing among ancient agricultural stone terraces.'
      }
    ]
  },
  {
    id: 'banff_rockies',
    name: 'Banff & The Canadian Rockies',
    subtitle: 'Lake Louise & Rocky Mountaineer',
    requiredSeconds: 1080000, // 300 Hours
    distanceKm: 42000,
    displayDistance: '42,000 km',
    region: 'Alberta, Canada',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    badge: {
      title: 'Glacial Lake Pioneer',
      desc: '300 hours achieved! Glass-dome train car passing crystalline turquoise glacial lakes.',
      rarity: 'Exalted'
    },
    fact: 'Lake Louise gets its surreal turquoise hue from "rock flour" — extremely fine glacial silt suspended in the crystal mountain meltwater.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80',
        title: 'Lake Louise Turquoise Waters',
        caption: 'Pristine glacial lake framed by soaring snow-capped Rocky Mountains.'
      },
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        title: 'Moraine Lake & Valley of the Ten Peaks',
        caption: 'Vibrant indigo blue water mirroring the jagged mountain peaks.'
      }
    ]
  },
  {
    id: 'sydney_barrier_reef',
    name: 'Sydney Harbor & Barrier Reef',
    subtitle: 'Opera House & Azure Pacific Waters',
    requiredSeconds: 1512000, // 420 Hours
    distanceKm: 56000,
    displayDistance: '56,000 km',
    region: 'Australia',
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    badge: {
      title: 'Pacific Coast Master',
      desc: '420 hours logged! Passing the iconic shell-roof Opera House across Sydney Harbor.',
      rarity: 'Exalted'
    },
    fact: 'The Great Barrier Reef is the largest living structure on Earth, stretching over 2,300 km and visible from outer space.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
        title: 'Sydney Opera House & Harbor Bridge',
        caption: 'The architectural masterpiece shining over sparkling blue waters.'
      },
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
        title: 'Great Barrier Reef Coral Gardens',
        caption: 'Vibrant kaleidoscope of coral formations and tropical marine life.'
      }
    ]
  },
  {
    id: 'antarctica_aurora',
    name: 'Antarctica & Southern Lights',
    subtitle: 'Aurora Australis & Polar Glaciers',
    requiredSeconds: 2160000, // 600 Hours
    distanceKm: 72000,
    displayDistance: '72,000 km',
    region: 'Antarctica',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    badge: {
      title: 'Polar Expedition Legend',
      desc: '600 hours of lifelong focus! Reached the southern frozen realm under dancing green auroras.',
      rarity: 'Transcendent'
    },
    fact: 'Antarctica holds 90% of the world’s ice and 70% of its fresh water, with temperatures plunging below -89°C.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
        title: 'Aurora Australis over Icebergs',
        caption: 'Emerald green ribbons of light dancing over frozen sea ice.'
      },
      {
        url: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=1200&q=80',
        title: 'Emperor Penguins on Sea Ice',
        caption: 'Majestic penguins gathered together against the polar landscape.'
      }
    ]
  },
  {
    id: 'global_grand_slam',
    name: 'Global Circumnavigation Grand Slam',
    subtitle: 'Full Earth Globe Mastered',
    requiredSeconds: 3600000, // 1000 Hours
    distanceKm: 100000,
    displayDistance: '100,000+ km (Full Globe Mastered)',
    region: 'Worldwide',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.6)',
    badge: {
      title: 'World Circumnavigator Extraordinaire',
      desc: '1,000 HOURS OF DEDICATED STUDY! You have circled the entire Earth multiple times with your companions.',
      rarity: 'Global God'
    },
    fact: 'The circumference of the Earth at the equator is approximately 40,075 km. At 1,000 hours, you have circumnavigated the globe more than twice over!',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        title: 'Planet Earth from Orbit',
        caption: 'The radiant blue marble connected by your boundless knowledge.'
      },
      {
        url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
        title: 'The World Passport of Knowledge',
        caption: 'A lifelong journey of learning, shared moments, and endless exploration.'
      }
    ]
  }
];

export function getTrainProgressToNextMilestone(totalSeconds) {
  let currentMilestone = TRAIN_MILESTONES[0];
  let nextMilestone = TRAIN_MILESTONES[1];

  for (let i = 0; i < TRAIN_MILESTONES.length; i++) {
    if (totalSeconds >= TRAIN_MILESTONES[i].requiredSeconds) {
      currentMilestone = TRAIN_MILESTONES[i];
      nextMilestone = TRAIN_MILESTONES[i + 1] || null;
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
      currentStageIndex: TRAIN_MILESTONES.length - 1
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
    currentStageIndex: TRAIN_MILESTONES.findIndex(m => m.id === currentMilestone.id)
  };
}

export function formatTrainDistance(totalSeconds) {
  if (totalSeconds <= 0) return '0 km';
  
  for (let i = 0; i < TRAIN_MILESTONES.length - 1; i++) {
    const cur = TRAIN_MILESTONES[i];
    const nxt = TRAIN_MILESTONES[i + 1];
    if (totalSeconds >= cur.requiredSeconds && totalSeconds < nxt.requiredSeconds) {
      const frac = (totalSeconds - cur.requiredSeconds) / (nxt.requiredSeconds - cur.requiredSeconds);
      const km = cur.distanceKm + frac * (nxt.distanceKm - cur.distanceKm);
      return `${Math.round(km).toLocaleString()} km`;
    }
  }

  const last = TRAIN_MILESTONES[TRAIN_MILESTONES.length - 1];
  const excess = totalSeconds - last.requiredSeconds;
  const km = last.distanceKm + excess * 50;
  return `${Math.round(km).toLocaleString()} km`;
}
