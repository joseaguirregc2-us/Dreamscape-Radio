import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wind, 
  Sparkles, 
  Compass, 
  Play, 
  Pause, 
  Volume2, 
  Sun, 
  Moon, 
  Activity,
  Maximize2
} from 'lucide-react';

interface TotalImmersionProps {
  onClose: () => void;
  activeWorldName: string;
  activeWorldColor: string;
  ambientLevel: number;
  onUpdateAmbientLevel: (lvl: number) => void;
}

export const TotalImmersion: React.FC<TotalImmersionProps> = ({
  onClose,
  activeWorldName,
  activeWorldColor,
  ambientLevel,
  onUpdateAmbientLevel
}) => {
  // Breathing coach states: 'inhale' | 'hold' | 'exhale' | 'ready'
  const [breathState, setBreathState] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCounter, setBreathCounter] = useState<number>(4);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);
  const [cosmicCoord, setCosmicCoord] = useState<string>('RA 14h 29m 43s / Dec -62° 40\' 46"');

  // Breathing loop simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathCounter((prev) => {
        if (prev <= 1) {
          // state transitions
          setBreathState((state) => {
            if (state === 'inhale') return 'hold';
            if (state === 'hold') return 'exhale';
            // state was exhale
            setCyclesCompleted((c) => c + 1);
            return 'inhale';
          });
          return 4; // Reset duration (4 seconds Box Breathing)
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update cosmic coordinate periodically for immersive tech aesthetic
  useEffect(() => {
    const coordsPreset = [
      'RA 14h 29m 43s / Dec -62° 40\' 46"',
      'Sector Beta-9 / Portal Heliocéntrico',
      'Anomalía Estelar Orión 244-S',
      'Orilla Acuática S-2 / Tránsito Celeste',
      'Nebulosa Lira 0.44 PARSECS'
    ];
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * coordsPreset.length);
      setCosmicCoord(coordsPreset[idx]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#020205] bg-radial-at-t from-[#0d0f1a] to-[#020205] z-50 flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden animate-fade-in" id="total-immersion-fullscreen">
      
      {/* Background ambient stars particles floating animation wrapper */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
        <div className="absolute h-1 w-1 bg-white rounded-full top-[10%] left-[20%] animate-pulse" />
        <div className="absolute h-1.5 w-1.5 bg-cyan-400 rounded-full top-[40%] left-[80%] animate-pulse duration-1000" />
        <div className="absolute h-1 w-1 bg-purple-400 rounded-full top-[70%] left-[15%] animate-pulse duration-700" />
        <div className="absolute h-2 w-2 bg-pink-400 rounded-full top-[25%] left-[65%] animate-pulse duration-1500" />
        <div className="absolute h-1 w-1 bg-white rounded-full top-[85%] left-[50%] animate-pulse duration-1100" />
      </div>

      {/* Top Bar Navigation components */}
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2.5">
          <Maximize2 size={16} className="text-cyan-400" />
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-widest font-mono">MODO INMERSIÓN TOTAL</h1>
            <p className="text-[10px] text-slate-400 font-sans">Todos sus sintonizadores secundarios han sido optimizados de forma etérea.</p>
          </div>
        </div>

        {/* Exit fullscreen button */}
        <button
          onClick={onClose}
          className="p-2 sm:p-2.5 rounded-full bg-white/[0.04] text-slate-400 hover:text-white border border-white/5 hover:bg-white/[0.08] cursor-pointer transition-all flex items-center justify-center"
          title="Salir de Inmersión"
          id="btn-close-immersion"
        >
          <X size={15} />
        </button>
      </div>

      {/* Center Box Breathing Coach Section */}
      <div className="flex flex-col items-center justify-center text-center relative z-10 flex-1 space-y-8" id="immersion-mindfulness-space">
        <div className="space-y-2">
          <span className="text-[10.5px] font-mono text-cyan-400 tracking-widest uppercase block font-semibold">Templo de Meditación Atmosférico</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            Mundo Sintonizado: <span className={activeWorldColor}>{activeWorldName}</span>
          </h2>
        </div>

        {/* Breathing expanding circle container */}
        <div className="relative flex items-center justify-center h-56 w-56 sm:h-64 sm:w-64" id="breathing-circle-ring">
          {/* Pulsing expander ring */}
          <div 
            className={`absolute rounded-full border border-cyan-400/30 transition-all duration-1000 ${
              breathState === 'inhale' 
                ? 'scale-120 h-52 w-52 opacity-80 bg-cyan-400/5 shadow-[0_0_40px_rgba(34,211,238,0.15)]' 
                : breathState === 'hold'
                  ? 'scale-120 h-52 w-52 opacity-100 bg-purple-400/10 shadow-[0_0_45px_rgba(168,85,247,0.2)]'
                  : 'scale-90 h-36 w-36 opacity-30 bg-transparent'
            }`}
          />
          
          <div className="absolute h-40 w-40 rounded-full bg-[#050608]/95 border border-white/10 flex flex-col items-center justify-center shadow-2xl relative z-10">
            <Wind size={28} className={`mb-1.5 transition-all duration-700 ${
              breathState === 'inhale' ? 'text-cyan-400 rotate-185 animate-pulse' : breathState === 'hold' ? 'text-purple-400 animate-spin-slow' : 'text-slate-500'
            }`} />
            
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest leading-none">
              {breathState === 'inhale' && 'Inhala'}
              {breathState === 'hold' && 'Mantén'}
              {breathState === 'exhale' && 'Exhala'}
            </span>
            
            <span className="text-3xl font-mono font-bold text-white mt-1.5 leading-none">
              {breathCounter}
            </span>
            
            <span className="text-[9px] font-mono text-slate-500 uppercase mt-2.5">
              Ciclos: {cyclesCompleted}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-350 max-w-sm leading-relaxed font-sans mt-2">
          &quot;Sincroniza tus respiraciones con el expansor galáctico. Esto estabiliza tus ritmos cardíacos y optimiza la recepción del techno chill.&quot;
        </p>
      </div>

      {/* Bottom telemetry indicators & ambient slider controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 pt-6 border-t border-white/[0.04] items-center" id="immersion-footer">
        
        {/* Telemetry coordinates label */}
        <div className="text-left hidden md:block">
          <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-widest font-semibold flex items-center gap-1">
            <Compass size={11} className="text-cyan-400" /> Navegador de Cabina
          </span>
          <span className="text-xs font-mono font-bold text-white tracking-tight mt-1 inline-block">{cosmicCoord}</span>
        </div>

        {/* Center state badge */}
        <div className="text-center font-mono text-[10.5px]">
          <span className="text-slate-500 font-medium">ESTADO DEL SINTONIZADOR: </span>
          <span className="text-emerald-400 font-bold animate-pulse">ÓPTIMO (100% ARMÓNICO)</span>
        </div>

        {/* Right quick ambient noise levels slider */}
        <div className="flex items-center justify-end gap-3.5 flex-wrap">
          <div className="flex items-center gap-1.5 bg-black/60 border border-white/5 px-4 py-2 rounded-full shrink-0">
            <Volume2 size={13} className="text-slate-400" />
            <span className="text-[10px] font-mono text-slate-400 uppercase">Texturas: {ambientLevel}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={ambientLevel}
            onChange={(e) => onUpdateAmbientLevel(Number(e.target.value))}
            className="w-32 accent-cyan-400 h-1 bg-slate-900 rounded-lg cursor-pointer"
          />
        </div>

      </div>

    </div>
  );
};
