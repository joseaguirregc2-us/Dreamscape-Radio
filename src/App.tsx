import React, { useState, useEffect } from 'react';
import { globalAudioEngine } from './audioEngine';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { AuthGuard } from './components/AuthGuard';
import {
  TrackPreset,
  ListeningMode,
  AmbientSound,
  AmbientSoundType,
  UserProfile,
} from './types';
import { AudioVisualizer } from './components/AudioVisualizer';
import { MixerPanel } from './components/MixerPanel';
import { AIAssistant } from './components/AIAssistant';
import { DJMode } from './components/DJMode';
import { HistoryAndFavorites } from './components/HistoryAndFavorites';
import { UserStats } from './components/UserStats';
import { AuthAndMonetization } from './components/AuthAndMonetization';

// Advanced Universe Addon Components
import { DreamscapeUniverse, worldsData } from './components/DreamscapeUniverse';
import { AudioStudio } from './components/AudioStudio';
import { DjAssistant } from './components/DjAssistant';
import { Marketplace } from './components/Marketplace';
import { BioFeedback } from './components/BioFeedback';
import { GlobalLiveEvents } from './components/GlobalLiveEvents';
import { GamifiedSintonizer } from './components/GamifiedSintonizer';
import { TotalImmersion } from './components/TotalImmersion';
import { LiveVisualEngine } from './components/LiveVisualEngine';

import {
  Play,
  Pause,
  Sliders,
  Sparkles,
  Volume2,
  Crown,
  Disc,
  Clock,
  Heart,
  Music,
  Share2,
  Radio,
  Menu,
  X,
  Compass,
  Cpu,
  ShoppingBag,
  Award,
  Maximize2,
  Activity,
  Tv,
  LogOut,
} from 'lucide-react';

