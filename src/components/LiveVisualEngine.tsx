import React, { useState, useEffect, useRef } from 'react';
import { globalAudioEngine } from '../audioEngine';
import { AmbientSound } from '../types';
import { 
  Tv, 
  Sparkles, 
  Play, 
  Tv2, 
  Sparkle, 
  Compass, 
  Wind, 
  CloudRain, 
  Zap, 
  Waves, 
  Cloud, 
  Image as ImageIcon, 
  Monitor, 
  Video, 
  Palette, 
  Share2, 
  Flame, 
  Sliders, 
  RefreshCw,
  Clock,
  Heart,
  Cpu,
  MonitorCheck,
  Send,
  MessageSquare,
  Users
} from 'lucide-react';

interface LiveVisualEngineProps {
  currentBPM: number;
  currentIntensity: number;
  currentBassDepth: number;
  activeWorldId: string;
  currentSynthPreset: string;
  activeModeId: string;
  userProfile: any;
  isPlaying?: boolean;
  setIsPlaying?: (v: boolean) => void;
  setCurrentBPM?: (bpm: number) => void;
  setCurrentIntensity?: (intensity: number) => void;
  setCurrentBassDepth?: (depth: number) => void;
  setCurrentSynthPreset?: (preset: string) => void;
  ambientSounds?: AmbientSound[];
  setAmbientSounds?: React.Dispatch<React.SetStateAction<AmbientSound[]>>;
}

// Visual TVs Definition
interface VisualTV {
  id: string;
  name: string;
  description: string;
  theme: 'neon' | 'cosmic' | 'ocean' | 'mountain' | 'future';
  compatibleGenres: string[];
  primaryColor: string;
  secondaryColor: string;
}

const VISUAL_TVS: VisualTV[] = [
  {
    id: 'neon-rain',
    name: 'Neon Rain TV',
    description: 'Ciudades de neón futuristas, calles mojadas y trenes nocturnos envueltos en lluvia.',
    theme: 'neon',
    compatibleGenres: ['Deep Techno', 'Melodic Techno', 'Chill Techno'],
    primaryColor: '#ff007f', // pink
    secondaryColor: '#00f0ff', // cyan
  },
  {
    id: 'cosmic-journey',
    name: 'Cosmic Journey TV',
    description: 'Nebulosas profundas, galaxias remotas, viajes interestelares y agujeros de gusano.',
    theme: 'cosmic',
    compatibleGenres: ['Ambient Techno', 'Space Ambient', 'Deep Atmospheric'],
    primaryColor: '#3b82f6', // blue
    secondaryColor: '#a855f7', // purple
  },
  {
    id: 'ocean-dreams',
    name: 'Ocean Dreams TV',
    description: 'Arrecifes de coral luminiscentes, islas flotantes y atardeceres holográficos en el mar.',
    theme: 'ocean',
    compatibleGenres: ['Organic House', 'Chill House', 'Ambient'],
    primaryColor: '#06b6d4', // cyan
    secondaryColor: '#34d399', // green
  },
  {
    id: 'mountain-echo',
    name: 'Mountain Echo TV',
    description: 'Bosques templados cibernéticos, niebla volumétrica y amaneceres andinos.',
    theme: 'mountain',
    compatibleGenres: ['Downtempo', 'Organic', 'Ambient'],
    primaryColor: '#10b981', // emerald
    secondaryColor: '#f59e0b', // amber
  },
  {
    id: 'future-earth',
    name: 'Future Earth TV',
    description: 'Arquitectura bioclimática híbrida, megaciudades flotantes y transporte autónomo.',
    theme: 'future',
    compatibleGenres: ['Melodic Techno', 'Progressive', 'Deep Techno'],
    primaryColor: '#6366f1', // indigo
    secondaryColor: '#ec4899', // pink
  }
];

// Live Chat Message definition
interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  badge?: string;
  badgeColor?: string;
  userColor: string;
}

// 24/7 Channels definition
interface VisualStreamChannel {
  id: string;
  name: string;
  tvId: string;
  currentViewerCount: number;
  resolution: string;
  bpm: number;
  intensity: number;
  bassDepth: number;
  synthPreset: string;
  ambientPresetVolumes: Partial<Record<string, number>>;
}

const STREAMS_247: VisualStreamChannel[] = [
  {
    id: 'cyber-city-live',
    name: 'Cyberpunk City Live',
    tvId: 'neon-rain',
    currentViewerCount: 1240,
    resolution: '8K',
    bpm: 120,
    intensity: 8,
    bassDepth: 8,
    synthPreset: 'plucky',
    ambientPresetVolumes: { city: 0.6, rain: 0.4 },
  },
  {
    id: 'tokyo-rain-live',
    name: 'Tokyo Rain Live',
    tvId: 'neon-rain',
    currentViewerCount: 948,
    resolution: '4K',
    bpm: 88,
    intensity: 4,
    bassDepth: 7,
    synthPreset: 'warm-pad',
    ambientPresetVolumes: { rain: 0.8, train: 0.4 },
  },
  {
    id: 'space-station-live',
    name: 'Space Station Live',
    tvId: 'cosmic-journey',
    currentViewerCount: 512,
    resolution: '8K',
    bpm: 105,
    intensity: 2,
    bassDepth: 5,
    synthPreset: 'cosmic',
    ambientPresetVolumes: { space: 0.75, wind: 0.2 },
  },
  {
    id: 'cosmic-obs-live',
    name: 'Cosmic Observatory Live',
    tvId: 'cosmic-journey',
    currentViewerCount: 730,
    resolution: '4K',
    bpm: 90,
    intensity: 3,
    bassDepth: 6,
    synthPreset: 'cosmic',
    ambientPresetVolumes: { space: 0.8, wind: 0.3 },
  },
  {
    id: 'neon-highway-live',
    name: 'Neon Highway Live',
    tvId: 'future-earth',
    currentViewerCount: 1640,
    resolution: '8K',
    bpm: 118,
    intensity: 9,
    bassDepth: 8,
    synthPreset: 'plucky',
    ambientPresetVolumes: { city: 0.5, thunder: 0.2 },
  },
  {
    id: 'future-metrop-live',
    name: 'Future Metropolis Live',
    tvId: 'future-earth',
    currentViewerCount: 890,
    resolution: '4K',
    bpm: 122,
    intensity: 7,
    bassDepth: 7,
    synthPreset: 'plucky',
    ambientPresetVolumes: { city: 0.4, space: 0.3 },
  },
  {
    id: 'alien-ocean-live',
    name: 'Alien Ocean Live',
    tvId: 'ocean-dreams',
    currentViewerCount: 1105,
    resolution: '8K',
    bpm: 96,
    intensity: 5,
    bassDepth: 6,
    synthPreset: 'cosmic',
    ambientPresetVolumes: { waves: 0.7, wind: 0.2 },
  },
  {
    id: 'deep-space-telesc',
    name: 'Deep Space Telescope Live',
    tvId: 'cosmic-journey',
    currentViewerCount: 384,
    resolution: '4K',
    bpm: 65,
    intensity: 1,
    bassDepth: 8,
    synthPreset: 'deep-drone',
    ambientPresetVolumes: { space: 0.9, wind: 0.1 },
  },
];

