import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  MessageSquare, 
  Tv, 
  Award, 
  ShieldAlert, 
  Smile, 
  Share2, 
  Volume2
} from 'lucide-react';

interface ChatMessageSim {
  id: string;
  username: string;
  text: string;
  badge?: string;
  time: string;
}

interface FloatingEmoji {
  id: string;
  char: string;
  left: number;
}

const mockUserNames = [
  'HyperLlama', 'CyberKlaus', 'Luna_9', 'NeonCoder', 'RustLover', 'OctaveMaster', 
  'DubFlyer', 'ZeroStress', 'KompaktPilot', 'BerlínTransit', 'SubVolt', 'AcuaticZen'
];

const mockChatLines = [
  'Uff, este bajo en Eclipse IX está sencillamente brutal!! 🔥',
  'Estudiando Rust para el backend de mi startup con esta lluvia de fondo 💻',
  '¡Qué buena sintonía! Me bajó las pulsaciones en 5 minutos.',
  '¿Alguien más programando a las 4 AM en el espacio profundo? 🛸',
  'Perfect mood for coding, el sonido es increíblemente limpio.',
  'Me encanta Organic House en Oceanis. Se siente como playa sintética.',
  '¡Saludos desde Berlín! El Dub es brutal 📻',
  'Música infinita real y adaptativa, qué locura de app.',
  'La IA DJ hoy está inspirada poéticamente 😂',
  'Esa modulación de viento es la cura definitiva al insomnio.',
];

