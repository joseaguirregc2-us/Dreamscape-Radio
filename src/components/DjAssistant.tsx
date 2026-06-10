import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Heart, 
  Cpu, 
  UserCheck, 
  Eye, 
  Settings, 
  ListMusic, 
  CornerDownRight 
} from 'lucide-react';

interface DjPresetRecommendation {
  title: string;
  genre: string;
  bpm: number;
  intensity: number;
  description: string;
}

export const DjAssistant: React.FC<{
  onApplyRecommendation: (rec: DjPresetRecommendation) => void;
}> = ({ onApplyRecommendation }) => {
  const [djName, setDjName] = useState<string>('Sintetizador_Aura');
  const [personality, setPersonality] = useState<'philosophical' | 'clubber' | 'zen'>('zen');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [iaResponse, setIaResponse] = useState<string>('');
  const [loadingDj, setLoadingDj] = useState<boolean>(false);

  const avatars: Record<string, string> = {
    zen: '🔮',
    philosophical: '🛸',
    clubber: '👾',
  };

  const currentAvatar = avatars[personality];

  const recommendations: DjPresetRecommendation[] = [
    { 
      title: 'Pulsos de Silicio (Silicon Pulse)', 
      genre: 'Dub Techno', 
      bpm: 98, 
      intensity: 6, 
      description: 'Acústica profunda para codificar y perderse en frecuencias cilíndricas.' 
    },
    { 
      title: 'Sol Flotante (Floating Sun)', 
      genre: 'Organic House', 
      bpm: 82, 
      intensity: 3, 
      description: 'Mezcla balsámica orgánica de campanas relajantes e islas de coral tibio.' 
    },
    { 
      title: 'Trance de Bucle Frío (Cold Infinite)', 
      genre: 'Ambient Techno', 
      bpm: 90, 
      intensity: 4, 
      description: 'Drones planeadores espaciales diseñados como escudo anti-estrés para la mente.' 
    },
  ];

  const handleAskDj = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim() || loadingDj) return;

    setLoadingDj(true);
    setIaResponse('');
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Eres mi DJ IA de música electrónica de relajación y concentración. Tu nombre personalizado es "${djName}" y tu personalidad activa es de estilo "${
            personality === 'zen' ? 'Profundamente zen y espiritual con metáforas acuáticas' : personality === 'philosophical' ? 'Astronómico y de ciencia ficción poética interestelar' : 'Enérgico conocedor de clubes underground de Berlín nocturno'
          }". Como DJ, responde al siguiente pedido musical del usuario: "${customPrompt}". Mantén tu respuesta poética y cordial en español, bajo 100 palabras.`,
          history: []
        })
      });
      if (response.ok) {
        const data = await response.json();
        setIaResponse(data.reply);
      } else {
        throw new Error();
      }
    } catch {
      // Offline fallback tailored to personality
      if (personality === 'zen') {
        setIaResponse(`[Canales Zen de ${djName}]: He expandido los moduladores armónicos. Siento que necesitas un oleaje suave acompañado de sintetizadores lentos warm-pad. Calibra tus latidos con el sintonizador.`);
      } else if (personality === 'philosophical') {
        setIaResponse(`[Archivos Cósmicos de ${djName}]: Detecto órbitas tensas en tu sector mental de concentración. Recomiendo elevar la ambientación espacial a 80% y reducir el tempo del techno a 88 BPM.`);
      } else {
        setIaResponse(`[Cabina de Ritmos de ${djName}]: ¡Entendido, piloto! Vamos a meterle un BPM robusto a 112, un bajo sub-grave y de fondo unos grillos de noche y murmullos para darle espacialidad underground.`);
      }
    } finally {
      setLoadingDj(false);
    }
  };

  return (
    <div className="bg-[#0a0b10] border border-white/5 rounded-2xl p-6 space-y-6" id="dj-assistant-panel">
      <div className="flex items-center gap-2.5">
        <Sparkles className="text-cyan-400" />
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">DJ IA Personal Companion</h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Define las características de tu mentor y controlador musical autónomo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left visually rich DJ Config block */}
        <div className="md:col-span-5 bg-[#0e1017]/50 rounded-xl p-5 border border-white/5 space-y-5" id="dj-config-form">
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold border-b border-white/[0.05] pb-1.5">Ajustes del Companion</span>
            
            <div className="space-y-1.5">
              <label className="text-xs text-slate-350 block font-sans">Nombre Personalizado:</label>
              <input
                type="text"
                value={djName}
                onChange={(e) => setDjName(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-white/5 hover:border-slate-800 focus:border-cyan-400/50 rounded-lg px-3 py-2 text-white font-mono"
                id="input-dj-name"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-350 block font-sans">Frecuencia de Personalidad:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'zen', label: 'Zen / Relajado', desc: 'Meditativo poético' },
                  { id: 'philosophical', label: 'Astrónomo', desc: 'Espectros cósmicos' },
                  { id: 'clubber', label: 'Underground', desc: 'Sintetizador Berlín' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPersonality(item.id as any)}
                    className={`p-2.5 rounded-lg border flex flex-col justify-between text-left cursor-pointer transition-all ${
                      personality === item.id 
                        ? 'bg-cyan-500/10 border-cyan-400/50 text-cyan-400' 
                        : 'bg-black/20 border-[#1a1c23] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-[10.5px] font-bold font-sans block">{item.label}</span>
                    <span className="text-[8px] opacity-60 mt-1 font-mono leading-none">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Visual dynamic avatar widget */}
          <div className="bg-black/60 p-4 rounded-xl border border-[#1a1c23] flex items-center gap-4 relative overflow-hidden">
            {/* Visual background lines animating */}
            <div className="absolute inset-0 flex justify-around opacity-15 pointer-events-none items-end">
              <div className="w-[1.5px] h-12 bg-cyan-400 animate-[bounce_1.4s_infinite]" />
              <div className="w-[1.5px] h-18 bg-cyan-400 animate-[bounce_1.9s_infinite_0.4s]" />
              <div className="w-[1.5px] h-10 bg-cyan-400 animate-[bounce_1.2s_infinite_0.7s]" />
              <div className="w-[1.5px] h-14 bg-cyan-400 animate-[bounce_2.1s_infinite_0.2s]" />
            </div>

            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400/20 to-fuchsia-600/20 flex items-center justify-center text-3xl border border-white/10 shrink-0 select-none relative z-10 animate-pulse">
              {currentAvatar}
            </div>
            <div className="relative z-10 space-y-0.5">
              <h4 className="text-xs font-bold text-white tracking-tight">{djName} <span className="text-[10px] text-cyan-400/80 font-mono font-medium">· DJ IA</span></h4>
              <p className="text-[9.5px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping inline-block" /> CONCECTADO EN CABINA
              </p>
              <p className="text-[9px] text-slate-400 leading-snug font-sans">
                {personality === 'zen' && 'Alineará frecuencias theta espirituales para aliviar el estrés cortical.'}
                {personality === 'philosophical' && 'Mapeará galaxias lofi para expandir tus proyectos de código.'}
                {personality === 'clubber' && 'Mantendrá loops nocturnos continuos ideales para trabajar de noche.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Talk & Live Mix recommendation suggestions */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-5">
          
          {/* Chat interaction with DJ Companion */}
          <div className="bg-[#0e1017]/30 border border-white/5 rounded-xl p-4 flex flex-col justify-between flex-1 space-y-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold border-b border-white/[0.05] pb-1">Consultas de Sintonía</span>
            
            <div className="flex-1 overflow-y-auto max-h-[160px] space-y-3 pr-2 scrollbar-thin">
              {iaResponse ? (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">{djName}:</span>
                  <p className="text-xs text-slate-350 leading-relaxed font-sans bg-black/60 p-3 rounded-xl border border-white/5">{iaResponse}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-6 text-slate-500 space-y-2">
                  <HelpCircle size={22} className="opacity-40 text-cyan-400" />
                  <p className="text-xs font-sans max-w-xs leading-normal">Pídele cambiar ritmos, crear sets temáticos o calmar tu nivel de estrés diario.</p>
                </div>
              )}
            </div>

            <form onSubmit={handleAskDj} className="flex gap-2">
              <input
                type="text"
                placeholder={`Escríbele a ${djName} (ej: "Genera una sesión para estudiar Rust")`}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="flex-1 text-xs bg-slate-950 border border-white/5 rounded-full px-4 py-2.5 font-sans focus:outline-none focus:border-cyan-400/55 text-white"
                id="input-dj-custom-prompt"
              />
              <button
                type="submit"
                disabled={loadingDj || !customPrompt.trim()}
                className="bg-cyan-400 hover:bg-cyan-500 text-black font-extrabold text-xs px-5 py-2 rounded-full cursor-pointer disabled:opacity-50 transition-colors"
                id="btn-dj-submit"
              >
                {loadingDj ? 'Procesando...' : 'Pedir'}
              </button>
            </form>
          </div>

          {/* Quick Click Mix list recommendations */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">Sesiones Heurísticas Diseñadas por la IA</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5" id="dj-recommendations-list">
              {recommendations.map((rec, i) => (
                <div 
                  key={i} 
                  onClick={() => onApplyRecommendation(rec)}
                  className="bg-black/50 border border-white/[0.04] p-3 rounded-lg hover:border-cyan-400/20 cursor-pointer hover:bg-white/[0.01] transition-all flex flex-col justify-between group"
                  id={`rec-card-${i}`}
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                      <span>{rec.genre}</span>
                      <span className="text-cyan-400">{rec.bpm} BPM</span>
                    </div>
                    <h5 className="text-xs font-bold text-white tracking-tight group-hover:text-cyan-400 mt-1 flex items-center gap-0.5">
                      <CornerDownRight size={10} className="text-slate-500" /> {rec.title}
                    </h5>
                    <p className="text-[10px] text-slate-400 leading-normal font-sans line-clamp-3">{rec.description}</p>
                  </div>
                  <div className="mt-3 text-[9px] font-semibold text-cyan-400/85 hover:text-cyan-300 font-mono tracking-wide uppercase">LOAD PRESET →</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