// Narrative stages for Dreamscape Cinema
interface CinemaScene {
  title: string;
  description: string;
  durationSeconds: number;
  environmentType: 'city' | 'transit' | 'station' | 'exploration' | 'sunrise';
}

const CINEMA_PLAYLIST: CinemaScene[] = [
  { title: 'Sector Metrópolis Neo-Cenit', description: 'La aventura visual inicia arrastrándose por rascacielos monolíticos y túneles húmedos de neón.', durationSeconds: 15, environmentType: 'city' },
  { title: 'Tránsito Expreso Nocturno', description: 'Atravesando valles de silicio y ríos cibernéticos a bordo de un tren electromagnético supersónico.', durationSeconds: 20, environmentType: 'transit' },
  { title: 'Estación Orbital Alfa-IX', description: 'Acoplamiento a la base de lanzamiento criogénica, rodeado por transportes interestelares en órbita.', durationSeconds: 20, environmentType: 'station' },
  { title: 'Exploración Superficie Proxima-B', description: 'Vuelo rasante sobre valles de magma frío e islas magnéticas flotando con anillos celestiales.', durationSeconds: 25, environmentType: 'exploration' },
  { title: 'Amanecer Dual Cuántico', description: 'Las dos estrellas del sistema coronan el horizonte estepario iluminando flujos electromagnéticos.', durationSeconds: 20, environmentType: 'sunrise' }
];

