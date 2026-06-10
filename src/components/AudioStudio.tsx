import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, 
  Play, 
  Pause, 
  Grid, 
  Cpu, 
  Sliders, 
  Download, 
  Activity, 
  RefreshCw, 
  Mic, 
  Trash2,
  ListRestart
} from 'lucide-react';

interface SequencerTrack {
  id: string;
  name: string;
  color: string;
  steps: boolean[];
  note: number; // MIDI Note
}

export const AudioStudio: React.FC = () => {
  // 16-step sequencer tracks
  const [tracks, setTracks] = useState<SequencerTrack[]>([
    { id: 'kick', name: '🥁 Deep Sub Kick', color: 'bg-cyan-500 border-cyan-400', steps: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false], note: 36 },
    { id: 'hihat', name: '✨ Shimmer Hat', color: 'bg-amber-400 border-amber-300', steps: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false], note: 42 },
    { id: 'bass', name: '🎸 Sub-Bass Line', color: 'bg-fuchsia-500 border-fuchsia-400', steps: [true, false, true, false, false, true, false, true, true, false, true, false, false, true, false, false], note: 48 },
    { id: 'synth', name: '🎹 High Arpeggio', color: 'bg-emerald-400 border-emerald-350', steps: [false, true, false, true, false, true, false, false, false, true, false, true, false, true, false, true], note: 60 },
  ]);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [tempo, setTempo] = useState<number>(94);
  const [bassResonance, setBassResonance] = useState<number>(6.5);
  const [cutoffFreq, setCutoffFreq] = useState<number>(450);
  const [selectedOsc, setSelectedOsc] = useState<'sawtooth' | 'square' | 'triangle'>('sawtooth');
  
  // Exporter statuses
  const [exportingType, setExportingType] = useState<'WAV' | 'MIDI' | 'STEMS' | null>(null);
  const [exportProgress, setExportProgress] = useState<number>(0);
  
  const timerRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Clean play step timer
  useEffect(() => {
    if (isPlaying) {
      const stepDuration = (60 / tempo) / 4 * 1000; // 16th notes
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          const next = (prev + 1) % 16;
          playTriggerStep(next);
          return next;
        });
      }, stepDuration);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, tempo, tracks, bassResonance, cutoffFreq, selectedOsc]);

  const toggleStep = (trackId: string, index: number) => {
    setTracks((prevTracks) =>
      prevTracks.map((t) => {
        if (t.id === trackId) {
          const updatedSteps = [...t.steps];
          updatedSteps[index] = !updatedSteps[index];
          return { ...t, steps: updatedSteps };
        }
        return t;
      })
    );
  };

  const clearGrid = () => {
    setTracks((prevTracks) =>
      prevTracks.map((t) => ({
        ...t,
        steps: Array(16).fill(false),
      }))
    );
    setCurrentStep(0);
  };

  const handleRandomize = () => {
    setTracks((prevTracks) =>
      prevTracks.map((t) => ({
        ...t,
        steps: Array(16).fill(0).map(() => Math.random() > (t.id === 'kick' ? 0.65 : t.id === 'hihat' ? 0.7 : 0.6)),
      }))
    );
    setCurrentStep(0);
  };

  // Play actual sound synthetic notes using Web Audio API!
  const playTriggerStep = (stepIdx: number) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      tracks.forEach((track) => {
        if (track.steps[stepIdx]) {
          // Trigger tailored sounds
          if (track.id === 'kick') {
            // Kick synth
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
            
            gain.gain.setValueAtTime(0.0, now);
            gain.gain.linearRampToValueAtTime(0.5, now + 0.005);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            
            osc.start(now);
            osc.stop(now + 0.3);
          } else if (track.id === 'hihat') {
            // Hihat synth
            const bufferSize = ctx.sampleRate * 0.05;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
              data[i] = Math.random() * 2 - 1;
            }
            
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 7500;
            
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.0, now);
            gain.gain.linearRampToValueAtTime(0.08, now + 0.002);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            noise.start(now);
          } else if (track.id === 'bass') {
            // Configurable Bass Wave oscillator
            const osc = ctx.createOscillator();
            const filter = ctx.createBiquadFilter();
            const gain = ctx.createGain();
            
            osc.type = selectedOsc;
            // MIDI to HZ Conversion
            const pitch = Math.pow(2, (track.note - 69) / 12) * 440;
            osc.frequency.value = pitch;
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(cutoffFreq, now);
            filter.frequency.exponentialRampToValueAtTime(cutoffFreq * 2.2, now + 0.08);
            filter.Q.value = bassResonance;
            
            gain.gain.setValueAtTime(0.0, now);
            gain.gain.linearRampToValueAtTime(0.18, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(now);
            osc.stop(now + 0.22);
          } else if (track.id === 'synth') {
            // Melodic pluck
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            
            // Generate minor chord variations
            const stepPitchModifier = (stepIdx % 3 === 0) ? 0 : (stepIdx % 4 === 1) ? 3 : 7;
            const pitch = Math.pow(2, ((track.note + stepPitchModifier) - 69) / 12) * 440;
            osc.frequency.value = pitch;
            
            gain.gain.setValueAtTime(0.0, now);
            gain.gain.linearRampToValueAtTime(0.12, now + 0.008);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(now);
            osc.stop(now + 0.5);
          }
        }
      });
    } catch {
      // Audio engine fail safe
    }
  };

  // Simulated exporter downloader with active loading logs
  const handleExport = (type: 'WAV' | 'MIDI' | 'STEMS') => {
    if (exportingType) return;
    setExportingType(type);
    setExportProgress(0);

    const interval = setInterval(() => {
      setExportProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            triggerFileDownload(type);
            setExportingType(null);
          }, 350);
          return 100;
        }
        return p + 5;
      });
    }, 100);
  };

  const triggerFileDownload = (type: 'WAV' | 'MIDI' | 'STEMS') => {
    try {
      const element = document.createElement('a');
      const timeTag = new Date().toISOString().slice(0, 10);
      let filename = `dreamscape_composition_${timeTag}.${type.toLowerCase()}`;
      let content = `Dreamscape Audio Studio Composition Export - ${type}\n`;
      content += `Tempo: ${tempo} BPM\n`;
      content += `Estilo: Techno Generativo\n`;
      content += `Oscilador de Bajo: ${selectedOsc}\n`;
      content += `Secuencia de Pasos:\n`;
      tracks.forEach((t) => {
        content += `${t.name}: [${t.steps.map((s) => (s ? 'X' : '.')).join('')}]\n`;
      });

      const file = new Blob([content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = filename;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-[#0a0b10] border border-white/5 rounded-2xl p-6 space-y-6" id="audio-studio-panel">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="text-purple-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Estudio Musical IA Sequencer</h2>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Dibuja patrones de ritmos, afina osciladores analógicos y descarga tus pistas terminadas en formatos profesionales.</p>
        </div>

        {/* Action controllers */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full cursor-pointer font-bold text-xs select-none transition-all ${
              isPlaying 
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                : 'bg-cyan-400 hover:bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.2)]'
            }`}
            id="button-studio-playback"
          >
            {isPlaying ? (
              <>
                <Pause size={13} className="fill-current" />
                Detener Bucle
              </>
            ) : (
              <>
                <Play size={13} className="fill-current" />
                Escuchar Estudio
              </>
            )}
          </button>

          <button
            onClick={handleRandomize}
            className="p-2 rounded-full bg-white/[0.04] text-slate-300 hover:text-white border border-white/5 hover:bg-white/[0.07] transition-all cursor-pointer"
            title="Aleatorizar secuenciador"
            id="btn-studio-random"
          >
            <RefreshCw size={13} />
          </button>

          <button
            onClick={clearGrid}
            className="p-2 rounded-full bg-red-500/10 text-red-400 hover:text-red-300 border border-red-500/20 hover:bg-red-500/15 transition-all cursor-pointer"
            title="Borrar patrón"
            id="btn-studio-clear"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* 16 Step grid sequencer */}
      <div className="bg-[#050608]/90 border border-white/5 rounded-xl p-4 space-y-4" id="studio-grid-box">
        
        {/* Step Numbers Indicators Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4">
          <div className="hidden md:block"></div>
          <div className="grid grid-cols-16 gap-1 md:col-span-4 text-center">
            {Array(16).fill(0).map((_, i) => (
              <div 
                key={i} 
                className={`text-[9px] font-mono font-medium ${
                  currentStep === i ? 'text-cyan-400 scale-120' : 'text-slate-600'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Channels Sequencer Rows */}
        <div className="space-y-3">
          {tracks.map((track) => (
            <div key={track.id} className="grid grid-cols-1 md:grid-cols-5 items-center gap-4" id={`sequencer-row-${track.id}`}>
              {/* Left description */}
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 shrink-0">
                <div className={`w-2 h-2 rounded-full ${track.color.split(' ')[0]}`} />
                <span>{track.name}</span>
              </div>

              {/* 16 interactive step buttons representers */}
              <div className="grid grid-cols-16 gap-1 md:col-span-4">
                {track.steps.map((active, stepIdx) => {
                  const isCurrent = currentStep === stepIdx && isPlaying;
                  const isBarBeat = stepIdx % 4 === 0;

                  return (
                    <button
                      key={stepIdx}
                      onClick={() => toggleStep(track.id, stepIdx)}
                      className={`h-9 md:h-10 rounded-md border text-xs cursor-pointer transition-all flex items-center justify-center relative ${
                        active 
                          ? `${track.color} text-black font-extrabold shadow-[inset_0_1px_3px_rgba(255,255,255,0.4)]` 
                          : isBarBeat
                            ? 'bg-slate-900/40 border-slate-700/60 hover:bg-slate-800/50'
                            : 'bg-black/30 border-white/[0.04] hover:bg-white/[0.05]'
                      } ${isCurrent ? 'ring-1 ring-cyan-400 ring-offset-2 ring-offset-black scale-95' : ''}`}
                      id={`step-${track.id}-${stepIdx}`}
                    >
                      {isCurrent && <div className="absolute inset-0 bg-white/20 animate-pulse rounded-md" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Synth Controls & Parameters Design Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="synth-design-parameters-panel">
        
        {/* Left Section: Frequency parameters */}
        <div className="bg-[#0e1017]/60 p-5 rounded-xl border border-white/5 space-y-4">
          <div className="flex items-center gap-1.5 border-b border-white/[0.05] pb-2">
            <Sliders size={14} className="text-cyan-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Diseño Mecánico de Bajos</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-450 font-sans">Oscilador Base:</span>
                <span className="font-mono text-cyan-400 uppercase text-[10px] font-bold">{selectedOsc}</span>
              </div>
              <div className="flex items-center gap-2">
                {(['sawtooth', 'square', 'triangle'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedOsc(type)}
                    className={`flex-1 text-[10px] py-1 rounded font-mono border uppercase cursor-pointer ${
                      selectedOsc === type 
                        ? 'bg-cyan-500/10 border-cyan-400/50 text-cyan-400 font-bold' 
                        : 'bg-transparent border-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    {type === 'sawtooth' ? 'Sierra' : type === 'square' ? 'Cuadrada' : 'Triángulo'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-450 font-sans">Filtro Cutoff:</span>
                <span className="font-mono text-cyan-300 text-[10px]">{cutoffFreq} Hz</span>
              </div>
              <input
                type="range"
                min="100"
                max="1200"
                step="25"
                value={cutoffFreq}
                onChange={(e) => setCutoffFreq(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1 bg-slate-900 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-450 font-sans">Resonancia (Q):</span>
                <span className="font-mono text-cyan-300 text-[10px]">{bassResonance} Q</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={bassResonance}
                onChange={(e) => setBassResonance(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1 bg-slate-900 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Middle Section: Tempo & Progressions */}
        <div className="bg-[#0e1017]/60 p-5 rounded-xl border border-white/5 space-y-4">
          <div className="flex items-center gap-1.5 border-b border-white/[0.05] pb-2">
            <Activity size={14} className="text-emerald-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Tempo y Progresión</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-450 font-sans">Velocidad del Bucle:</span>
                <span className="font-mono text-emerald-400 text-xs font-bold">{tempo} BPM</span>
              </div>
              <input
                type="range"
                min="60"
                max="140"
                step="1"
                value={tempo}
                onChange={(e) => setTempo(Number(e.target.value))}
                className="w-full accent-emerald-400 h-1 bg-slate-900 rounded-lg cursor-pointer"
              />
              <div className="flex gap-2.5 pt-1">
                {[80, 92, 110, 125].map((presetBPM) => (
                  <button
                    key={presetBPM}
                    onClick={() => setTempo(presetBPM)}
                    className="text-[9px] font-mono bg-[#050608] hover:bg-slate-800 text-slate-400 border border-white/5 rounded px-2 py-0.5 cursor-pointer"
                  >
                    {presetBPM}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-xs text-slate-400 block font-sans">Armonizadores de Escala:</span>
              <p className="text-[10px] bg-emerald-500/10 text-emerald-300 p-2.5 rounded-lg border border-emerald-500/20 leading-relaxed font-sans">
                La cabina bloquea las notas rítmicamente en la escala de <b className="text-emerald-200">Re Menor Frigio (D Phrygian)</b> para garantizar afinidad armónica y evitar disonancias galácticas erráticas.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Pro Audio Exporter Modules */}
        <div className="bg-[#0e1017]/60 p-5 rounded-xl border border-white/5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-1.5 border-b border-white/[0.05] pb-2">
              <Download size={14} className="text-purple-400" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Módulos de Exportación Remota</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans mt-2 leading-relaxed">Sincroniza y descarga las stems MIDI u ondas lineales renderizadas de tu composición para usarlas en Ableton, Logic u otros DAWs.</p>
          </div>

          <div className="space-y-2.5 pt-2">
            {exportingType ? (
              <div className="space-y-2 p-3 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-lg">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-fuchsia-300 font-mono animate-pulse">Renderizando canal {exportingType}...</span>
                  <span className="font-mono text-fuchsia-400 font-bold">{exportProgress}%</span>
                </div>
                <div className="w-full bg-[#050608] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-fuchsia-500 to-pink-500 h-full transition-all duration-100" 
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleExport('WAV')}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-black/40 border border-purple-500/10 hover:border-purple-400/40 text-slate-300 hover:text-white transition-all text-center cursor-pointer font-sans"
                  id="btn-export-wav"
                >
                  <Music size={15} className="text-purple-400 mb-1" />
                  <span className="text-[10px] font-bold">Ondas WAV</span>
                  <span className="text-[8px] text-slate-500 font-mono">Audio</span>
                </button>

                <button
                  onClick={() => handleExport('MIDI')}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-black/40 border border-purple-500/10 hover:border-purple-400/40 text-slate-300 hover:text-white transition-all text-center cursor-pointer font-sans"
                  id="btn-export-midi"
                >
                  <Cpu size={15} className="text-pink-400 mb-1" />
                  <span className="text-[10px] font-bold">Bucle MIDI</span>
                  <span className="text-[8px] text-slate-500 font-mono">Notas</span>
                </button>

                <button
                  onClick={() => handleExport('STEMS')}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-black/40 border border-purple-500/10 hover:border-purple-400/40 text-slate-300 hover:text-white transition-all text-center cursor-pointer font-sans"
                  id="btn-export-stems"
                >
                  <Grid size={15} className="text-cyan-400 mb-1" />
                  <span className="text-[10px] font-bold">Stems CJS</span>
                  <span className="text-[8px] text-slate-500 font-mono">Pistas</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