export const GlobalLiveEvents: React.FC = () => {
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const [listenerCount, setListenerCount] = useState<number>(4220);
  const [chatMessages, setChatMessages] = useState<ChatMessageSim[]>([
    { id: '1', username: 'BerlínTransit', text: 'Esperando el inicio de Midnight Voyage, listos los audífonos...', badge: '👑 VIP', time: '04:40' },
    { id: '2', username: 'NeonCoder', text: 'Este ambiente de lluvia me salvó la tesis doctoral.', badge: '⚡ Creador', time: '04:41' },
    { id: '3', username: 'SubVolt', text: 'Ecos espectaculares.', time: '04:42' },
  ]);

  const [inputMessage, setInputMessage] = useState<string>('');
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Simulate active listeners fluctuation and continuous virtual chat stream
  useEffect(() => {
    if (!activeEvent) return;

    const chatTimer = setInterval(() => {
      const randomUser = mockUserNames[Math.floor(Math.random() * mockUserNames.length)];
      const randomText = mockChatLines[Math.floor(Math.random() * mockChatLines.length)];
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setChatMessages((prev) => [
        ...prev.slice(-40), // cap memory
        {
          id: Math.random().toString(),
          username: randomUser,
          text: randomText,
          time: now,
        }
      ]);
    }, 1800);

    const countingTimer = setInterval(() => {
      setListenerCount((prev) => {
        const delta = Math.floor(Math.random() * 30) - 15;
        return prev + delta;
      });
    }, 4000);

    return () => {
      clearInterval(chatTimer);
      clearInterval(countingTimer);
    };
  }, [activeEvent]);

  const handleSendChatSim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        username: 'Tú (Arquitecto)',
        text: inputMessage,
        badge: '⚡ Arquitecto',
        time: now,
      }
    ]);

    setInputMessage('');
  };

  const spawnReaction = (emojiChar: string) => {
    const id = Math.random().toString();
    const left = Math.floor(Math.random() * 75) + 12; // offset percentage inside relative box
    
    setFloatingEmojis((prev) => [...prev, { id, char: emojiChar, left }]);
    
    // Cleanup floating emoji after animation concludes
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== id));
    }, 1800);
  };

  return (
    <div className="bg-[#0a0b10] border border-white/5 rounded-2xl p-6 space-y-6" id="live-events-panel">
      
      {/* Event selection or lobby */}
      {!activeEvent ? (
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <Tv className="text-purple-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">Salas de Conciertos y Eventos Globales</h2>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">Únete en tiempo real a festivales temáticos virtuales con miles de oyentes simultáneos coordinados por Inteligencias Artificiales.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="live-events-cards-list">
            
            {/* Event Card 1 */}
            <div className="bg-gradient-to-r from-purple-950/30 to-[#0e1017] p-5 rounded-xl border border-purple-500/10 hover:border-purple-400/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-purple-400 font-bold block animate-pulse">● DIRECTO EN SESIÓN</span>
                  <span className="text-slate-500">4.2k Sintonizados</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-3 flex items-center gap-1">MIDNIGHT VOYAGE <Award size={13} className="text-purple-300" /></h3>
                <p className="text-xs text-slate-400 mt-1 leading-normal font-sans">El festival cósmico premium del Dreamscape. Sintetizadores etéreos lentos e hilos de lluvia adaptados de forma colectiva.</p>
              </div>
              <button
                onClick={() => {
                  setActiveEvent('Midnight Voyage');
                  setListenerCount(4218);
                }}
                className="mt-5 w-full py-2 bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white font-bold rounded-lg text-xs cursor-pointer select-none transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                id="btn-join-midnight-voyage"
              >
                Ingresar al Festival Virtual (Acceso Libre)
              </button>
            </div>

            {/* Event Card 2 */}
            <div className="bg-gradient-to-r from-cyan-950/20 to-[#0e1017] p-5 rounded-xl border border-cyan-500/10 hover:border-cyan-400/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-500 font-bold">PRÓXIMA SESIÓN EN DIRECTO</span>
                  <span className="text-cyan-400">En 14 horas</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-3 flex items-center gap-1">NEON RAIN FESTIVAL <Award size={13} className="text-cyan-300" /></h3>
                <p className="text-xs text-slate-400 mt-1 leading-normal font-sans">Sesión de Deep Techno industrial acelerado. Diseñado para potenciar el enfoque de desarrolladores de software nocturnos.</p>
              </div>
              <button
                disabled
                className="mt-5 w-full py-2 bg-[#0d0e12]/80 text-slate-500 border border-white/[0.03] text-xs font-semibold rounded-lg cursor-not-allowed select-none"
              >
                Inscripción Confirmada
              </button>
            </div>

          </div>
        </div>
      ) : (
        /* Joined Active Concert Room */
        <div className="space-y-5" id="active-concert-room">
          
          {/* Header row elements */}
          <div className="flex justify-between items-center border-b border-white/[0.05] pb-4 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500 animate-ping" />
              <div>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1">
                  En Transmisión: {activeEvent}
                </h3>
                <p className="text-[10px] font-mono text-purple-400">Filtro de visualización Cyber-Glow Activado en Tiempo Real</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 px-3.5 py-1 rounded-full text-purple-300 text-xs font-semibold">
                <Users size={12} />
                <span className="font-mono">{listenerCount} Oyentes</span>
              </div>
              
              <button
                onClick={() => setActiveEvent(null)}
                className="text-xs bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/5 px-3 py-1 rounded-full cursor-pointer transition-colors font-semibold"
                id="btn-leave-event"
              >
                Salir del Evento
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Live Chat stream container */}
            <div className="md:col-span-8 flex flex-col justify-between bg-black/90 rounded-xl p-4 border border-white/5 h-[340px] relative overflow-hidden flex-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-semibold border-b border-white/[0.05] pb-1.5 mb-2 flex items-center gap-1">
                <MessageSquare size={11} className="text-purple-400" /> Chat del Festival en Vivo
              </span>

              {/* Chat lines feed */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-3.5 pr-2 mr-0.5 scrollbar-thin text-xs text-slate-300 pt-1"
                id="simulated-chat-lines"
              >
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-2 animate-fade-in">
                    <span className="text-slate-500 font-mono shrink-0 select-none">[{msg.time}]</span>
                    <div className="leading-relaxed">
                      {msg.badge && (
                        <span className="text-[8.5px] bg-purple-500/15 border border-purple-500/30 text-purple-300 font-extrabold px-1.5 py-0.5 rounded mr-1.5 scale-90 inline-block">
                          {msg.badge}
                        </span>
                      )}
                      <span className="font-bold text-slate-200 mr-1.5">{msg.username}:</span>
                      <span className="text-slate-300 font-sans">{msg.text}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* chat sender form */}
              <form onSubmit={handleSendChatSim} className="flex gap-2 border-t border-white/[0.04] pt-3 mt-3">
                <input
                  type="text"
                  placeholder="Escribe un mensaje en el festival..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 text-xs bg-slate-950 border border-white/5 rounded-full px-4 py-2.5 font-sans focus:outline-none focus:border-purple-500/50 text-white"
                  id="input-live-chat"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-extrabold text-xs px-5 py-2 rounded-full cursor-pointer disabled:opacity-50 transition-colors"
                  id="btn-live-chat-send"
                >
                  Enviar
                </button>
              </form>
            </div>

            {/* Glowing reactive reaction Pad */}
            <div className="md:col-span-4 bg-[#0a0b12] p-5 rounded-2xl border border-white/5 flex flex-col justify-between relative h-[360px] overflow-hidden shadow-2xl">
              
              {/* Floating animated reactions bucket */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
                {floatingEmojis.map((emoji) => (
                  <div
                    key={emoji.id}
                    className="absolute animate-float-emoji text-4xl select-none filter drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                    style={{ left: `${emoji.left}%`, bottom: '60px' }}
                  >
                    {emoji.char}
                  </div>
                ))}
              </div>

              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold border-b border-white/[0.05] pb-2 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-yellow-450 animate-pulse" />
                  Pad de Reacciones Colectivas
                </span>
                <p className="text-[10.5px] text-slate-450 leading-relaxed font-sans">Envía vibraciones al aire. Los oyentes verán tus reacciones flotar en el entorno real de forma adaptativa.</p>
              </div>

              {/* Reaction buttons grid click area */}
              <div className="grid grid-cols-3 gap-2 relative z-10 pt-4" id="reactions-trigger-buttons">
                {[
                  { char: '❤️', label: 'Amor', style: 'hover:border-red-500/30 hover:bg-red-500/10 hover:shadow-[0_0_12px_rgba(239,68,68,0.25)] text-red-100' },
                  { char: '🔥', label: 'Fuego', style: 'hover:border-orange-500/30 hover:bg-orange-500/10 hover:shadow-[0_0_12px_rgba(249,115,22,0.25)] text-orange-100' },
                  { char: '🛸', label: 'Cósmico', style: 'hover:border-purple-500/30 hover:bg-purple-500/10 hover:shadow-[0_0_12px_rgba(168,85,247,0.25)] text-purple-105' },
                  { char: '⚡', label: 'Rayo', style: 'hover:border-yellow-550/30 hover:bg-yellow-550/10 hover:shadow-[0_0_12px_rgba(234,179,8,0.25)] text-yellow-100' },
                  { char: '📻', label: 'Sinto', style: 'hover:border-cyan-550/30 hover:bg-cyan-550/10 hover:shadow-[0_0_12px_rgba(6,182,212,0.25)] text-cyan-100' },
                  { char: '🌀', label: 'Eólico', style: 'hover:border-sky-500/30 hover:bg-sky-500/10 hover:shadow-[0_0_12px_rgba(56,189,248,0.25)] text-sky-100' },
                  { char: '🌲', label: 'Bosque', style: 'hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:shadow-[0_0_12px_rgba(16,185,129,0.25)] text-emerald-100' },
                  { char: '🌊', label: 'Océano', style: 'hover:border-blue-500/30 hover:bg-blue-500/10 hover:shadow-[0_0_12px_rgba(59,130,246,0.25)] text-blue-100' },
                  { char: '👾', label: 'Space', style: 'hover:border-pink-500/30 hover:bg-pink-500/10 hover:shadow-[0_0_12px_rgba(236,72,153,0.25)] text-pink-100' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => spawnReaction(item.char)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950/90 border border-white/[0.04] active:scale-95 transition-all text-center cursor-pointer relative ${item.style}`}
                  >
                    <span className="text-2xl select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] transform hover:scale-110 duration-200">{item.char}</span>
                    <span className="text-[9px] text-slate-400 font-mono font-medium mt-1.5 uppercase select-none tracking-wider">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* simulated coordinates telemetry */}
              <div className="text-[8.5px] font-mono text-slate-500 text-center relative z-10 pt-3 leading-none select-none tracking-widest border-t border-white/[0.02]">
                ENLACE CUÁNTICO ACTIVO · COORD: 42° 36&apos; N / 8° 22&apos; O
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
