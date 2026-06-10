import React, { useState } from 'react';
import { 
  Globe, 
  Lock, 
  Unlock, 
  Sparkles, 
  Volume2, 
  BookOpen, 
  Calendar, 
  Compass, 
  Zap, 
  CloudRain, 
  Sunset
} from 'lucide-react';
import { AmbientSoundType, UserProfile } from '../types';

export interface World {
  id: string;
  name: string;
  genre: string;
  associatedGenre: 'Ambient Techno' | 'Deep Techno' | 'Melodic Techno' | 'Organic House' | 'Dub Techno';
  description: string;
  atmosphereDescription: string;
  lore: string;
  requiredHours: number;
  bpmDefault: number;
  intensityDefault: number;
  bassDefault: number;
  synthPreset: string;
  color: string;
  glow: string;
  gradient: string;
  exclusiveAmbients: AmbientSoundType[];
  eventTitle: string;
  eventTime: string;
}

export const worldsData: World[] = [
  {
    id: 'nebula-prime',
    name: 'Nebula Prime',
    genre: 'Ambient Techno',
    associatedGenre: 'Ambient Techno',
    description: 'Estación de éter profundo flotando sobre nebulosas purpúreas y estrellas gigantes.',
    atmosphereDescription: 'Viento interestelar modulado y ecos distantes de resonancias de plasma.',
    lore: 'Ubicada en el sector orbital S-82, Nebula Prime recoge flujos magnéticos estelares que se traducen en sintetizadores cósmicos lineales. Las flautas espaciales cantan la quietud del cosmos vacío.',
    requiredHours: 0,
    bpmDefault: 85,
    intensityDefault: 3,
    bassDefault: 5,
    synthPreset: 'cosmic',
    color: 'text-purple-400 border-purple-500/30',
    glow: 'shadow-[0_0_15px_rgba(168,85,247,0.2)]',
    gradient: 'from-purple-950/40 via-black to-slate-950',
    exclusiveAmbients: ['space', 'wind'],
    eventTitle: 'Conjunción Cósmica Pléyades',
    eventTime: 'Todos los Sábados · 22:00 UTC'
  },
  {
    id: 'eclipse-ix',
    name: 'Eclipse IX',
    genre: 'Deep Techno',
    associatedGenre: 'Deep Techno',
    description: 'Ciudades futuristas de neón en constante penumbra bajo lluvias cilíndricas ácidas.',
    atmosphereDescription: 'Tránsito urbano, lluvia torrencial húmeda y truenos analógicos subsónicos.',
    lore: 'Los megascrapers de silicio proyectan hologramas inmensos en el cielo nublado. La lluvia continua golpea los reactores de fusión del tren magnético de alta velocidad.',
    requiredHours: 5,
    bpmDefault: 95,
    intensityDefault: 7,
    bassDefault: 8,
    synthPreset: 'deep-drone',
    color: 'text-cyan-400 border-cyan-500/30',
    glow: 'shadow-[0_0_15px_rgba(34,211,238,0.2)]',
    gradient: 'from-cyan-950/40 via-black to-slate-950',
    exclusiveAmbients: ['rain', 'thunder', 'city', 'train'],
    eventTitle: 'Festival Neon Rain 2099',
    eventTime: 'Todos los Miércoles · 21:00 UTC'
  },
  {
    id: 'aurora-nexus',
    name: 'Aurora Nexus',
    genre: 'Melodic Techno',
    associatedGenre: 'Melodic Techno',
    description: 'Montañas flotantes de magnetita suspendidas sobre cascadas térmicas de luz boreal.',
    atmosphereDescription: 'Soplos templados y cantos corales de transistores en el viento.',
    lore: 'En las cumbres ingrávidas del Nexus, el silbido del viento frío se funde con los arpegios de ondas senoidales resplandecientes. Una atmósfera introspectiva y profundamente espiritual.',
    requiredHours: 10,
    bpmDefault: 110,
    intensityDefault: 6,
    bassDefault: 7,
    synthPreset: 'plucky',
    color: 'text-emerald-400 border-emerald-500/30',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    gradient: 'from-emerald-950/40 via-black to-slate-950',
    exclusiveAmbients: ['wind', 'forest'],
    eventTitle: 'Viaje de Meditación Solsticio',
    eventTime: 'Cada Luna Llena · 02:00 UTC'
  },
  {
    id: 'titan-drift',
    name: 'Titan Drift',
    genre: 'Industrial Techno',
    associatedGenre: 'Dub Techno',
    description: 'Megafábricas automatizadas y paisajes metálicos azotados por tormentas de polvo seco.',
    atmosphereDescription: 'Ecos de engranajes lejanos, golpes mecánicos y crujidos en la fundición.',
    lore: 'Los respiraderos de vapor de Titan rugen al compás de secuencias industriales oscuras. Es la sinfonía de la maquinaria autónoma que extrae mineral criogénico de las lunas heladas de Saturno.',
    requiredHours: 15,
    bpmDefault: 120,
    intensityDefault: 9,
    bassDefault: 9,
    synthPreset: 'deep-drone',
    color: 'text-rose-450 border-rose-500/30',
    glow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]',
    gradient: 'from-rose-950/30 via-black to-slate-950',
    exclusiveAmbients: ['city', 'train', 'fire'],
    eventTitle: 'Deep Space Furnace Beat Tour',
    eventTime: 'Domingos de Metalúrgica · 18:00 UTC'
  },
  {
    id: 'oceanis',
    name: 'Oceanis',
    genre: 'Organic House',
    associatedGenre: 'Organic House',
    description: 'Islas flotantes de coral coralino sobre un océano líquido turquesa infinito y cálido.',
    atmosphereDescription: 'Olas suaves acariciando orillas mecánicas portuarias y gorjeo de aves exóticas.',
    lore: 'La vida vegetal robótica emite frecuencias curativas armonizadas con el flujo de las mareas lunares. Es una radio diseñada para restaurar el cortisol y el cansancio mental de los pilotos espaciales.',
    requiredHours: 20,
    bpmDefault: 80,
    intensityDefault: 4,
    bassDefault: 4,
    synthPreset: 'warm-pad',
    color: 'text-indigo-400 border-indigo-500/30',
    glow: 'shadow-[0_0_15px_rgba(99,102,241,0.2)]',
    gradient: 'from-indigo-950/40 via-black to-slate-950',
    exclusiveAmbients: ['waves', 'forest', 'coffee'],
    eventTitle: 'Midnight Lagoon Horizon Shift',
    eventTime: 'Viernes Acuáticos · 00:00 UTC'
  }
];