export default function App() {
  // Global Workspace navigation Tab: 'radio' | 'universe' | 'studio' | 'dj' | 'live' | 'coop' | 'challenges' | 'stats'
  const [activeTab, setActiveTab] = useState<string>('radio');
  
  // Fullscreen mode active state
  const [isImmersionActive, setIsImmersionActive] = useState<boolean>(false);

  // Global Playback & Tonal States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentBPM, setCurrentBPM] = useState<number>(92);
  const [currentIntensity, setCurrentIntensity] = useState<number>(5);
  const [currentBassDepth, setCurrentBassDepth] = useState<number>(6);
  const [currentSynthPreset, setCurrentSynthPreset] = useState<string>('warm-pad');
  const [activeModeId, setActiveModeId] = useState<string>('lluvia_cyberpunk');
  const [visualizerMode, setVisualizerMode] = useState<'Cyberpunk' | 'Espacial' | 'Minimalista' | 'Abstracto'>('Cyberpunk');
  const [currentAtmosphereTitle, setCurrentAtmosphereTitle] = useState<string>('Canal Lluvia Cyberpunk');
  
  // Active World inside Universe tracking
  const [activeWorldId, setActiveWorldId] = useState<string>('eclipse-ix');

  // Ambient Layer states
  const [ambientSounds, setAmbientSounds] = useState<AmbientSound[]>([
    { type: 'rain', label: '🌧️ Lluvia', volume: 0.65, active: true },
    { type: 'thunder', label: '⚡ Tormenta', volume: 0.25, active: true },
    { type: 'wind', label: '💨 Viento', volume: 0.15, active: false },
    { type: 'forest', label: '🌲 Bosques', volume: 0.35, active: false },
    { type: 'waves', label: '🌊 Oleaje Mar', volume: 0.45, active: false },
    { type: 'fire', label: '🔥 Fogata', volume: 0.4, active: false },
    { type: 'city', label: '🏙️ Ciudad Cyber', volume: 0.35, active: true },
    { type: 'train', label: '🚊 Tren Nocturno', volume: 0.4, active: false },
    { type: 'coffee', label: '☕ Café Murmullos', volume: 0.3, active: false },
    { type: 'space', label: '🌌 Éter Espacial', volume: 0.45, active: false },
  ]);

  // Premium User profile tracking
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: 'Jose_Gomez_X',
    isPremium: false,
    favorites: {
      tracks: ['tr-1', 'tr-5'],
      mixes: ['com-1'],
    },
    listenedHours: 14.852,
    favoriteGenre: 'Dub Techno',
    avgBPM: 94,
    streakDays: 12,
  });

  // Dynamic search prompt to seed chat assistant directly from top bar
  const [aiSearchTrigger, setAiSearchTrigger] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Built-in high-quality tracks collection for explorer sintonizaciones
  const [tracks, setTracks] = useState<TrackPreset[]>([
    {
      id: 'tr-1',
      title: 'Transito de Berlín (Berlín Transit)',
      genre: 'Dub Techno',
      bpm: 110,
      energy: 3,
      intensity: 6,
      bassDepth: 8,
      ambientLevel: 5,
      synthPreset: 'deep-drone',
      chordProgression: [[50, 53, 57, 60], [45, 48, 52, 55], [47, 50, 53, 57], [48, 52, 55, 59]], // Dm7, Am7, Bm7b5, Cmaj7
      description: 'Líneas de distorsión profunda con ruidos rítmicos analógicos e intrusión de viento helado.',
      isPopular: true,
      createdAt: '2026-05-20',
    },
    {
      id: 'tr-2',
      title: 'Neblina Eterna (Eternal Mist)',
      genre: 'Ambient Techno',
      bpm: 88,
      energy: 2,
      intensity: 3,
      bassDepth: 5,
      ambientLevel: 9,
      synthPreset: 'cosmic',
      chordProgression: [[55, 59, 62, 65], [53, 57, 60, 64], [52, 55, 59, 62], [48, 52, 55, 59]], // G7, Fmaj7, Em7, Cmaj7
      description: 'Drones planeadores y un éter gélido flotando por el espacio profundo sin límites.',
      isPopular: false,
      createdAt: '2026-05-18',
    },
    {
      id: 'tr-3',
      title: 'Lluvia en Neo-Seúl 2099',
      genre: 'Organic House',
      bpm: 90,
      energy: 4,
      intensity: 4,
      bassDepth: 6,
      ambientLevel: 7,
      synthPreset: 'warm-pad',
      chordProgression: [[57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65], [48, 52, 55, 59]], // Am7, Fmaj7, G7, Cmaj7
      description: 'Percusiones de madera orgánica, campanas y lluvia continua golpeando el neón.',
      isPopular: true,
      createdAt: '2026-05-25',
    },
    {
      id: 'tr-4',
      title: 'Grave Abismal (Abyssal Grave)',
      genre: 'Deep Techno',
      bpm: 95,
      energy: 3,
      intensity: 5,
      bassDepth: 9,
      ambientLevel: 4,
      synthPreset: 'deep-drone',
      chordProgression: [[48, 52, 55, 59], [50, 53, 57, 60], [45, 48, 52, 55], [43, 47, 50, 53]], // Cmaj7, Dm7, Am7, G7
      description: 'Presión subsónica, cajas reverberantes que simulan el latido de un búnker gigante de hormigón.',
      isPopular: false,
      createdAt: '2026-05-12',
    },
    {
      id: 'tr-5',
      title: 'Pasaje del Sol (Solar Passage)',
      genre: 'Melodic Techno',
      bpm: 114,
      energy: 5,
      intensity: 8,
      bassDepth: 7,
      ambientLevel: 3,
      synthPreset: 'plucky',
      chordProgression: [[52, 55, 59, 62], [48, 52, 55, 59], [53, 57, 60, 64], [57, 60, 64, 67]], // Em7, Cmaj7, Fmaj7, Am7
      description: 'Hermosos arpegios brillantes entrelazados con líneas pulsantes aceleradas.',
      isPopular: true,
      createdAt: '2026-05-28',
    },
    {
      id: 'tr-6',
      title: 'Soplo de Viento Zen (Zen Wind)',
      genre: 'Techno Chill',
      bpm: 80,
      energy: 1,
      intensity: 2,
      bassDepth: 4,
      ambientLevel: 8,
      synthPreset: 'warm-pad',
      chordProgression: [[57, 60, 64, 67], [52, 55, 59, 62], [53, 57, 60, 64], [55, 59, 62, 65]], // Am7, Em7, Fmaj7, G7
      description: 'Líquido, meditativo. Flautas sintetizadas y olas lejanas para máxima relajación.',
      isPopular: false,
      createdAt: '2026-05-30',
    },
  ]);

  // Listening Modes presets lists
  const listeningModes: ListeningMode[] = [
    {
      id: 'concentracion',
      name: 'Concentración Profunda',
      description: 'Bajos estables con oscilación sutil. Libre de distractores.',
      bpm: 90,
      intensity: 3,
      bassDepth: 8,
      ambientLevel: 4,
      energy: 2,
      synthPreset: 'warm-pad',
      ambientPresetVolumes: { space: 0.15 },
    },
    {
      id: 'estudio',
      name: 'Estudio Enfocado',
      description: 'Armonías ligeras a tempo moderado para potenciar el enfoque.',
      bpm: 85,
      intensity: 2,
      bassDepth: 4,
      ambientLevel: 5,
      energy: 2,
      synthPreset: 'warm-pad',
      ambientPresetVolumes: { coffee: 0.3 },
    },
    {
      id: 'programacion',
      name: 'Modo Programación',
      description: 'Sintetizadores pulsantes y rítmicos para entrar en estado de flujo.',
      bpm: 98,
      intensity: 6,
      bassDepth: 6,
      ambientLevel: 3,
      energy: 4,
      synthPreset: 'plucky',
      ambientPresetVolumes: { space: 0.2, rain: 0.25 },
    },
    {
      id: 'lectura',
      name: 'Lectura Relajante',
      description: 'Paisaje sonoro suave y envolvente para perderse en las páginas.',
      bpm: 80,
      intensity: 2,
      bassDepth: 3,
      ambientLevel: 6,
      energy: 1,
      synthPreset: 'cosmic',
      ambientPresetVolumes: { wind: 0.25, forest: 0.15 },
    },
    {
      id: 'meditacion',
      name: 'Meditación Zen',
      description: 'Osciladores lentos y drones expansivos de regeneración mental.',
      bpm: 65,
      intensity: 1,
      bassDepth: 5,
      ambientLevel: 8,
      energy: 1,
      synthPreset: 'deep-drone',
      ambientPresetVolumes: { waves: 0.65, forest: 0.35 },
    },
    {
      id: 'sueno',
      name: 'Sueño Profundo',
      description: 'Frecuencia delta simulada con crepitar de fogatas y olas tenues.',
      bpm: 60,
      intensity: 1,
      bassDepth: 2,
      ambientLevel: 9,
      energy: 1,
      synthPreset: 'deep-drone',
      ambientPresetVolumes: { fire: 0.45, waves: 0.4, rain: 0.15 },
    },
    {
      id: 'relajacion',
      name: 'Relajación Nocturna',
      description: 'Vibraciones calmadas y flotantes de baja distorsión armónica.',
      bpm: 75,
      intensity: 3,
      bassDepth: 5,
      ambientLevel: 6,
      energy: 2,
      synthPreset: 'cosmic',
      ambientPresetVolumes: { wind: 0.3, waves: 0.2 },
    },
    {
      id: 'viaje',
      name: 'Viaje Nocturno',
      description: 'Arpegios que fluyen como las luces del tráfico en una autopista.',
      bpm: 104,
      intensity: 5,
      bassDepth: 7,
      ambientLevel: 4,
      energy: 4,
      synthPreset: 'plucky',
      ambientPresetVolumes: { city: 0.45, train: 0.25 },
    },
    {
      id: 'lluvia_cyberpunk',
      name: 'Lluvia Cyberpunk',
      description: 'La melancolía de una metrópolis lluviosa y luces de neón parpadeantes.',
      bpm: 92,
      intensity: 4,
      bassDepth: 5,
      ambientLevel: 7,
      energy: 3,
      synthPreset: 'warm-pad',
      ambientPresetVolumes: { rain: 0.8, thunder: 0.35, city: 0.4 },
    },
    {
      id: 'espacio_profundo',
      name: 'Espacio Profundo',
      description: 'La inmensidad cósmica capturada en frecuencias gravitacionales.',
      bpm: 88,
      intensity: 2,
      bassDepth: 6,
      ambientLevel: 8,
      energy: 2,
      synthPreset: 'cosmic',
      ambientPresetVolumes: { space: 0.75, wind: 0.25 },
    },
    {
      id: 'creatividad',
      name: 'Creatividad Libre',
      description: 'Rítmica estimulante y brillante para ideas fuera de la caja.',
      bpm: 110,
      intensity: 7,
      bassDepth: 6,
      ambientLevel: 3,
      energy: 5,
      synthPreset: 'plucky',
      ambientPresetVolumes: { space: 0.25 },
    },
    {
      id: 'trabajo',
      name: 'Trabajo Productivo',
      description: 'Foco puro, constancia y energía dosificada con beats continuos.',
      bpm: 96,
      intensity: 5,
      bassDepth: 5,
      ambientLevel: 4,
      energy: 3,
      synthPreset: 'warm-pad',
      ambientPresetVolumes: { space: 0.15, rain: 0.1 },
    },
  ];

  // Continuous background listening time accumulation simulation
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setUserProfile((prev) => ({
          ...prev,
          listenedHours: prev.listenedHours + 0.005, // accumulate virtual time slowly
        }));
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Sync Firebase authentication updates with user session profiles
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Derive username from displayName or split email
        const derivedUsername = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
        setUserProfile((prev) => ({
          ...prev,
          username: derivedUsername,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  // Apply world configurations safely
  const selectWorldEnvironment = (world: any) => {
    setActiveWorldId(world.id);
    setCurrentAtmosphereTitle(`Cabina Mundo: ${world.name}`);
    
    // Sync to knobs & engine
    setCurrentBPM(world.bpmDefault);
    globalAudioEngine.setBPM(world.bpmDefault);
    setCurrentIntensity(world.intensityDefault);
    globalAudioEngine.setIntensity(world.intensityDefault);
    setCurrentBassDepth(world.bassDefault);
    globalAudioEngine.setBassDepth(world.bassDefault);
    
    if (world.synthPreset) {
      setCurrentSynthPreset(world.synthPreset);
      globalAudioEngine.setSynthPreset(world.synthPreset);
    }

    // Set world exclusive ambient sounds
    const nextAmbientSounds = ambientSounds.map((snd) => {
      const isExclusive = world.exclusiveAmbients.includes(snd.type);
      const targetVol = isExclusive ? 0.65 : 0;
      globalAudioEngine.setAmbientVolume(snd.type, isExclusive ? snd.volume : 0);
      return {
        ...snd,
        active: isExclusive,
      };
    });
    setAmbientSounds(nextAmbientSounds);
  };

  // Callback to apply suggested preset from IA Assistant, DJ companion, or playlist
  const applyPresetConfig = (preset: {
    bpm: number;
    intensity: number;
    ambientVolumes: Partial<Record<AmbientSoundType, number>>;
    synthPreset: string;
    title: string;
  }) => {
    setCurrentAtmosphereTitle(preset.title);

    // 1. Apply to knobs
    setCurrentBPM(preset.bpm);
    globalAudioEngine.setBPM(preset.bpm);

    setCurrentIntensity(preset.intensity);
    globalAudioEngine.setIntensity(preset.intensity);

    if (preset.synthPreset) {
      setCurrentSynthPreset(preset.synthPreset);
      globalAudioEngine.setSynthPreset(preset.synthPreset);
    }

    // 2. Reconstruct ambient volumes array
    const updatedSounds = ambientSounds.map((sound) => {
      if (preset.ambientVolumes && preset.ambientVolumes[sound.type] !== undefined) {
        const proposedVol = preset.ambientVolumes[sound.type] as number;
        const finalActive = proposedVol > 0.05;
        
        // Apply direct live adjustment to synth
        globalAudioEngine.setAmbientVolume(sound.type, finalActive ? proposedVol : 0);
        
        return {
          ...sound,
          volume: proposedVol,
          active: finalActive,
        };
      } else {
        globalAudioEngine.setAmbientVolume(sound.type, 0);
        return {
          ...sound,
          active: false,
        };
      }
    });

    setAmbientSounds(updatedSounds);
    setActiveModeId(''); // Reset preset buttons to custom model
  };

  // Turn pre-configured modes on upon click
  const selectMode = (mode: ListeningMode) => {
    setActiveModeId(mode.id);
    setCurrentAtmosphereTitle(`Canal: ${mode.name}`);

    // Update synthesis dials
    setCurrentBPM(mode.bpm);
    globalAudioEngine.setBPM(mode.bpm);

    setCurrentIntensity(mode.intensity);
    globalAudioEngine.setIntensity(mode.intensity);

    setCurrentBassDepth(mode.bassDepth);
    globalAudioEngine.setBassDepth(mode.bassDepth);

    setCurrentSynthPreset(mode.synthPreset);
    globalAudioEngine.setSynthPreset(mode.synthPreset);

    // Reconstruct mixer volumes (only specified sounds in preset are turned on with professional acoustic dampening of 0.55)
    const updated = ambientSounds.map((sound) => {
      const volumeSetting = mode.ambientPresetVolumes[sound.type];
      const isActive = volumeSetting !== undefined;
      const dampedVol = isActive ? Math.round((volumeSetting! * 0.55) * 100) / 100 : 0;
      
      // Send directly to synthesis engine
      globalAudioEngine.setAmbientVolume(sound.type, isActive ? dampedVol : 0);
      
      return {
        ...sound,
        active: isActive,
        volume: isActive ? dampedVol : sound.volume, // retain custom if muted
      };
    });

    setAmbientSounds(updated);
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      globalAudioEngine.stop();
      setIsPlaying(false);
    } else {
      globalAudioEngine.start();
      setIsPlaying(true);
      
      // Update actual current dials in engine upon boot
      globalAudioEngine.setBPM(currentBPM);
      globalAudioEngine.setIntensity(currentIntensity);
      globalAudioEngine.setBassDepth(currentBassDepth);
      globalAudioEngine.setSynthPreset(currentSynthPreset);

      // Sync active sound mixer volumes in audio instance
      ambientSounds.forEach((s) => {
        globalAudioEngine.setAmbientVolume(s.type, s.active ? s.volume : 0);
      });
    }
  };

  const [headerQuery, setHeaderQuery] = useState('');
  const handleHeaderQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headerQuery.trim()) return;
    setAiSearchTrigger(headerQuery);
    setHeaderQuery('');
    setActiveTab('dj'); // jump user to AI guide tab directly
  };

  const getActiveWorldInfo = () => {
    return worldsData.find((w) => w.id === activeWorldId) || worldsData[0];
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#050608] text-[#e2e8f0] font-sans flex flex-col md:flex-row overflow-hidden relative" id="app-root-container">
      
      {/* Mobile Sidebar Backdrop overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-25 md:hidden cursor-pointer" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* 1. LEFT SIDEBAR (TAB NAVIGATION DESIGN) */}
      <aside className={`
        fixed inset-y-0 left-0 bg-[#0a0b10] border-r border-[#1a1c23]/40 flex flex-col p-6 shrink-0 z-30 overflow-y-auto transition-transform duration-300 ease-in-out w-72
        md:relative md:w-64 md:translate-x-0 md:bg-[#0a0b10] md:border-b-0 md:border-r md:border-white/5 md:flex
        ${mobileMenuOpen ? 'translate-x-0 shadow-[20px_0_40px_rgba(0,0,0,0.8)]' : '-translate-x-full md:translate-x-0'}
      `} id="left-sidebar-sleek">
        
        {/* Brand Header Logo */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-fuchsia-600 shadow-[0_0_15px_rgba(34,211,238,0.3)] flex items-center justify-center">
              <Radio size={16} className="text-black stroke-[3]" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider text-white uppercase">
                DREAMSCAPE<span className="text-cyan-400">._</span>
              </h1>
              <p className="text-[9px] font-mono text-cyan-400/80 tracking-widest uppercase">UNIVERSE PLATFORM</p>
            </div>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tab Switching Groups */}
        <nav className="flex-1 space-y-7">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 mb-3.5 font-semibold font-mono">Cabina Clásica</p>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => { setActiveTab('radio'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 py-2 px-3.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    activeTab === 'radio'
                      ? 'bg-cyan-500/10 text-cyan-450 border-l-2 border-cyan-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                  id="tab-btn-radio"
                >
                  <Disc size={13} className={isPlaying && activeTab === 'radio' ? 'animate-spin-slow text-cyan-400' : ''} />
                  Radio Infinita 24/7
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('dj'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 py-2 px-3.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    activeTab === 'dj'
                      ? 'bg-cyan-500/10 text-cyan-450 border-l-2 border-cyan-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                  id="tab-btn-dj"
                >
                  <Sparkles size={13} className="text-purple-400" />
                  Personal AI DJ Booth
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 mb-3.5 font-semibold font-mono">Aventura Universo IA</p>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => { setActiveTab('universe'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 py-2 px-3.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    activeTab === 'universe'
                      ? 'bg-gradient-to-r from-purple-500/15 to-transparent text-purple-300 border-l-2 border-purple-500'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                  id="tab-btn-universe"
                >
                  <Compass size={13} className="text-purple-400" />
                  Dreamscape Worlds
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('studio'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 py-2 px-3.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    activeTab === 'studio'
                      ? 'bg-gradient-to-r from-purple-500/15 to-transparent text-purple-300 border-l-2 border-purple-500'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                  id="tab-btn-studio"
                >
                  <Cpu size={13} className="text-indigo-400" />
                  Estudio Musical Sequencer
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('live'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 py-2 px-3.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    activeTab === 'live'
                      ? 'bg-gradient-to-r from-purple-500/15 to-transparent text-purple-300 border-l-2 border-purple-500'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                  id="tab-btn-live"
                >
                  <Activity size={13} className="text-pink-400 animate-pulse" />
                  Festival Live Rooms
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('visual-engine'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 py-2 px-3.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    activeTab === 'visual-engine'
                      ? 'bg-gradient-to-r from-purple-500/15 to-transparent text-purple-300 border-l-2 border-purple-500'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                  id="tab-btn-visual-engine"
                >
                  <Tv size={13} className="text-[#ff007f]" />
                  Dreamscape Live TV
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 mb-3.5 font-semibold font-mono">Economía & Logros</p>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => { setActiveTab('coop'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 py-2 px-3.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    activeTab === 'coop'
                      ? 'bg-pink-500/10 text-pink-300 border-l-2 border-pink-500'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                  id="tab-btn-coop"
                >
                  <ShoppingBag size={13} className="text-pink-400" />
                  Co-op Sound Marketplace
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('challenges'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 py-2 px-3.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    activeTab === 'challenges'
                      ? 'bg-pink-500/10 text-pink-300 border-l-2 border-pink-500'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                  id="tab-btn-challenges"
                >
                  <Award size={13} className="text-yellow-400" />
                  Logros & Aventuras
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Global Immersive Trigger */}
        <div className="pt-4 pb-2 border-t border-white/5 space-y-2">
          <button
            onClick={() => setIsImmersionActive(true)}
            className="w-full py-2 bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-500 hover:to-indigo-600 text-black font-extrabold text-xs rounded-lg cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(34,211,238,0.15)] select-none transition-all"
            id="btn-sidebar-immersion"
          >
            <Maximize2 size={12} />
            MANDAR INMERSIÓN TOTAL
          </button>
        </div>

      </aside>

      {/* 2. MAIN HUB CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden" id="main-hub-panel">
        
        {/* TOP GLUING DASHBOARD HEADER */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 md:px-8 shrink-0 bg-[#0a0b10]/85 backdrop-blur-md z-10 animate-fade-in" id="sleek-header">
          
          <div className="flex items-center">
            {/* Mobile Hamburguer Toggle Button */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-slate-350 hover:text-white p-2 rounded-lg bg-white/[0.03] border border-white/5 shrink-0 mr-3 animate-pulse cursor-pointer flex items-center justify-center"
              id="mobile-drawer-toggle"
              aria-label="Abrir panel de control"
            >
              <Menu size={16} />
            </button>

            {/* Current Active Tab Breadcrumb label */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 bg-white/[0.02] border border-white/[0.04] py-1 px-3.5 rounded-full select-none">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span>
                {activeTab === 'radio' && 'Radio Infinita 24/7 Player'}
                {activeTab === 'universe' && 'Exploradora de Mundos Templarios'}
                {activeTab === 'studio' && 'Estadio de Secuencias Analógicas'}
                {activeTab === 'dj' && 'Asistente Virtual & Mentor AI'}
                {activeTab === 'live' && 'Multiplayer Live Arena'}
                {activeTab === 'coop' && 'Marketpace Regional de loops'}
                {activeTab === 'challenges' && 'Bitácora de Sintonizador'}
                {activeTab === 'visual-engine' && 'Dreamscape Live TV & Visual Engine'}
              </span>
            </div>
          </div>

          {/* Quick Describe Atmosphere Input */}
          <form onSubmit={handleHeaderQuerySubmit} className="hidden lg:flex items-center gap-3 max-w-sm flex-1 bg-white/[0.03] border border-white/5 px-4 py-1.5 rounded-full mx-6" id="header-search-form">
            <span className="text-slate-400 shrink-0">
              <Sparkles size={11.5} className="text-purple-400" />
            </span>
            <input
              type="text"
              placeholder="Ordena un ambiente (ej: Lluvia en búnker de Berlín)"
              value={headerQuery}
              onChange={(e) => setHeaderQuery(e.target.value)}
              className="text-xs bg-transparent border-none focus:outline-none placeholder-slate-505 text-white w-full font-sans"
            />
            <button type="submit" className="text-[9.5px] font-bold text-slate-400 hover:text-cyan-400 uppercase tracking-widest shrink-0">
              OK
            </button>
          </form>

          {/* Connected state tracker */}
          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 text-emerald-400 font-mono text-[10px] select-none">
              <span className="h-1 w-1 bg-emerald-400 rounded-full animate-ping mr-0.5" />
              <span>Satélite Enlazado</span>
            </div>

            {/* Profile cap */}
            <div className="flex items-center gap-2 select-none" id="header-profile">
              <div className="h-6 w-6 rounded-full bg-gradient-to-r from-cyan-400/30 to-purple-500/30 border border-white/10 flex items-center justify-center font-bold text-white text-[9.5px]">
                {userProfile.username.substring(0, 2).toUpperCase()}
              </div>
              <span className="hidden leading-none sm:block text-[10.5px] text-slate-400 font-sans font-medium">
                @{userProfile.username}
              </span>
              <div className="flex items-center gap-1 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 text-cyan-400 font-mono text-[8px] uppercase tracking-wider font-semibold">
                Acceso Libre
              </div>
            </div>
          </div>
        </header>

        {/* WORKSPACE AREA (TAB ENCAPSULATION COMPONENT) */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-6" id="dashboard-scrollable-workspace">
          
          {/* ACTIVE WORLD HEADER ATOM */}
          <div className="bg-gradient-to-r from-indigo-950/20 via-[#0a0b10] to-transparent p-4 sm:p-5 rounded-2xl border border-white/[0.03] flex flex-col md:flex-row justify-between items-start md:items-center gap-3 animate-fade-in" id="soundscape-status-ticker">
            <div>
              <p className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider">Mapeo del Sector Activo</p>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight mt-0.5 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-450 animate-pulse" />
                {currentAtmosphereTitle}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[9px] font-mono text-slate-500 uppercase">Giro Gravitacional</p>
                <p className="text-xs font-semibold text-slate-350 mt-0.5 font-sans">
                  {currentBPM} BPM · {currentSynthPreset.toUpperCase()} Presets
                </p>
              </div>
              <button 
                onClick={() => setIsImmersionActive(true)}
                className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] border border-white/5 text-cyan-400 hover:text-cyan-300 transition-colors flex items-center justify-center cursor-pointer"
                title="Maximizar cabina"
              >
                <Maximize2 size={13} />
              </button>
            </div>
          </div>

          {/* ACTIVE ROUTED SYSTEM PANEL CONTAINER */}
          <div className="space-y-6" id="system-route-container">
            
            {/* 2.1 RADIO INFINITA DEFAULT ACTIVE TAB */}
            {activeTab === 'radio' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="radio-system-tab-group">
                {/* Visualizer + primary buttons cards */}
                <div className="lg:col-span-7 flex flex-col space-y-6">
                  
                  {/* MAIN PLAYER BOX */}
                  <div className="bg-[#0a0b10] border border-white/5 rounded-2xl p-5 space-y-5" id="cabina-player-card">
                    <div className="flex justify-between items-center bg-black/60 p-4 rounded-xl border border-white/[0.03]">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2.5 rounded-lg ${isPlaying ? 'bg-cyan-500/10 text-cyan-400 animate-pulse' : 'bg-white/[0.02] text-slate-500'}`}>
                          <Disc size={18} className={isPlaying ? 'animate-spin-slow' : ''} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-mono text-[8.5px] text-slate-500 tracking-wider uppercase">Sintonía Directa</p>
                          <h3 className="font-sans font-semibold text-slate-200 text-sm truncate">{currentAtmosphereTitle}</h3>
                        </div>
                      </div>

                      <button
                        onClick={handlePlayToggle}
                        className={`py-2 px-5 rounded-xl text-xs font-sans font-bold tracking-wide uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                          isPlaying
                            ? 'bg-red-500/10 border border-red-500/25 text-red-400'
                            : 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-black shadow-lg shadow-cyan-400/10'
                        }`}
                        id="btn-play-pause-radio"
                      >
                        {isPlaying ? <Pause size={11} fill="currentColor" /> : <Play size={11} fill="currentColor" />}
                        {isPlaying ? 'Detener' : 'Sintonizar'}
                      </button>
                    </div>

                    {/* DYNAMIC FREQUENCY CANVASES */}
                    <div className="h-60 relative rounded-xl overflow-hidden border border-white/[0.03] bg-[#050608]" id="visualizer-wrapper">
                      <AudioVisualizer mode={visualizerMode} />
                      
                      {/* Pattern selectors */}
                      <div className="absolute bottom-3 right-4 bg-black/95 py-1 px-2.5 rounded-lg border border-white/5 flex items-center gap-2">
                        <span className="font-mono text-[9px] text-slate-500 uppercase">Patrón:</span>
                        <div className="flex gap-1">
                          {(['Cyberpunk', 'Espacial', 'Minimalista', 'Abstracto'] as const).map((m) => (
                            <button
                              key={m}
                              onClick={() => setVisualizerMode(m)}
                              className={`text-[9.5px] px-2 py-0.5 rounded transition-all cursor-pointer ${
                                visualizerMode === m
                                  ? 'bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20'
                                  : 'text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Parameter Sliders list */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5" id="audio-tuning-sliders">
                      <div className="bg-black/40 p-3 rounded-lg border border-white/[0.02] space-y-1.5">
                        <div className="flex justify-between items-center text-xs text-slate-350">
                          <span className="font-mono text-[9px] text-slate-500">VELOCIDAD TEMPO</span>
                          <span className="font-mono text-cyan-400 text-xs font-bold">{currentBPM} BPM</span>
                        </div>
                        <input
                          type="range"
                          min="60"
                          max="140"
                          value={currentBPM}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setCurrentBPM(val);
                            globalAudioEngine.setBPM(val);
                          }}
                          className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                          id="bpm-synthesizer-slider"
                        />
                      </div>

                      <div className="bg-black/40 p-3 rounded-lg border border-white/[0.02] space-y-1.5">
                        <div className="flex justify-between items-center text-xs text-slate-350">
                          <span className="font-mono text-[9px] text-slate-500">INTENSIDAD IA</span>
                          <span className="font-mono text-fuchsia-400 text-xs font-bold">{currentIntensity} / 10</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={currentIntensity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setCurrentIntensity(val);
                            globalAudioEngine.setIntensity(val);
                          }}
                          className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-fuchsia-400"
                          id="intensity-synthesizer-slider"
                        />
                      </div>

                      <div className="bg-black/40 p-3 rounded-lg border border-white/[0.02] space-y-1.5">
                        <div className="flex justify-between items-center text-xs text-slate-350">
                          <span className="font-mono text-[9px] text-slate-500">SUB-GRAVES</span>
                          <span className="font-mono text-indigo-400 text-xs font-bold">{currentBassDepth} / 10</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={currentBassDepth}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setCurrentBassDepth(val);
                            globalAudioEngine.setBassDepth(val);
                          }}
                          className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                          id="bass-depth-slider"
                        />
                      </div>
                    </div>

                    {/* Classic Preset list inside player directly */}
                    <div className="space-y-2.5 pt-1" id="presets-modes-block">
                      <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold">
                        Estaciones Sintonizadoras Rápidas:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left" id="modes-presets-list">
                        {listeningModes.slice(0, 8).map((mode) => (
                          <button
                            key={mode.id}
                            onClick={() => selectMode(mode)}
                            className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer text-xs relative ${
                              activeModeId === mode.id
                                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                                : 'bg-black/50 border-white/[0.02] text-slate-400 hover:text-white'
                            }`}
                            id={`mode-btn-${mode.id}`}
                          >
                            <span className="font-sans font-bold block">{mode.name}</span>
                            {activeModeId === mode.id && (
                              <span className="absolute top-1.5 right-1.5 flex h-1 w-1 bg-cyan-400 rounded-full" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Climate slider controls */}
                  <MixerPanel ambientSounds={ambientSounds} setAmbientSounds={setAmbientSounds} />
                  
                  {/* Biofeedback Telemetry sub-form inside the bottom of Classical deck! */}
                  <BioFeedback 
                    onUpdateBPM={(bpm) => {
                      setCurrentBPM(bpm);
                      globalAudioEngine.setBPM(bpm);
                    }}
                    onUpdateIntensity={(intensity) => {
                      setCurrentIntensity(intensity);
                      globalAudioEngine.setIntensity(intensity);
                    }}
                  />
                </div>

                {/* Right col: Guides & automatic DJ options */}
                <div className="lg:col-span-5 flex flex-col space-y-6">
                  {/* Prompt celestial assistant */}
                  <AIAssistant 
                    onApplyPreset={applyPresetConfig} 
                    ambientSounds={ambientSounds}
                    aiSearchTrigger={aiSearchTrigger}
                    setAiSearchTrigger={setAiSearchTrigger}
                  />

                  {/* Auto-DJ sliders card */}
                  <DJMode
                    currentBPM={currentBPM}
                    setCurrentBPM={setCurrentBPM}
                    currentIntensity={currentIntensity}
                    setCurrentIntensity={setCurrentIntensity}
                  />

                  {/* History and save slots */}
                  <HistoryAndFavorites
                    tracks={tracks}
                    setTracks={setTracks}
                    favorites={userProfile.favorites}
                    setFavorites={(newFavs: any) =>
                      setUserProfile({ ...userProfile, favorites: typeof newFavs === 'function' ? newFavs(userProfile.favorites) : newFavs })
                    }
                    ambientSounds={ambientSounds}
                    setAmbientSounds={setAmbientSounds}
                    onApplyPreset={applyPresetConfig}
                    currentBPM={currentBPM}
                  />
                </div>
              </div>
            )}

            {/* 2.2 THE DREAMSCAPE UNIVERSE EXPLORER MAP */}
            {activeTab === 'universe' && (
              <div className="space-y-6 animate-fade-in" id="universe-system-tab-group">
                <DreamscapeUniverse 
                  userProfile={userProfile} 
                  activeWorldId={activeWorldId} 
                  onSelectWorld={selectWorldEnvironment} 
                />
                
                {/* Mini instruction cards to provide visual depth */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-1">
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full" />
                      Acerca del Mapeo de Sintonizadores
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      Al penetrar orbitalmente en un planeta, tu cabina se calibra automáticamente con el tempo (BPM) y las muestras sonoras exclusivas correspondientes. Esto genera una variación rítmica infinita en tu reproductor.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-1">
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 bg-purple-500 rounded-full" />
                      Exploración Multidimensional
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      Todos los mundos y frecuencias de la galaxia están completamente desbloqueados y listos para sincronizar libremente en tiempo real.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2.3 ESTUDIO MUSICAL SEQUENCER PATTERNS */}
            {activeTab === 'studio' && (
              <div className="animate-fade-in" id="studio-system-tab-group">
                <AudioStudio />
              </div>
            )}

            {/* 2.4 PERSONAL AI DJ WORKSPACE */}
            {activeTab === 'dj' && (
              <div className="animate-fade-in" id="dj-companion-system-tab-group">
                <DjAssistant 
                  onApplyRecommendation={(rec) => {
                    applyPresetConfig({
                      bpm: rec.bpm,
                      intensity: rec.intensity,
                      synthPreset: rec.genre === 'Dub Techno' ? 'deep-drone' : rec.genre === 'Organic House' ? 'warm-pad' : 'cosmic',
                      ambientVolumes: rec.genre === 'Dub Techno' ? { city: 0.5, rain: 0.4 } : { waves: 0.6, forest: 0.3 },
                      title: `Frecuencia Recomendada: ${rec.title}`
                    });
                    setActiveTab('radio'); // bounce back user to play instantly
                  }} 
                />
              </div>
            )}

            {/* 2.5 FESTIVAL LIVE CONCERTS WORKSPACE */}
            {activeTab === 'live' && (
              <div className="animate-fade-in" id="live-system-tab-group">
                <GlobalLiveEvents />
              </div>
            )}

            {/* 2.6 DIGITAL CO-OP SOUND MARKETPLACE */}
            {activeTab === 'coop' && (
              <div className="animate-fade-in" id="coop-system-tab-group">
                <Marketplace />
              </div>
            )}

            {/* 2.7 ACHIEVEMENTS AND CHALLENGES TRACKER */}
            {activeTab === 'challenges' && (
              <div className="animate-fade-in" id="challenges-system-tab-group">
                <GamifiedSintonizer />
              </div>
            )}

            {/* 2.8 REVOLUTIONARY LIVE VISUAL ENGINE */}
            {activeTab === 'visual-engine' && (
              <div className="animate-fade-in" id="visual-engine-tab-group">
                <LiveVisualEngine 
                  currentBPM={currentBPM}
                  currentIntensity={currentIntensity}
                  currentBassDepth={currentBassDepth}
                  activeWorldId={activeWorldId}
                  currentSynthPreset={currentSynthPreset}
                  activeModeId={activeModeId}
                  userProfile={userProfile}
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  setCurrentBPM={setCurrentBPM}
                  setCurrentIntensity={setCurrentIntensity}
                  setCurrentBassDepth={setCurrentBassDepth}
                  setCurrentSynthPreset={setCurrentSynthPreset}
                  ambientSounds={ambientSounds}
                  setAmbientSounds={setAmbientSounds}
                />
              </div>
            )}

          </div>

          {/* FOOTER STATS INFO */}
          <footer className="mt-12 border-t border-white/5 pt-5 text-center text-[9.5px] text-slate-600 font-mono" id="app-footer">
            SISTEMA INTEGRADO DE RADIO PROCEDURAL Y UNIVERSO EXPORABLE "DREAMSCAPE UNIVERSE" · EMISIÓN CONTINUA 24/7 EN DIRECTO DESDE SATÉLITES QUANTUM S-44
          </footer>
        </div>
      </div>

      {/* FULLSCREEN TOTAL IMMERSION LAYER PORTAL */}
      {isImmersionActive && (
        <TotalImmersion 
          onClose={() => setIsImmersionActive(false)}
          activeWorldName={getActiveWorldInfo().name}
          activeWorldColor={getActiveWorldInfo().color}
          ambientLevel={75}
          onUpdateAmbientLevel={(newVol) => {
            // direct sync to all active layers
            ambientSounds.forEach((snd) => {
              if (snd.active) {
                globalAudioEngine.setAmbientVolume(snd.type, newVol / 100);
              }
            });
          }}
        />
      )}

    </div>
    </AuthGuard>
  );
}
