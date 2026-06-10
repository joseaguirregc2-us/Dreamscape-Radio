import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Watch, 
  Zap, 
  ToggleLeft, 
  ToggleRight, 
  Volume2, 
  Activity, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface BioFeedbackProps {
  onUpdateBPM: (bpm: number) => void;
  onUpdateIntensity: (intensity: number) => void;
}

export const BioFeedback: React.FC<BioFeedbackProps> = ({
  onUpdateBPM,
  onUpdateIntensity
}) => {
  const [bioTelemetryActive, setBioTelemetryActive] = useState<boolean>(false);
  const [heartRate, setHeartRate] = useState<number>(76);
  const [stressLevel, setStressLevel] = useState<number>(38); // Percent
  const [connectedWatchModel, setConnectedWatchModel] = useState<string>('DREAM-BAND ULTRA v4');

  // Continuously simulate subtle pulse fluctuation of biometric trackers to make the UI look deeply alive
  useEffect(() => {
    const timer = setInterval(() => {
      setHeartRate((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        let next = prev + delta;
        
        // Boundaries
        if (next > 130) next = 125;
        if (next < 58) next = 62;
        
        return next;
      });

      setStressLevel((prev) => {
        const delta = Math.random() > 0.5 ? 2 : -2;
        let next = prev + delta;
        if (next > 95) next = 90;
        if (next < 10) next = 15;
        return next;
      });
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  // Sync back actual music updates when telemetry active!
  useEffect(() => {
    if (bioTelemetryActive) {
      // Logic mapping biological states to musical density!
      // If Heart Rate is high, decrease intensity to promote calm, decrease BPM somewhat or speed it up according to workout state:
      if (heartRate > 105) {
        // High heart rate (e.g. stress or workout)
        // Adjust BPM upward for runner pace or downward for meditation!
        const calmingTempo = 85; 
        onUpdateBPM(calmingTempo);
        onUpdateIntensity(3); // Soften drums to relax user
      } else if (heartRate < 68) {
        // Very resting state, let's boost energy
        onUpdateBPM(102);
        onUpdateIntensity(6);
      } else {
        // Mid range normal pace
        onUpdateBPM(92);
        onUpdateIntensity(5);
      }
    }
  }, [heartRate, bioTelemetryActive]);

  const toggleTelemetry = () => {
    setBioTelemetryActive(!bioTelemetryActive);
  };

  const simulateHighStress = () => {
    setHeartRate(118);
    setStressLevel(86);
  };

  const simulateDeepZen = () => {
    setHeartRate(62);
    setStressLevel(14);
  };

  return (
    <div className="bg-[#0a0b10] border border-white/5 rounded-2xl p-6 space-y-5" id="biofeedback-panel">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Watch size={18} className="text-rose-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Biofeedback Calibration</h2>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Vincular tu wearable permite sintonizar ritmos adaptativos automáticos según tu ritmo cardíaco en tiempo real.</p>
        </div>

        {/* Watch toggle */}
        <button
          onClick={toggleTelemetry}
          className={`flex items-center gap-1.5 px-4.5 py-2 rounded-full cursor-pointer font-bold text-xs select-none transition-all ${
            bioTelemetryActive 
              ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.15)]' 
              : 'bg-white/[0.04] border border-white/5 text-slate-300 hover:text-white'
          }`}
          id="btn-telemetry-toggle"
        >
          {bioTelemetryActive ? (
            <>
              <ToggleRight size={16} className="text-rose-400" />
              Wearable Conectado & Activo
            </>
          ) : (
            <>
              <ToggleLeft size={16} className="text-slate-500" />
              Sincronizar Dispositivo
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Telemetry charts */}
        <div className="md:col-span-4 bg-slate-950 p-5 rounded-xl border border-white/5 space-y-4">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-semibold border-b border-white/[0.05] pb-1.5">Métricas de Frecuencia Cardiaca</span>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9.5px] font-mono text-slate-500 block">Frecuencia Cardiaca</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-mono font-bold tracking-tight ${bioTelemetryActive ? 'text-rose-400' : 'text-slate-400'}`}>{heartRate}</span>
                <span className="text-[9.5px] text-slate-500 font-mono">BPM</span>
              </div>
            </div>
            <Heart size={38} className={`duration-700 hover:scale-110 select-none ${bioTelemetryActive ? 'text-rose-500 fill-rose-500 animate-[pulse_0.8s_infinite]' : 'text-slate-600'}`} />
          </div>

          <div className="w-full bg-[#0a0b10] h-1.5 rounded-full overflow-hidden relative">
            <div 
              className={`h-full transition-all duration-1000 ${
                heartRate > 100 ? 'bg-rose-500' : heartRate < 70 ? 'bg-cyan-400' : 'bg-emerald-400'
              }`} 
              style={{ width: `${Math.min(100, Math.max(0, ((heartRate - 50) / 100) * 100))}%` }}
            />
          </div>
          <span className="text-[9.5px] font-sans text-slate-400 block leading-relaxed">
            {bioTelemetryActive 
              ? 'El flujo rítmico se alimenta del nodo de tu muñeca.' 
              : 'Dispositivo en espera. Conéctalo para activar la adaptabilidad.'}
          </span>
        </div>

        {/* Stress metrics */}
        <div className="md:col-span-4 bg-slate-950 p-5 rounded-xl border border-white/5 space-y-4">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-semibold border-b border-white/[0.05] pb-1.5 font-sans">Nivel de Estrés Cortical</span>
          
          <div className="space-y-0.5">
            <span className="text-[9.5px] font-mono text-slate-500 block">Estrés Simulado</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-mono font-bold tracking-tight ${bioTelemetryActive ? 'text-cyan-300' : 'text-slate-400'}`}>{stressLevel}%</span>
              <span className="text-[10px] text-slate-500 font-sans uppercase">Agotamiento</span>
            </div>
          </div>

          <div className="w-full bg-[#0a0b10] h-1.5 rounded-full overflow-hidden relative">
            <div 
              className="bg-cyan-400 h-full transition-all duration-1000" 
              style={{ width: `${stressLevel}%` }}
            />
          </div>

          <span className="text-[9.5px] font-mono text-slate-500 flex items-center gap-1 pt-1 justify-between">
            <span> wearable: {connectedWatchModel} </span>
            <button 
              onClick={() => setConnectedWatchModel((prev) => prev.includes('Ultra') ? 'HOLOGRAPHIC WATCH S1' : 'DREAM-BAND ULTRA v4')}
              className="text-[9.5px] text-[#4287f5] hover:underline"
            >
              cambiar modelo
            </button>
          </span>
        </div>

        {/* Dynamic simulator switches if user wants to play around with bio telemetry */}
        <div className="md:col-span-4 bg-[#0e1017]/50 rounded-xl p-5 border border-white/5 flex flex-col justify-between" id="biofeedback-simulator">
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-semibold border-b border-white/[0.05] pb-1.5">Simulador de Estrés wear</span>
            <p className="text-[10px] text-slate-450 leading-relaxed font-sans">Prueba cómo responde la IA alterando tus datos biométricos manualmente de forma remota:</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={simulateHighStress}
              className="py-2 px-3 border border-red-500/20 bg-red-500/10 hover:bg-red-500/15 text-red-300 hover:text-white rounded-lg text-[10.5px] font-bold cursor-pointer font-sans transition-all"
              id="btn-simulate-stress"
            >
              ⚡ Simular Estrés Alto
            </button>

            <button
              onClick={simulateDeepZen}
              className="py-2 px-3 border border-emerald-500/25 bg-emerald-500/15 hover:bg-emerald-500/20 text-emerald-300 hover:text-white rounded-lg text-[10.5px] font-bold cursor-pointer font-sans transition-all"
              id="btn-simulate-zen"
            >
              🧘 Simular Estado Zen
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
