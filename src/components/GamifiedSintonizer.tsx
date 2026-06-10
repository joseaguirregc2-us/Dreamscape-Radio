import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle, 
  Circle, 
  HelpCircle, 
  Zap, 
  Compass, 
  Lock, 
  RefreshCw 
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
}

export const GamifiedSintonizer: React.FC = () => {
  const [xp, setXp] = useState<number>(340);
  const [level, setLevel] = useState<number>(4);
  const [claimedList, setClaimedList] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: 'ch-1', title: 'Viajero Silbante', description: 'Visita y sintoniza el mundo Nebula Prime bajo 85 BPM.', xpReward: 100, completed: true },
    { id: 'ch-2', title: 'Compositor Orbital', description: 'Activa o aleatoriza el secuenciador del Estudio Musical IA.', xpReward: 150, completed: false },
    { id: 'ch-3', title: 'Sintonía Orgánica', description: 'Activa el dispositivo simulado de Biofeedback en cabina.', xpReward: 120, completed: false },
    { id: 'ch-4', title: 'Co-op Explorer', description: 'Únete en directo a la transmisión de Midnight Voyage.', xpReward: 200, completed: false },
    { id: 'ch-5', title: 'Mecenas de Frecuencia', description: 'Adquiere un preset o bucle en el Co-op Marketplace.', xpReward: 150, completed: false },
  ]);

  const toggleChallenge = (id: string) => {
    setChallenges((prev) => 
      prev.map((c) => {
        if (c.id === id) {
          const nextCompleted = !c.completed;
          if (nextCompleted) {
            // Claim XP
            setXp((prevXp) => {
              const total = prevXp + c.xpReward;
              if (total >= 100) {
                // simple level up multiplier logic
                setLevel((prevLvl) => prevLvl + 1);
                return total % 1000;
              }
              return total;
            });
          } else {
            // Deduct XP
            setXp((prevXp) => Math.max(0, prevXp - c.xpReward));
          }
          return { ...c, completed: nextCompleted };
        }
        return c;
      })
    );
  };

  const badges = [
    { name: 'Sintonizador Novato', emoji: '📻', desc: 'Sintonizado tu primer mundo celestial.', unlocked: true },
    { name: 'Viajero Cuántico', emoji: '🛸', desc: 'Desbloqueado más de 2 planetas.', unlocked: true },
    { name: 'Místico del Ritmo', emoji: '🔮', desc: 'Superado 12 horas de escucha profunda.', unlocked: level >= 5 },
    { name: 'Señor del Silicio', emoji: '🧬', desc: 'Comercializado tu primer loop en el mercado.', unlocked: level >= 7 },
  ];

  return (
    <div className="bg-[#0a0b10] border border-white/5 rounded-2xl p-6 space-y-6" id="gamified-sintonizer-panel">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="text-yellow-450" />
            <h2 className="text-lg font-bold text-white tracking-tight">Bitácora de Desafíos y Logros</h2>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Completa aventuras sonoras para acumular XP y desbloquear prestigiosos rangos galácticos.</p>
        </div>

        {/* Level and XP visual bar */}
        <div className="bg-slate-950 p-3 rounded-xl border border-white/5 flex items-center gap-3 shrink-0">
          <div className="h-10 w-10 rounded-lg bg-yellow-400/10 border border-yellow-500/20 flex flex-col items-center justify-center text-yellow-400 shrink-0">
            <span className="text-[9px] font-mono leading-none">NIVEL</span>
            <span className="text-base font-mono font-black leading-none mt-1">{level}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-slate-400">Rango: Maestro del Sonido</span>
              <span className="text-yellow-400 font-bold">{xp}/1000 XP</span>
            </div>
            <div className="w-36 sm:w-44 bg-black h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full transition-all duration-500" 
                style={{ width: `${(xp / 1000) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left challenges checklist */}
        <div className="md:col-span-7 space-y-4">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-semibold border-b border-white/[0.05] pb-1.5">Desafíos de Explorador de Frecuencias</span>
          
          <div className="space-y-2.5" id="challenges-list">
            {challenges.map((ch) => (
              <div 
                key={ch.id}
                onClick={() => toggleChallenge(ch.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                  ch.completed 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-slate-300' 
                    : 'bg-[#050608]/90 border-white/[0.03] hover:border-slate-800 hover:bg-[#07080c]'
                }`}
                id={`challenge-${ch.id}`}
              >
                <div className="flex items-start gap-3">
                  {ch.completed ? (
                    <CheckCircle className="text-emerald-400 mt-0.5 shrink-0" size={17} />
                  ) : (
                    <Circle className="text-slate-700 mt-0.5 shrink-0" size={17} />
                  )}
                  <div>
                    <h4 className={`text-xs font-bold leading-none ${ch.completed ? 'text-slate-350 line-through' : 'text-white'}`}>{ch.title}</h4>
                    <p className="text-[10.5px] text-slate-400 font-sans mt-1 leading-normal">{ch.description}</p>
                  </div>
                </div>

                <div className="text-[10px] font-mono font-bold text-yellow-400 bg-yellow-400/5 px-2.5 py-1 rounded border border-yellow-500/10 shrink-0 select-none">
                  +{ch.xpReward} XP
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right badges shelf panel */}
        <div className="md:col-span-5 bg-[#0e1017]/45 rounded-xl p-5 border border-white/5 space-y-4">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-semibold border-b border-white/[0.05] pb-1.5 font-sans">Vitrina de Emblemas de Cabina</span>
          
          <div className="grid grid-cols-2 gap-3" id="badges-grid-list">
            {badges.map((badge, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-lg border text-center flex flex-col items-center justify-between min-h-[105px]relative ${
                  badge.unlocked 
                    ? 'bg-slate-950 border-white/5' 
                    : 'bg-black/40 border-dashed border-white/[0.02] text-slate-600'
                }`}
                id={`badge-card-${idx}`}
              >
                {badge.unlocked ? (
                  <>
                    <span className="text-2xl mb-1.5 block select-none">{badge.emoji}</span>
                    <h5 className="text-[10.5px] font-bold text-white tracking-tight leading-snug">{badge.name}</h5>
                    <p className="text-[9px] text-slate-500 leading-normal font-sans mt-0.5 line-clamp-2">{badge.desc}</p>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-2 text-center opacity-45">
                    <Lock size={16} className="text-slate-600 mb-1" />
                    <span className="text-[9.5px] font-mono text-slate-500 block">Nivel {idx + 4} requerido</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