interface DreamscapeUniverseProps {
  userProfile: UserProfile;
  activeWorldId: string;
  onSelectWorld: (world: World) => void;
}

export const DreamscapeUniverse: React.FC<DreamscapeUniverseProps> = ({
  userProfile,
  activeWorldId,
  onSelectWorld
}) => {
  const [selectedWorldInfo, setSelectedWorldInfo] = useState<World>(
    worldsData.find(w => w.id === activeWorldId) || worldsData[0]
  );
  
  const [loadingLore, setLoadingLore] = useState<boolean>(false);
  const [aiGeneratedLore, setAiGeneratedLore] = useState<string>('');

  const handleWorldClick = (world: World) => {
    setSelectedWorldInfo(world);
    const isUnlocked = true;
    if (isUnlocked) {
      onSelectWorld(world);
    }
  };

  const getDynamicLore = async (worldName: string) => {
    setLoadingLore(true);
    setAiGeneratedLore('');
    try {
      // Prompt a real Gemini lore query via server API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Genera una leyenda futurista corta, enigmática y épica de ciencia ficción espacial (lore) para el mundo llamado "${worldName}". Explica qué tipo de música resuena allí y por qué los viajeros cósmicos acuden a escuchar sus vibraciones. Mantén el texto por debajo de 120 palabras.`,
          history: []
        })
      });
      if (response.ok) {
        const data = await response.json();
        setAiGeneratedLore(data.reply);
      } else {
        throw new Error();
      }
    } catch {
      setAiGeneratedLore(`Los antiguos archivos relatan que la estación de sintonías de ${worldName} fue diseñada por ingenieros cuánticos rebeldes para canalizar las frecuencias armónicas naturales de la galaxia. Cada oscilador fue calibrado con el peso de lunas heladas de neutrones.`);
    } finally {
      setLoadingLore(false);
    }
  };

  return (
    <div className="bg-[#0a0b10] border border-white/5 rounded-2xl p-6 space-y-6" id="dreamscape-universe-panel">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Dreamscape Universe Map</h2>
          </div>
          <p className="text-xs text-slate-400 font-sans">Viaja entre mundos temáticos. Cada órbita ejerce modulación física sobre tus sintetizadores de cabina.</p>
        </div>
        <div className="text-xs font-mono text-cyan-400 font-semibold bg-cyan-450/10 border border-cyan-400/20 px-3 py-1 rounded-full">
          Horas de Escucha: <span className="text-white font-bold">{userProfile.listenedHours.toFixed(2)} Hrs</span>
        </div>
      </div>

      {/* Grid of Worlds Card Portals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3" id="universe-worlds-grid">
        {worldsData.map((world) => {
          const isUnlocked = true;
          const isActive = activeWorldId === world.id;
          const isSelected = selectedWorldInfo.id === world.id;

          return (
            <div
              key={world.id}
              onClick={() => handleWorldClick(world)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between select-none ${
                isActive 
                  ? `${world.glow} bg-black border-cyan-400/50` 
                  : isSelected
                    ? 'bg-[#0e0f16]/90 border-slate-700/60'
                    : 'bg-[#050608]/40 border-white/[0.03] hover:border-slate-800'
              }`}
              id={`world-card-${world.id}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-mono font-medium text-slate-400">
                    {world.associatedGenre}
                  </span>
                  <span className="text-[8px] font-mono bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                    Sintonía Activa
                  </span>
                </div>
                <h3 className={`text-sm font-bold mt-2.5 ${world.color}`}>{world.name}</h3>
                <p className="text-[10.5px] text-slate-400 mt-1 line-clamp-3 leading-relaxed">{world.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.03] space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>Ritmo Base:</span>
                  <span className="text-slate-350">{world.bpmDefault} BPM</span>
                </div>
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>Sintetizador:</span>
                  <span className="text-slate-350 uppercase">{world.synthPreset}</span>
                </div>
              </div>

              {isActive && (
                <div className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Broad Selected World Visualizer Box with Lore & Live Interactive Lore generator */}
      <div className={`rounded-xl border border-white/[0.03] p-5 bg-gradient-to-br ${selectedWorldInfo.gradient} grid grid-cols-1 md:grid-cols-3 gap-6`} id="selected-world-lore-card">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <Globe className={`w-5 h-5 ${selectedWorldInfo.color}`} />
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Conexión Cuántica: {selectedWorldInfo.name}
              </h3>
              <p className="text-[10px] font-mono tracking-widest uppercase text-cyan-400">Frecuencia: {selectedWorldInfo.associatedGenre} · {selectedWorldInfo.bpmDefault} BPM</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1 font-semibold">
              <BookOpen size={10} /> CRÓNICA E HISTORIA DEL SECTOR
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedWorldInfo.lore}</p>
          </div>

          {/* AI Narrativa Generator */}
          <div className="bg-black/60 p-3 rounded-lg border border-white/5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[9.5px] font-mono text-purple-400 uppercase tracking-widest flex items-center gap-1 font-medium">
                <Sparkles size={11} /> NARRADORA DE FRECUENCIAS IA
              </span>
              <button 
                onClick={() => getDynamicLore(selectedWorldInfo.name)}
                disabled={loadingLore}
                className="text-[9px] bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold px-2.5 py-1 rounded cursor-pointer disabled:opacity-50 transition-colors"
                id="btn-ai-narrador-generate"
              >
                {loadingLore ? 'Calculando Crónica...' : 'Generar Variante Lore IA'}
              </button>
            </div>
            {aiGeneratedLore ? (
              <p className="text-xs text-slate-400 italic leading-relaxed bg-[#050608]/50 p-2.5 rounded border border-white/[0.02]">{aiGeneratedLore}</p>
            ) : (
              <p className="text-[10.5px] text-slate-500 font-sans">Haz clic en generar para consultar con la Inteligencia Artificial una anomalía histórica o crónica de este mundo.</p>
            )}
          </div>
        </div>

        {/* Dynamic Atmosphere Details panel */}
        <div className="bg-black/50 p-4.5 rounded-xl border border-white/5 flex flex-col justify-between" id="universe-atmosphere-panel">
          <div className="space-y-3.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1 font-semibold">
              <Zap size={11} className="text-yellow-400" /> REGULADORES DE AMBIENTE
            </span>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Textura Ambiental:</span>
                <span className="text-slate-200 font-medium">Procedural Atmosférica</span>
              </div>
              <p className="text-[11px] text-slate-400 italic font-sans leading-normal bg-white/[0.02] p-2 rounded">
                 &quot;{selectedWorldInfo.atmosphereDescription}&quot;
              </p>
              <div className="flex flex-flow gap-1.5 flex-wrap pt-1.5">
                {selectedWorldInfo.exclusiveAmbients.map((amb) => (
                  <span key={amb} className="text-[9.5px] uppercase font-mono border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 px-2 py-0.5 rounded-md">
                    #{amb === 'rain' ? 'lluvia' : amb === 'space' ? 'espacio' : amb === 'city' ? 'ciudad' : amb === 'train' ? 'tren' : amb === 'waves' ? 'oleaje' : amb === 'wind' ? 'viento' : amb}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/[0.03] space-y-2">
            <span className="text-[9px] font-mono text-slate-500 uppercase flex items-center gap-0.5 font-semibold">
              <Calendar size={10} /> PRÓXIMO EVENTO EN DIRECTO
            </span>
            <div>
              <h4 className="text-xs font-semibold text-white tracking-tight">{selectedWorldInfo.eventTitle}</h4>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5">{selectedWorldInfo.eventTime}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