export const LiveVisualEngine: React.FC<LiveVisualEngineProps> = ({
  currentBPM,
  currentIntensity,
  currentBassDepth,
  activeWorldId,
  currentSynthPreset,
  activeModeId,
  userProfile,
  isPlaying,
  setIsPlaying,
  setCurrentBPM,
  setCurrentIntensity,
  setCurrentBassDepth,
  setCurrentSynthPreset,
  ambientSounds,
  setAmbientSounds
}) => {
  // General State Nodes
  const [selectedTvId, setSelectedTvId] = useState<string>('neon-rain');
  const [activeStreamId, setActiveStreamId] = useState<string>('cyber-city-live');
  const [cinemaModeActive, setCinemaModeActive] = useState<boolean>(false);
  const [cinemaSceneIndex, setCinemaSceneIndex] = useState<number>(0);
  const [cinemaProgress, setCinemaProgress] = useState<number>(0); // 0-100%
  const [isFullscreenActive, setIsFullscreenActive] = useState<boolean>(false);

  // Listen for Escape key to exit fullscreen fallback safely
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreenActive) {
        setIsFullscreenActive(false);
        if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenActive]);

  const toggleFullscreen = () => {
    const nextState = !isFullscreenActive;
    setIsFullscreenActive(nextState);

    const card = document.getElementById('primary-screen-view-card');
    if (card) {
      if (nextState) {
        if (card.requestFullscreen) {
          card.requestFullscreen().catch(() => {});
        } else if ((card as any).webkitRequestFullscreen) {
          (card as any).webkitRequestFullscreen();
        }
      } else {
        if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        }
      }
    }
  };
  
  // Second screen simulation state
  const [isCasting, setIsCasting] = useState<boolean>(false);
  const [castDevice, setCastDevice] = useState<string>('Smart TV Hogar - 4K');
  const [castResolution, setCastResolution] = useState<string>('144Hz HDR');

  // Cover generation State Node (unique to each session)
  const [coverTitle, setCoverTitle] = useState<string>('Frecuencia Cuántica V-1');
  const [coverDesc, setCoverDesc] = useState<string>('Síntesis adaptativa con moduladores espectrales y ruidos rítmicos analógicos.');
  const [coverSeed, setCoverSeed] = useState<number>(12045);
  const [isRegeneratingCover, setIsRegeneratingCover] = useState<boolean>(false);

  // Live Chat State Nodes
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'Cyber_Samurai_88', text: '¡Este canal está salvaje! Esos sintetizadores pegan fuerte.', timestamp: '17:34', badge: 'DJ', userColor: 'text-cyan-400', badgeColor: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-bold border' },
    { id: '2', user: 'Atari_Vibe', text: '¿Alguien más escuchando en el sector Aurora Nexus? 🌌✨', timestamp: '17:35', badge: 'VIP', userColor: 'text-pink-500', badgeColor: 'bg-pink-500/10 border-pink-500/30 text-pink-400 font-bold border' },
    { id: '3', user: 'Sector_9_Resident', text: 'La ambientación de lluvia es idónea para programar esta noche.', timestamp: '17:35', badge: 'OYENTE', userColor: 'text-purple-450', badgeColor: 'bg-purple-500/10 border-purple-500/30 text-purple-400 font-bold border' },
    { id: '4', user: 'Nova_Seeker', text: 'La latencia de transmisión está bajísima en el satélite enlazado.', timestamp: '17:36', badge: 'SYS', userColor: 'text-emerald-400', badgeColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold border' }
  ]);
  const [chatUser, setChatUser] = useState<string>('Astral_Listener');
  const [isEditingUsername, setIsEditingUsername] = useState<boolean>(false);
  const [tempUsername, setTempUsername] = useState<string>('');
  const [chatInputText, setChatInputText] = useState<string>('');
  const [isAutoSimulate, setIsAutoSimulate] = useState<boolean>(true);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto Scroll Chat container ONLY
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Handle Edit Username
  const handleEditUsername = () => {
    setTempUsername(chatUser);
    setIsEditingUsername(true);
  };

  const handleSaveUsername = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUsername.trim()) {
      setChatUser(tempUsername.trim().replace(/\s+/g, '_'));
    }
    setIsEditingUsername(false);
  };

  // Submit manual chat message
  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        user: chatUser,
        text: chatInputText.trim(),
        timestamp: timeStr,
        badge: 'OYENTE',
        badgeColor: 'bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold',
        userColor: 'text-violet-400 font-semibold'
      }
    ].slice(-50));

    setChatInputText('');
  };

  // Real-time peer simulations to make stream feel live of other users chatting
  useEffect(() => {
    if (!isAutoSimulate) return;

    const interval = setInterval(() => {
      const usersList = [
        { name: 'Kenshiro_X', color: 'text-cyan-400', badge: 'PRO', badgeColor: 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold text-[8.5px]' },
        { name: 'Nebula_Girl', color: 'text-pink-400', badge: 'VIP', badgeColor: 'bg-pink-500/10 border border-pink-500/20 text-pink-400 font-bold text-[8.5px]' },
        { name: 'Zero_Cool', color: 'text-indigo-400', badge: 'MOD', badgeColor: 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-[8.5px]' },
        { name: 'Lofi_Space_Cadet', color: 'text-amber-400', badge: 'CHILL', badgeColor: 'bg-amber-500/10 border border-amber-500/20 text-amber-405 font-bold text-[8.5px]' },
        { name: 'VoidWalker_9', color: 'text-purple-400', badge: 'LOYAL', badgeColor: 'bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold text-[8.5px]' },
        { name: 'Synth_Slayer', color: 'text-rose-450', badge: 'CREW', badgeColor: 'bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-[8.5px]' },
        { name: 'Hacker_Man_80', color: 'text-emerald-450', badge: 'SYS', badgeColor: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[8.5px]' }
      ];

      const randomUser = usersList[Math.floor(Math.random() * usersList.length)];

      let messagesPool = [
        '¡Vaya vibes tiene esta estación! Totalmente recomendado.',
        'Me encanta la animación de partículas interactiva cuando cambia de tempo.',
        'Saludos desde el sector de sintonía procedural. 🚀',
        'El reproductor modular de audio es una genialidad absoluta.',
        'Sintonizado 24/7 de forma impecable desde mi terminal táctil.',
        '¿Alguien más disfrutando de la inmersión total?'
      ];

      if (activeStreamId.includes('cyber-city') || activeStreamId.includes('neon-highway')) {
        messagesPool = [
          'Me encanta el estilo visual cyberpunk de este canal.',
          'Sintetizador plucky y ciudad cyber es la mejor combinación posible.',
          `Es increíble cómo reacciona el visualizador con el BPM a ${currentBPM}!`,
          'Este beat plucky cyberpunk es puro combustible para codear.',
          '¡Digan lo que quieran, pero la señal de satélite 8K se ve brutal!',
          'Neon Highway tiene esa atmósfera Retro-Future insuperable.'
        ];
      } else if (activeStreamId.includes('space-station') || activeStreamId.includes('cosmic-obs') || activeStreamId.includes('space-station-live')) {
        messagesPool = [
          'Qué paz transmite el éter espacial con este preset cósmico.',
          'Viajando por el cinturón de asteroides con esta onda expansiva de sintetizador.',
          'El nivel de bruma cósmica con las partículas lentas parece un sueño real.',
          'Ideal para ponerse los cascos, apagar la luz y simplemente flotar.',
          'Sintonizando directamente desde la órbita terrestre. 🌌',
          'Un oasis instrumental cósmico de primer nivel.'
        ];
      } else if (activeStreamId.includes('tokyo-rain') || activeStreamId.includes('neon-rain')) {
        messagesPool = [
          'La tormenta de Tokio nocturna en el mezclador es lo más relajante del mundo.',
          `Este preset warm-pad a ${currentBPM} BPM es una melodía majestuosa.`,
          'Llueve en Tokio, llueve en mi habitación... Vaya viaje.',
          'Combine la lluvia con el tren nocturno en el climatizador, ¡pruébenlo!',
          'Perfecto para calmar la mente después de un largo día de trabajo.',
          'Esta señal satelital 4K capta el misticismo nocturno lluvioso a la perfección.'
        ];
      } else if (activeStreamId.includes('alien-ocean') || activeStreamId.includes('ocean-dreams')) {
        messagesPool = [
          'Los visuales oceánicos alienígenas expanden mi conciencia.',
          'Suban los graves a 8/10, ¡las vibraciones profundas de la marea son impresionantes!',
          '¿Música oceánica procedural? Sí, por favor.',
          'Qué visualizador tan hipnótico para este planeta líquido.',
          'Atravesando tempestades oceánicas extraterrestres con mi sintonizador modular.',
          'La combinación con el sonido ambiental de oleaje es maravillosa.'
        ];
      } else if (activeStreamId.includes('deep-space')) {
        messagesPool = [
          `BPM ultra bajo a ${currentBPM}, el dron espacial definitivo.`,
          'Sintonía minimalista y profunda. Ideal para meditar.',
          'Este preset deep-drone llega al fondo de mi cerebro.',
          'Telescopio de espacio profundo conectado en directo.',
          'Una sintonía misteriosa, cósmica y extremadamente inmersiva.'
        ];
      }

      const randomText = messagesPool[Math.floor(Math.random() * messagesPool.length)];
      
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setChatMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + Math.random()),
          user: randomUser.name,
          text: randomText,
          timestamp: timeStr,
          badge: randomUser.badge,
          badgeColor: randomUser.badgeColor,
          userColor: randomUser.color
        }
      ].slice(-55));
    }, 9000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, [isAutoSimulate, activeStreamId, currentBPM]);

  // Canvas context reference pointers
  const liveCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const coverCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Sincronización feedback values of AI director
  const [visualCoherence, setVisualCoherence] = useState<number>(98);
  const [particleDensity, setParticleDensity] = useState<number>(250);
  const [fogLevel, setFogLevel] = useState<number>(30);
  const [energyPulse, setEnergyPulse] = useState<number>(0.5);

  const activeTV = VISUAL_TVS.find((tv) => tv.id === selectedTvId) || VISUAL_TVS[0];

  // 1. Generate Cover when seed changes or parameters update
  useEffect(() => {
    generateDynamicCover();
  }, [coverSeed, selectedTvId, activeWorldId]);

  const generateDynamicCover = () => {
    const canvas = coverCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsRegeneratingCover(true);
    
    // Pick color keys
    const pColor = activeTV.primaryColor;
    const sColor = activeTV.secondaryColor;

    // Background gradient
    const grad = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 10,
      canvas.width / 2, canvas.height / 2, canvas.width
    );
    grad.addColorStop(0, '#11131e');
    grad.addColorStop(0.5, '#07080f');
    grad.addColorStop(1, '#020204');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Procedural lines
    ctx.strokeStyle = pColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const midY = canvas.height / 2;
    for (let x = 0; x < canvas.width; x += 3) {
      const angle = (x / canvas.width) * Math.PI * 4 + coverSeed;
      const waveVal = Math.sin(angle) * 35 + Math.cos(angle * 2.5) * 15;
      const y = midY + waveVal;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Geometric rings in background
    ctx.strokeStyle = `${sColor}22`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 50 + (coverSeed % 100), 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `${pColor}11`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 80 + (coverSeed % 80), 0, Math.PI * 2);
    ctx.stroke();

    // Spawn cyber triangles/grid
    ctx.fillStyle = `${sColor}18`;
    for (let i = 0; i < 6; i++) {
      const size = 15 + (i * 8);
      const angle = i * 0.4 + coverSeed;
      const x = canvas.width / 2 + Math.cos(angle) * 40;
      const y = canvas.height / 2 + Math.sin(angle) * 40;
      ctx.fillRect(x, y, size, size);
    }

    // High fidelity overlay text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px "Space Grotesk", sans-serif';
    ctx.fillText(`SESSION_SEED: ${coverSeed}`, 15, canvas.height - 35);
    ctx.fillStyle = `${sColor}`;
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText(`DREAMSCAPE SPECTRAL ART // CH:${selectedTvId.toUpperCase()}`, 15, canvas.height - 15);

    // Update names & descriptions matching mood
    const titles = [
      'Aluvión Electromagnético', 'Cúmulo Estelar Sintético', 'Reflejo en Asfalto Mojado',
      'Cascada Gravitacional Delta', 'Corriente de Neón Profundo', 'Isla Suspendida B-42'
    ];
    const descs = [
      'Síntesis adaptativa con moduladores espectrales, ruidos rítmicos binarios y resonancias espaciales.',
      'Sinfonía etérea guiada por drones cósmicos de baja frecuencia y vientos interestelares.',
      'Ritmos hipnóticos combinados con lluvia analógica procedural golpeando metales mojados.',
      'Flujo ondulante orgánico sintonizado con el núcleo armónico del satélite receptor.',
    ];

    setTimeout(() => {
      setCoverTitle(titles[coverSeed % titles.length]);
      setCoverDesc(descs[coverSeed % descs.length]);
      setIsRegeneratingCover(false);
    }, 400);
  };

  const rollNewSessionCover = () => {
    setCoverSeed(Math.floor(Math.random() * 90000) + 10000);
  };

  // 2. Cinema Mode Narrative cycle
  useEffect(() => {
    let cinemaInterval: any = null;
    if (cinemaModeActive) {
      cinemaInterval = setInterval(() => {
        setCinemaProgress((progress) => {
          if (progress >= 100) {
            // Next scene transition
            setCinemaSceneIndex((idx) => (idx + 1) % CINEMA_PLAYLIST.length);
            return 0;
          }
          return progress + 2.5; // increment progress
        });
      }, 500);
    } else {
      setCinemaProgress(0);
    }
    return () => {
      if (cinemaInterval) clearInterval(cinemaInterval);
    };
  }, [cinemaModeActive, cinemaSceneIndex]);

  // Sync TV Channel when stream changes
  const select247Stream = (channel: VisualStreamChannel) => {
    setActiveStreamId(channel.id);
    setSelectedTvId(channel.tvId);

    // Auto-trigger playback when tuning into a live 24/7 stream
    if (!globalAudioEngine.isPlaying()) {
      globalAudioEngine.start();
      if (setIsPlaying) {
        setIsPlaying(true);
      }
    }

    // Adapt musical environment parameters (synth tempo, energy, and weather layers)
    if (setCurrentBPM) {
      setCurrentBPM(channel.bpm);
      globalAudioEngine.setBPM(channel.bpm);
    }
    if (setCurrentIntensity) {
      setCurrentIntensity(channel.intensity);
      globalAudioEngine.setIntensity(channel.intensity);
    }
    if (setCurrentBassDepth) {
      setCurrentBassDepth(channel.bassDepth);
      globalAudioEngine.setBassDepth(channel.bassDepth);
    }
    if (setCurrentSynthPreset) {
      setCurrentSynthPreset(channel.synthPreset);
      globalAudioEngine.setSynthPreset(channel.synthPreset);
    }

    if (ambientSounds && setAmbientSounds) {
      const updated = ambientSounds.map((sound) => {
        const targetVol = channel.ambientPresetVolumes[sound.type];
        const isActive = targetVol !== undefined;
        // Apply balanced dampening multiplier of 0.6 to channel presets
        const dampedVol = isActive ? Math.round((targetVol * 0.6) * 100) / 100 : 0;
        
        globalAudioEngine.setAmbientVolume(sound.type, isActive ? dampedVol : 0);
        
        return {
          ...sound,
          active: isActive,
          volume: isActive ? dampedVol : sound.volume,
        };
      });
      setAmbientSounds(updated);
    }
  };

  // 3. Main Live Visual Engine Rendering on canvas
  useEffect(() => {
    const canvas = liveCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high fidelity responsive resize
    const handleVisualResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 900;
      canvas.height = canvas.parentElement?.clientHeight || 450;
    };
    handleVisualResize();
    const obs = new ResizeObserver(handleVisualResize);
    if (canvas.parentElement) {
      obs.observe(canvas.parentElement);
    }

    // Dynamic procedural particles
    const localParticles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      alpha: number;
      color: string;
    }> = [];

    const spawnParticles = (amount: number, theme: string) => {
      for (let i = 0; i < amount; i++) {
        const colorPick = theme === 'neon' ? (Math.random() > 0.5 ? '#ff007f' : '#00f0ff')
                       : theme === 'cosmic' ? (Math.random() > 0.5 ? '#3b82f6' : '#a855f7')
                       : theme === 'ocean' ? (Math.random() > 0.5 ? '#06b6d4' : '#34d399')
                       : theme === 'mountain' ? (Math.random() > 0.5 ? '#10b981' : '#f59e0b')
                       : '#6366f1';
        localParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2.2 + 0.5,
          speedY: (Math.random() * 0.4 + 0.1) * (theme === 'neon' ? 4 : 1), // Rain is faster
          speedX: (Math.random() * 0.2 - 0.1) + (theme === 'neon' ? -1.5 : 0), // rain falls diagonally
          alpha: Math.random() * 0.7 + 0.2,
          color: colorPick,
        });
      }
    };

    spawnParticles(150, activeTV.theme);

    // Render loop
    let lastRenderProgress = 0;
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const themeVal = activeTV.theme;
      const pColor = activeTV.primaryColor;
      const sColor = activeTV.secondaryColor;

      // Audio data analysis
      const analyser = globalAudioEngine.getAnalyser();
      let audioVolumeNormalized = 0.3; // Default visualizer bounce if paused
      let bassPurity = 0.3;

      if (analyser && globalAudioEngine.isPlaying()) {
        const dataArr = new Uint8Array(128);
        analyser.getByteFrequencyData(dataArr);
        let sum = 0;
        let bassSum = 0;
        for (let i = 0; i < 128; i++) {
          sum += dataArr[i];
          if (i < 15) bassSum += dataArr[i];
        }
        audioVolumeNormalized = sum / (128 * 255);
        bassPurity = Math.max(0.1, bassSum / (15 * 255));
      } else {
        // Soft wave bounce when audio is stopped
        audioVolumeNormalized = 0.2 + Math.sin(Date.now() * 0.001) * 0.08;
        bassPurity = 0.15 + Math.cos(Date.now() * 0.002) * 0.07;
      }

      // Update AI director telemetry
      const pulseCoherency = 92 + Math.floor(audioVolumeNormalized * 12) - (currentBPM % 5);
      setVisualCoherence(Math.min(100, Math.max(85, pulseCoherency)));
      setParticleDensity(localParticles.length);
      setFogLevel(Math.floor(20 + bassPurity * 45));
      setEnergyPulse(parseFloat(audioVolumeNormalized.toFixed(2)));

      // Clear Canvas styled by active TV theme
      if (themeVal === 'neon') {
        ctx.fillStyle = 'rgba(5, 5, 10, 0.20)'; // deep ink
      } else if (themeVal === 'cosmic') {
        ctx.fillStyle = 'rgba(2, 2, 6, 0.18)'; // stellar void
      } else if (themeVal === 'ocean') {
        ctx.fillStyle = 'rgba(2, 8, 12, 0.22)'; // underwater
      } else if (themeVal === 'mountain') {
        ctx.fillStyle = 'rgba(3, 8, 6, 0.18)'; // mossy
      } else {
        ctx.fillStyle = 'rgba(6, 4, 12, 0.15)'; // futuristic tower
      }
      ctx.fillRect(0, 0, w, h);

      // --- PROCEDURAL THEMED SCENERY DRAWING (Exclusive per stream!) ---

      if (themeVal === 'neon' || (cinemaModeActive && CINEMA_PLAYLIST[cinemaSceneIndex].environmentType === 'city')) {
        // Neon Cities skyscrapers backdrops
        ctx.strokeStyle = `${sColor}08`;
        ctx.lineWidth = 1;
        const widthStep = w / 12;
        
        // Background grid wireframe
        for (let i = 0; i < w; i += widthStep) {
          ctx.beginPath();
          ctx.moveTo(i, h);
          ctx.lineTo(w / 2 + (i - w / 2) * 0.4, h - 180);
          ctx.stroke();
        }

        // Draw neon outline blocks (buildings) reacting to bass beats!
        ctx.fillStyle = 'rgba(5, 5, 8, 0.9)';
        ctx.strokeStyle = `${pColor}25`;
        ctx.lineWidth = 1.5;

        // Draw 6 large buildings
        for (let i = 0; i < 6; i++) {
          const bW = w * 0.12;
          const bH = h * 0.42 + Math.sin(i * 1.5 + Date.now() * 0.0015) * 20 + (bassPurity * 50);
          const bX = w * 0.1 + i * (w * 0.15) - 30;
          ctx.fillRect(bX, h - bH, bW, bH);
          ctx.strokeRect(bX, h - bH, bW, bH);

          // Draw lights inside windows
          ctx.fillStyle = i % 2 === 0 ? `${sColor}44` : `${pColor}33`;
          for (let wy = h - bH + 20; wy < h - 10; wy += 25) {
            for (let wx = bX + 10; wx < bX + bW - 10; wx += bW / 4) {
              if (Math.sin(wx + wy + Date.now() * 0.002) > 0.2) {
                ctx.fillRect(wx, wy, 4, 6);
              }
            }
          }
          ctx.fillStyle = 'rgba(5, 5, 8, 0.9)';
        }

        // Ambient lightning strikes!
        if (bassPurity > 0.65 && Math.random() > 0.88) {
          ctx.fillStyle = 'rgba(255,255,255,0.18)';
          ctx.fillRect(0,0,w,h);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(Math.random() * w, 0);
          ctx.lineTo(w * 0.4, h * 0.25);
          ctx.lineTo(w * 0.5, h * 0.5);
          ctx.stroke();
        }

      } else if (themeVal === 'cosmic' || (cinemaModeActive && (CINEMA_PLAYLIST[cinemaSceneIndex].environmentType === 'station' || CINEMA_PLAYLIST[cinemaSceneIndex].environmentType === 'sunrise'))) {
        // Ambient Galactic swirling Nebula
        const centerX = w / 2;
        const centerY = h / 2;
        const gradientNebula = ctx.createRadialGradient(
          centerX, centerY, 5,
          centerX, centerY, Math.min(w, h) * 0.6
        );
        gradientNebula.addColorStop(0, `${sColor}2a`);
        gradientNebula.addColorStop(0.5, `${pColor}0d`);
        gradientNebula.addColorStop(1, 'transparent');
        ctx.fillStyle = gradientNebula;
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.min(w, h) * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // High frequency space dust concentric rings
        ctx.strokeStyle = `${pColor}12`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 80 + (audioVolumeNormalized * 130), 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `${sColor}0e`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 150 + (bassPurity * 80), 0, Math.PI * 2);
        ctx.stroke();

        // Pulsating center star/black hole
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 30;
        ctx.shadowColor = sColor;
        ctx.beginPath();
        const coreR = 8 + (audioVolumeNormalized * 22);
        ctx.arc(centerX, centerY, coreR, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset

      } else if (themeVal === 'ocean' || (cinemaModeActive && CINEMA_PLAYLIST[cinemaSceneIndex].environmentType === 'exploration')) {
        // Glowing ocean waves rolling in standard physics
        ctx.strokeStyle = `${sColor}90`;
        ctx.lineWidth = 2.5;

        // Draw multiple stacked translucent wave lines
        for (let j = 0; j < 3; j++) {
          ctx.beginPath();
          ctx.fillStyle = `${sColor}04`;
          const baseWaveH = h - 110 - j * 30;
          for (let x = 0; x < w; x += 10) {
            const phase = Date.now() * 0.0018 + j * 12;
            const waveY = baseWaveH + Math.sin(x * 0.006 + phase) * 20 * (1 + audioVolumeNormalized * 1.5)
                        + Math.cos(x * 0.012 + phase * 0.5) * 8;
            if (x === 0) ctx.moveTo(x, waveY);
            else ctx.lineTo(x, waveY);
          }
          ctx.lineTo(w, h);
          ctx.lineTo(0, h);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();
        }

        // Drawing a neon sunset sun in backgrounds
        const sunG = ctx.createRadialGradient(w/2, h - 180, 5, w/2, h - 180, 110);
        sunG.addColorStop(0, `${pColor}cc`);
        sunG.addColorStop(0.6, `${pColor}20`);
        sunG.addColorStop(1, 'transparent');
        ctx.fillStyle = sunG;
        ctx.beginPath();
        ctx.arc(w/2, h - 180, 110, 0, Math.PI * 2);
        ctx.fill();

      } else {
        // Future Earth and mountain: beautiful rolling geometry hills
        ctx.fillStyle = 'rgba(7,7,12,0.95)';
        ctx.strokeStyle = `${pColor}40`;
        ctx.lineWidth = 1.8;

        for (let j = 0; j < 2; j++) {
          ctx.beginPath();
          const baseH = h - 90 - j * 45;
          for (let x = 0; x < w; x += 15) {
            const hVal = Math.sin(x * 0.005 + j) * 45 + Math.cos(x * 0.015) * 15;
            const y = baseH - hVal - (bassPurity * (15 - j * 10));
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.lineTo(w, h);
          ctx.lineTo(0, h);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();
        }
      }

      // --- RENDER RE-ACTING PARTICLES ---
      ctx.fillStyle = sColor;
      localParticles.forEach((p) => {
        // Particle moves
        p.y += p.speedY * (1.0 + audioVolumeNormalized * 5.0);
        p.x += p.speedX;

        // Warp bounds
        if (p.y > h) {
          p.y = 0;
          p.x = Math.random() * w;
        }
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        const pSize = p.size * (1.0 + bassPurity * 1.5);
        ctx.arc(p.x, p.y, pSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // --- DRAW 4K/8K SCREEN LINES OVERLAY ---
      ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
      for (let y = 0; y < h; y += 4) {
        ctx.fillRect(0, y, w, 1);
      }

      // Render cinema current scene overlays if active
      if (cinemaModeActive) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(15, 15, w - 30, 40);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        const activeScene = CINEMA_PLAYLIST[cinemaSceneIndex];
        ctx.fillText(`CINEMA MODE ACTIVO: ${activeScene.title.toUpperCase()}`, 30, 32);
        
        ctx.fillStyle = `${pColor}`;
        ctx.fillRect(15, 52, (w - 30) * (cinemaProgress / 100), 3);
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      obs.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [selectedTvId, cinemaModeActive, cinemaSceneIndex, cinemaProgress, activeTV, currentBPM]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="live-visual-engine-dashboard">
      
      {/* LEFT COLUMN: Main Screen View Panel */}
      <div className="xl:col-span-8 flex flex-col space-y-6">
        
        <div className={`bg-[#0a0b10] border border-white/5 rounded-2xl p-5 space-y-4 relative ${
          isFullscreenActive ? 'fixed inset-0 z-50 bg-[#020205] p-8 flex flex-col justify-between' : ''
        }`} id="primary-screen-view-card">
          
          <div className="flex justify-between items-center bg-black/40 p-3 py-2.5 rounded-xl border border-white/[0.02]">
            <div className="flex items-center gap-2">
              <Tv size={15} className="text-cyan-400 rotate-2" />
              <div>
                <p className="font-mono text-[8.5px] text-slate-500 uppercase">STREAM ACTIVO</p>
                <h4 className="font-sans font-bold text-slate-200 text-xs">
                  {cinemaModeActive ? `Dreamscape Cinema / ${CINEMA_PLAYLIST[cinemaSceneIndex].title}` : `${activeTV.name} (${activeStreamId.toUpperCase()})`}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-ping" />
              <span className="font-mono text-[9px] text-[#ff007f] font-semibold uppercase tracking-wider">LIVE FEED</span>
              
              <button 
                onClick={toggleFullscreen}
                className="ml-2 py-1 px-3 bg-white/[0.04] text-slate-400 hover:text-white border border-white/5 hover:bg-white/[0.08] transition-colors rounded text-[10px] font-semibold cursor-pointer"
              >
                {isFullscreenActive ? 'Salir Pantalla Completa' : 'Modo Cine Fullscreen'}
              </button>
            </div>
          </div>

          {/* MAIN GENERATIVE CANVAS SCREEN + INTEGRATED SIDE-BY-SIDE CHAT */}
          <div className={`grid grid-cols-1 ${isFullscreenActive ? "" : "lg:grid-cols-12"} gap-4`} id="stream-and-chat-combined-row">
            
            {/* Left: Interactive Live Player */}
            <div className={`${isFullscreenActive ? "w-full flex-1" : "lg:col-span-8"} relative bg-black/90 rounded-xl overflow-hidden border border-white/[0.03] flex items-center justify-center h-96 ${isFullscreenActive ? "min-h-[50vh] my-4" : ""}`} id="canvas-wrapper-visual">
              <canvas ref={liveCanvasRef} className="absolute inset-0 w-full h-full block" id="canvas-live-visual-engine" />
              
              {/* Cinematic simulated resolution badge */}
              <div className="absolute bottom-4 left-4 bg-black/90 border border-white/5 py-1 px-2 rounded-lg font-mono text-[9px] text-slate-400">
                SIMULACIÓN ULTRA_HD: {activeStreamId.includes('live-8k') || activeStreamId.includes('city-live') ? '8K VISTA' : '4K VISTA'} · FLUIDEZ REACTIVA
              </div>

              {/* Smart Tv casting status overlay in case casting mode is active */}
              {isCasting && (
                <div className="absolute top-4 right-4 bg-cyan-950/90 border border-cyan-800/40 py-1.5 px-3 rounded-full flex items-center gap-2 font-sans text-[10px] text-cyan-300 animate-pulse">
                  <MonitorCheck size={11.5} />
                  <span>Transmitiendo en: {castDevice} ({castResolution})</span>
                </div>
              )}
              
              {/* Ambient vignette lines */}
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.85)]" />
            </div>

            {/* Right: Integrated Stellar Live Chat (strictly embedded next to screen) */}
            {!isFullscreenActive && (
              <div className="lg:col-span-4 bg-slate-950/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between h-96 space-y-3 min-h-0 overflow-hidden" id="streams-live-chat-card">
                <div className="flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={13} className="text-cyan-400" />
                    <div>
                      <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Chat Estelar</h4>
                      <p className="text-[8px] text-slate-550 font-mono tracking-wider uppercase">Frecuencia en Vivo</p>
                    </div>
                  </div>

                  {/* Simulated listener indicator */}
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-cyan-950/30 border border-cyan-500/10 text-cyan-400 font-mono text-[8.5px]">
                    <Users size={9} />
                    <span>{isAutoSimulate ? '4.1K' : '1'} ON</span>
                  </div>
                </div>

                {/* Username config */}
                <div className="relative shrink-0">
                  {isEditingUsername ? (
                    <form onSubmit={handleSaveUsername} className="flex gap-1.5 items-center bg-slate-950/80 p-1 rounded-lg border border-white/5">
                      <input 
                        type="text" 
                        value={tempUsername} 
                        onChange={(e) => setTempUsername(e.target.value)} 
                        className="bg-transparent border-none text-[10px] text-white focus:outline-none focus:ring-0 p-0 font-mono w-full px-1"
                        placeholder="Nuevo alias..."
                        maxLength={18}
                        autoFocus
                      />
                      <button type="submit" className="text-[8.5px] bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 px-2 py-0.5 rounded cursor-pointer font-bold duration-300 hover:bg-cyan-500/30">Guardar</button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between bg-slate-950/50 px-2.5 py-1.5 rounded-lg border border-white/[0.03] text-[9.5px] text-slate-400 font-mono">
                      <span className="truncate">Conectado: <strong className="text-cyan-400 font-bold">@{chatUser}</strong></span>
                      <button onClick={handleEditUsername} className="text-cyan-405 hover:text-cyan-300 font-bold ml-1.5 underline cursor-pointer shrink-0">Editar</button>
                    </div>
                  )}
                </div>

                {/* Messages List Area */}
                <div ref={chatContainerRef} className="bg-black/45 rounded-lg border border-white/[0.02] p-2.5 flex-1 overflow-y-auto flex flex-col space-y-1.5 scrollbar-thin scrollbar-thumb-white/5 min-h-0" id="chat-messages-container">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="flex flex-col space-y-0.5 text-[10px] leading-relaxed border-b border-white/[0.01] pb-1.5 last:border-b-0">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-[7.5px] font-mono text-slate-550">{msg.timestamp}</span>
                        {msg.badge && (
                          <span className={`px-1 rounded text-[7px] uppercase border scale-95 origin-left ${msg.badgeColor}`}>
                            {msg.badge}
                          </span>
                        )}
                        <span className={`font-mono font-bold text-[9.5px] ${msg.userColor}`}>
                          {msg.user}
                        </span>
                      </div>
                      <p className="text-slate-300 font-sans break-words pl-0.5 leading-normal">{msg.text}</p>
                    </div>
                  ))}
                </div>

                {/* New message input */}
                <form onSubmit={sendChatMessage} className="flex gap-1.5 shrink-0">
                  <input 
                    type="text" 
                    value={chatInputText} 
                    onChange={(e) => setChatInputText(e.target.value)} 
                    placeholder="Escribe un mensaje..." 
                    className="flex-1 bg-slate-950 border border-white/5 text-[10px] text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500/35 font-sans placeholder-slate-600 block min-w-0"
                    maxLength={110}
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1.5 bg-cyan-750/20 hover:bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:border-cyan-400/45 rounded-lg cursor-pointer duration-300 flex items-center justify-center shrink-0"
                    id="btn-chat-send"
                  >
                    <Send size={10} />
                  </button>
                </form>

                {/* Toggle for simulated listener activity */}
                <div className="flex justify-between items-center text-[8px] font-mono text-slate-550 shrink-0">
                  <span>TRÁFICO DE OYENTES:</span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAutoSimulate}
                      onChange={() => setIsAutoSimulate(!isAutoSimulate)}
                      className="sr-only peer"
                      id="auto-simulation-toggle"
                    />
                    <div className="w-6 h-3.5 bg-slate-950 border border-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2.5px] after:left-[2px] after:bg-slate-605 after:rounded-full after:h-2 after:w-2 after:transition-all peer-checked:bg-cyan-500/20 peer-checked:after:bg-cyan-400" />
                  </label>
                </div>
              </div>
            )}
            
          </div>

          {/* QUICK COMPACT 24/7 TUNER (Closer to stream, easier/faster switching) */}
          <div className="border-t border-b border-white/[0.03] py-3.5 space-y-2 mt-1" id="quick-tuner-container">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-cyan-405 font-bold tracking-widest flex items-center gap-1.5">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                </span>
                Sintonizador Rápido de Canales 24/7:
              </span>
              <span className="text-[8px] font-mono text-slate-550 uppercase tracking-wider">Cambio instantáneo sin desplazamiento</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2" id="quick-streams-grid">
              {STREAMS_247.map((stream) => {
                const streamCompatibleTV = VISUAL_TVS.find((tv) => tv.id === stream.tvId);
                const isActive = activeStreamId === stream.id;
                
                return (
                  <button
                    key={stream.id}
                    onClick={() => select247Stream(stream)}
                    className={`text-left p-2 rounded-lg border transition-all duration-300 cursor-pointer flex flex-col relative overflow-hidden min-w-0 ${
                      isActive 
                        ? 'bg-cyan-950/20 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.12)] text-white' 
                        : 'bg-black/35 border-white/5 text-slate-400 hover:border-white/15 hover:bg-black/50 hover:text-slate-205'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full min-w-0 gap-1.5">
                      <span className="text-[10px] font-sans font-bold truncate">
                        {stream.name.replace(' Live', '')}
                      </span>
                      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />}
                    </div>
                    <div className="flex items-center justify-between text-[8px] font-mono text-slate-550 w-full mt-1">
                      <span className="truncate">{stream.bpm} BPM</span>
                      <span className="truncate uppercase font-bold" style={{ color: streamCompatibleTV?.primaryColor }}>
                        {streamCompatibleTV?.theme}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Screen control widgets */}
          <div className="flex flex-wrap gap-3.5 items-center justify-between pt-1">
            <div className="flex items-center gap-2 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-white/[0.02]">
              <Video size={13} className="text-purple-400" />
              <span className="text-[11px] text-slate-400">Modo Narrativo Cinema:</span>
              <button
                onClick={() => {
                  setCinemaModeActive(!cinemaModeActive);
                  setCinemaSceneIndex(0);
                }}
                className={`text-[9.5px] font-bold py-1 px-2.5 rounded transition-all cursor-pointer ${
                  cinemaModeActive 
                    ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30' 
                    : 'bg-white/[0.02] text-slate-550 hover:bg-white/[0.04]'
                }`}
              >
                {cinemaModeActive ? 'Desactivar Cinema' : 'Activar Cinema'}
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-mono text-slate-500"> streams de canal: </span>
              {VISUAL_TVS.map((tv) => (
                <button
                  key={tv.id}
                  onClick={() => {
                    setSelectedTvId(tv.id);
                    setCinemaModeActive(false); // break cinema if manual channel selected
                  }}
                  className={`text-[10px] font-sans font-medium py-1 px-2.5 rounded-lg border transition-all cursor-pointer ${
                    selectedTvId === tv.id 
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' 
                      : 'bg-black/50 border-white/[0.02] text-slate-400 hover:text-white'
                  }`}
                >
                  {tv.name}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* REVOLUTIONARY COVER GENERATOR CARD (REAL-TIME SEED PERSISTENCE) */}
        <div className="bg-[#0a0b10] border border-white/5 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-12 gap-5" id="cover-art-generator-card">
          <div className="md:col-span-3 flex flex-col items-center">
            
            {/* The Cover Art canvas target */}
            <div className="w-32 h-32 relative bg-black/80 rounded-xl overflow-hidden border border-white/10 shadow-lg" id="cover-canvas-container">
              <canvas ref={coverCanvasRef} width={128} height={128} className="absolute inset-0 block w-full h-full" id="canvas-cover-art" />
              {isRegeneratingCover && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <RefreshCw size={18} className="text-cyan-400 animate-spin" />
                </div>
              )}
            </div>

            <button
              onClick={rollNewSessionCover}
              className="mt-3.5 py-1 px-4 text-[9.5px] text-slate-400 hover:text-white hover:bg-white/[0.03] border border-white/5 transition-all text-center rounded-lg uppercase tracking-wider cursor-pointer"
            >
              Generar Arte Diferente
            </button>
          </div>

          <div className="md:col-span-9 flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[9.5px] font-mono text-cyan-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                  <Sparkle size={10.5} /> Sintonía Única de Portada
                </span>
                <span className="h-1.5 w-1.5 bg-pink-500 rounded-full animate-pulse" />
              </div>

              <h4 className="text-sm font-bold text-white tracking-tight">{coverTitle}</h4>
              <p className="text-[11px] text-slate-405 leading-relaxed font-sans">{coverDesc}</p>
            </div>

            <div className="pt-2 border-t border-white/[0.03] flex items-center justify-between text-[9px] font-mono text-slate-500">
              <span>SATELLITE SEED: {coverSeed} // GENERADA POR IA EN TIEMPO REAL</span>
              <span>COMPATIBILIDAD AUDIO COHERENTE: 100%</span>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Interactive Control & Cast panels */}
      <div className="xl:col-span-4 flex flex-col space-y-6">
        
        {/* PANEL 1: ART DIRECTOR CO-PILOT (AI REAL-TIME CORRELATIONS) */}
        <div className="bg-[#0a0b10] border border-white/5 rounded-2xl p-5 flex flex-col space-y-4" id="art-director-co-pilot-card">
          <div className="flex items-center gap-2.5">
            <Cpu size={15} className="text-purple-400" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Dreamscape Visual Director</h4>
              <p className="text-[9.5px] text-slate-500 font-mono">DIRECTOR DE ARTE IA ACTIVO</p>
            </div>
          </div>

          <div className="bg-black/60 p-3.5 rounded-xl border border-white/[0.03] space-y-2 font-mono text-[10px]">
            <div className="flex justify-between items-center text-slate-400">
              <span>Estado Coherencia:</span>
              <span className="text-emerald-450 font-bold">{visualCoherence}% (Óptima)</span>
            </div>
            
            <div className="flex justify-between items-center text-slate-400">
              <span>Paleta del Sector:</span>
              <span className="text-cyan-450 uppercase relative pl-3">
                <span className="h-1.5 w-1.5 rounded-full absolute left-0 top-[3px]" style={{ backgroundColor: activeTV.primaryColor }} />
                {activeTV.theme} tone ({activeTV.primaryColor})
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-400">
              <span>Densidad Partículas:</span>
              <span className="text-[#ff007f]">{particleDensity} sprites / seg</span>
            </div>

            <div className="flex justify-between items-center text-slate-400">
              <span>Nivel Bruma Atmosférica:</span>
              <span className="text-slate-200">{fogLevel}% sweep depth</span>
            </div>

            <div className="flex justify-between items-center text-slate-400">
              <span>Frecuencia Pulso Bajo:</span>
              <span className="text-indigo-400">{(energyPulse * 10).toFixed(1)} / 10 RMS</span>
            </div>
          </div>

          <div className="space-y-1.5 p-3 bg-purple-950/20 rounded-xl border border-purple-900/30">
            <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest block font-semibold">Consejo del Director Visual:</span>
            <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">
              &quot;Sintonizando la intensidad a {currentIntensity}/10 se expanderá automáticamente el flujo del oleaje dinámico de partículas. Intenta cambiar a {activeTV.compatibleGenres[0]} para fusionar ritmos y colores perfectamente.&quot;
            </p>
          </div>
        </div>

        {/* PANEL 2: STREAMS 24/7 (STATION PERMANENT CHANNELS) */}
        <div className="bg-[#0a0b10] border border-white/5 rounded-2xl p-5 flex flex-col space-y-3" id="streams-channels-247-card">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Streams Continuos 24/7</h4>
              <p className="text-[8px] text-slate-500 font-mono tracking-widest">SINTONIZADOR SECUNDARIO DE RESPALDO</p>
            </div>
            <span className="text-[8px] font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-500/10 px-1.5 py-0.5 rounded font-bold">MULTICANAL</span>
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-[380px] overflow-y-auto pr-1" id="streams-247-grid">
            {STREAMS_247.map((stream) => {
              const streamCompatibleTV = VISUAL_TVS.find((tv) => tv.id === stream.tvId);
              const isActive = activeStreamId === stream.id;
              
              // Select seed text for appropriate high-quality illustration based on tv id
              const imgSeedName = stream.id.replace('-live', '').replace('deep-space-', '');
              const imgUrl = `https://picsum.photos/seed/${imgSeedName}/120/95`;

              return (
                <button
                  key={stream.id}
                  onClick={() => select247Stream(stream)}
                  className={`w-full text-left transition-all duration-300 rounded-lg border overflow-hidden cursor-pointer group flex items-stretch relative min-h-[52px] ${
                    isActive
                      ? 'border-cyan-500 bg-cyan-950/10 shadow-[0_0_15px_rgba(6,182,212,0.12)] text-white'
                      : 'border-white/5 bg-slate-950/45 text-slate-400 hover:border-white/10 hover:bg-slate-900/60'
                  }`}
                >
                  {/* Miniature CRT/CCTV Feed Image on Left - extremely compact */}
                  <div className="w-14 shrink-0 relative overflow-hidden bg-black/40">
                    <img 
                      src={imgUrl} 
                      alt={stream.name} 
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
                  </div>

                  {/* Channel Description Body on Right */}
                  <div className="p-2 px-3 flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex justify-between items-center gap-1">
                      <span className="font-sans font-bold text-[10.5px] block truncate text-slate-205 group-hover:text-white transition-colors">
                        {stream.name}
                      </span>
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isActive ? 'bg-cyan-400 animate-ping' : 'opacity-40 bg-slate-500'}`} style={{ backgroundColor: isActive ? undefined : streamCompatibleTV?.primaryColor }} />
                    </div>
                    
                    <div className="flex items-center justify-between text-[8px] font-mono mt-0.5">
                      <span className="text-slate-500 truncate mr-1">TEMA: <strong style={{ color: streamCompatibleTV?.primaryColor }}>{streamCompatibleTV?.theme.toUpperCase()}</strong></span>
                      <span className="text-cyan-405 font-bold shrink-0">{stream.bpm} BPM</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>



        {/* PANEL 4: CASTING SECOND SCREEN (MOCK PROJECTION INTEGRATION) */}
        <div className="bg-[#0a0b10] border border-white/5 rounded-2xl p-5 flex flex-col space-y-4" id="casting-second-screen-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor size={14} className="text-pink-500" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Segunda Pantalla</h4>
                <p className="text-[9px] text-slate-500 font-mono">CAST A TV / PROYECTOR EXTERNO</p>
              </div>
            </div>

            {/* Simulated Toggle */}
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isCasting}
                onChange={() => setIsCasting(!isCasting)}
                className="sr-only peer"
                id="casting-active-toggle"
              />
              <div className="w-8 h-4.5 bg-slate-900 border border-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-slate-500 after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-pink-500/20 peer-checked:after:bg-pink-500" />
            </label>
          </div>

          <p className="text-[10.5px] text-slate-450 leading-relaxed font-sans mt-1">
            Transmita de forma inalámbrica y directa todos los visuales interactivos HD 4K a su Smart TV local o Chromecast en tiempo real. La música continuará sonando directamente en su dispositivo principal.
          </p>

          {isCasting && (
            <div className="p-3 bg-slate-950/80 rounded-xl border border-white/[0.02] space-y-2 font-mono text-[9px] text-slate-450 animate-fade-in" id="casting-config-deck">
              <div className="flex justify-between items-center">
                <span>Dispositivo Receptor:</span>
                <select 
                  value={castDevice} 
                  onChange={(e) => setCastDevice(e.target.value)} 
                  className="bg-transparent border-none text-white focus:outline-none focus:ring-0 text-[10px] font-sans font-bold text-right py-0 block"
                >
                  <option value="Smart TV Hogar - 4K" className="bg-[#0a0b10] text-white">Smart TV Hogar - 4K</option>
                  <option value="Chromecast Dormitorio" className="bg-[#0a0b10] text-white">Chromecast Dormitorio</option>
                  <option value="Apple TV Salón" className="bg-[#0a0b10] text-white">Apple TV Salón</option>
                  <option value="Proyector Modular Delta" className="bg-[#0a0b10] text-white">Proyector Modular Delta</option>
                </select>
              </div>

              <div className="flex justify-between items-center font-mono">
                <span>Sincronización FPS / Latencia:</span>
                <span className="text-cyan-405 font-bold">144Hz HDR // 4ms latency</span>
              </div>

              <div className="flex justify-between items-center font-mono">
                <span>Dirección IP Enlace:</span>
                <span className="text-slate-400">192.168.1.44:3000/tv</span>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
