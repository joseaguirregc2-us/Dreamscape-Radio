import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AmbientSoundType, AmbientSound } from '../types';
import { Sparkles, Send, Loader2, Play, ChevronRight, HelpCircle } from 'lucide-react';

interface AIAssistantProps {
  onApplyPreset: (preset: {
    bpm: number;
    intensity: number;
    ambientVolumes: Partial<Record<AmbientSoundType, number>>;
    synthPreset: string;
    title: string;
  }) => void;
  ambientSounds: AmbientSound[];
  aiSearchTrigger?: string;
  setAiSearchTrigger?: (val: string) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  onApplyPreset, 
  ambientSounds,
  aiSearchTrigger,
  setAiSearchTrigger
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '¡Hola! Soy tu **Asistente Cyber-Radio de Dreamscape**. Puedo diseñar atmósferas personalizadas de música electrónica y ambientes para ti.\n\nEscríbeme algo como:\n*   *"Quiero una sesión de melancólico Techno Chill a 90 BPM con lluvia y sonidos de tren nocturno"* \n*   *"Genera un viaje futurista en Tokio de noche con luces de neón"*',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesFeedRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll on new messages container ONLY
  useEffect(() => {
    if (messagesFeedRef.current) {
      messagesFeedRef.current.scrollTop = messagesFeedRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Intercept search requests sent from top bar search form
  useEffect(() => {
    if (aiSearchTrigger && aiSearchTrigger.trim()) {
      const promptText = aiSearchTrigger;
      // Reset trigger state immediately
      setAiSearchTrigger?.('');
      
      const triggerSend = async () => {
        const userMsg: ChatMessage = {
          id: Math.random().toString(),
          role: 'user',
          text: promptText,
          timestamp: new Date().toLocaleTimeString(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);

        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: promptText, history: [...messages, userMsg] }),
          });

          if (!response.ok) throw new Error('API server disconnect');
          const data = await response.json();

          const assistantMsg: ChatMessage = {
            id: Math.random().toString(),
            role: 'model',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString(),
            suggestedPreset: data.preset || undefined,
          };

          setMessages((prev) => [...prev, assistantMsg]);
        } catch (err) {
          console.error('API query failure', err);
          setMessages((prev) => [
            ...prev,
            {
              id: Math.random().toString(),
              role: 'model',
              text: 'Disculpa, hubo una desconexión en mis canales cibernéticos al procesar tu búsqueda. Por favor, inténtalo de nuevo.',
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        } finally {
          setLoading(false);
        }
      };

      triggerSend();
    }
  }, [aiSearchTrigger]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, history: messages }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from server');
      }

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        role: 'model',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString(),
        suggestedPreset: data.preset || undefined,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: 'model',
          text: 'Disculpa, hubo una desconexión en mis canales cibernéticos. Por favor, inténtalo de nuevo.',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (preset: any) => {
    if (!preset) return;
    onApplyPreset({
      bpm: preset.bpm || 95,
      intensity: preset.intensity || 5,
      ambientVolumes: preset.ambientVolumes || {},
      synthPreset: preset.synthPreset || 'warm-pad',
      title: preset.title || 'Mezcla generada por IA',
    });
  };

  return (
    <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800/60 backdrop-blur-md flex flex-col h-[520px]" id="ai-assistant-panel">
      {/* Title Header */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/25">
            <Sparkles size={16} />
          </div>
          <div>
            <h2 className="font-sans font-medium text-slate-100 text-sm sm:text-base">Guía Musical de IA</h2>
            <p className="text-[10px] text-slate-400 font-sans">Escribe tu estado de ánimo para una mezcla adaptada</p>
          </div>
        </div>
        <span className="font-mono text-[9px] bg-purple-950/80 text-purple-400 px-2.5 py-1 rounded-full border border-purple-800/50">
          GEMINI 3.5 FLASH
        </span>
      </div>

      {/* Messages Feed */}
      <div ref={messagesFeedRef} className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`} id={`chat-msg-${msg.id}`}>
            <span className="text-[10px] text-slate-500 mb-1 font-mono px-1">
              {msg.role === 'user' ? 'TÚ' : 'SISTEMA IA'} · {msg.timestamp}
            </span>
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-sans leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-purple-600/20 text-purple-100 hover:bg-purple-600/30 border border-purple-500/35 rounded-tr-none shadow-md shadow-purple-950/20'
                  : 'bg-slate-950/80 text-slate-200 border border-slate-800 rounded-tl-none'
              }`}
            >
              {/* Basic markdown lists representation for clean visual layouts */}
              <div className="space-y-1.5 whitespace-pre-wrap">
                {msg.text.split('\n').map((line, lidx) => {
                  if (line.startsWith('* ')) {
                    return (
                      <div key={lidx} className="flex items-start gap-1.5 pl-1.5 mt-1">
                        <ChevronRight size={10} className="text-cyan-400 mt-1 flex-shrink-0" />
                        <span>{line.replace('* ', '')}</span>
                      </div>
                    );
                  }
                  return <p key={lidx}>{line}</p>;
                })}
              </div>

              {/* Action preset card if suggested by the assistant backend */}
              {msg.suggestedPreset && (
                <div className="mt-4 p-3 bg-purple-950/30 border border-purple-500/40 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[9px] tracking-wider text-purple-400 uppercase">Preset de atmósfera cargado</p>
                      <h4 className="font-sans font-medium text-purple-200 text-xs mt-0.5">{msg.suggestedPreset.title}</h4>
                    </div>
                    <span className="text-[10px] text-purple-300 font-mono font-medium">{msg.suggestedPreset.bpm} BPM</span>
                  </div>
                  <p className="text-[10px] text-slate-300 font-sans italic">“{msg.suggestedPreset.description}”</p>
                  
                  <div className="text-[10px] text-slate-400 bg-slate-900/60 p-2 rounded-md border border-slate-850/60 space-y-1">
                    <p className="font-semibold text-slate-300 font-mono">Modulaciones sugeridas:</p>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1 font-sans">
                      <div>Género: <span className="text-purple-300">{msg.suggestedPreset.genre}</span></div>
                      <div>Sintetizador: <span className="text-cyan-400">{msg.suggestedPreset.synthPreset}</span></div>
                      {Object.entries(msg.suggestedPreset.ambientVolumes || {}).map(([key, val]) => (
                        <div key={key} className="capitalize">
                          {key}: <span className="text-slate-200">{Math.round((val as number) * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => loadPreset(msg.suggestedPreset)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-400 hover:from-purple-600 hover:to-cyan-500 text-slate-950 font-sans font-semibold py-2 px-3.5 rounded-lg text-[11px] uppercase tracking-wide shadow-lg shadow-purple-500/10 transition-all active:scale-[0.98]"
                    id={`btn-load-preset-${msg.id}`}
                  >
                    <Play size={11} fill="currentColor" />
                    Aplicar atmósfera de IA en cabina
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px] px-1 py-1">
            <Loader2 size={12} className="animate-spin text-purple-400" />
            <span>SISTEMA DE PREALIMENTACIÓN IA SINTETIZANDO...</span>
          </div>
        )}
      </div>

      {/* Suggested quick Prompts pills */}
      <div className="flex flex-wrap gap-1.5 my-2.5" id="suggested-prompts-row">
        <button
          onClick={() => setInput('Estudiando en Tokio de noche bajo la lluvia')}
          className="text-[9px] font-sans bg-slate-900 text-slate-450 hover:text-cyan-400 border border-slate-800/80 hover:border-cyan-500/30 py-1 px-2.5 rounded-full transition-colors"
        >
          🌧️ Lluvia Tokio
        </button>
        <button
          onClick={() => setInput('Viaje interplanetario minimalista')}
          className="text-[9px] font-sans bg-slate-900 text-slate-450 hover:text-cyan-400 border border-slate-800/80 hover:border-cyan-500/30 py-1 px-2.5 rounded-full transition-colors"
        >
          🚀 Cosmos Minimalista
        </button>
        <button
          onClick={() => setInput('Paseo meditativo por el bosque con viento suave')}
          className="text-[9px] font-sans bg-slate-900 text-slate-450 hover:text-cyan-400 border border-slate-800/80 hover:border-cyan-500/30 py-1 px-2.5 rounded-full transition-colors"
        >
          🌲 Bosque Zen
        </button>
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleSend} className="flex gap-2" id="chat-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe una atmósfera para que la IA la sintonice..."
          className="flex-1 bg-slate-950/80 border border-slate-850 focus:border-purple-500/70 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-sans"
          id="chat-input"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-slate-100 p-2.5 rounded-xl border border-purple-500/25 transition-all flex items-center justify-center disabled:cursor-not-allowed"
          id="btn-send-chat"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
