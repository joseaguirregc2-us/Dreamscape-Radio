import React, { useState, useEffect } from 'react';
import { globalAudioEngine } from '../audioEngine';
import { Disc, BatteryCharging, Moon, Sparkles, Sliders, Play, Square, RefreshCw } from 'lucide-react';

interface DJModeProps {
  currentBPM: number;
  setCurrentBPM: (bpm: number) => void;
  currentIntensity: number;
  setCurrentIntensity: (val: number) => void;
}

export const DJMode: React.FC<DJModeProps> = ({
  currentBPM,
  setCurrentBPM,
  currentIntensity,
  setCurrentIntensity,
}) => {
  // DJ Sets State
  const [setDuration, setSetDuration] = useState<number>(0); // 0 = Infinite, other = minutes
  const [energyProfile, setEnergyProfile] = useState<'Chill Drift' | 'Uplifting Wave' | 'Deep Peak'>('Chill Drift');
  const [djActive, setDjActive] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  // Sleep Timer state
  const [sleepTimerActive, setSleepTimerActive] = useState<boolean>(false);
  const [sleepMinutes, setSleepMinutes] = useState<number>(30);
  const [sleepRemaining, setSleepRemaining] = useState<number | null>(null);
  const [gradualFade, setGradualFade] = useState<boolean>(true);

  // DJ energy sweep simulation
  useEffect(() => {
    let interval: any = null;
    if (djActive) {
      interval = setInterval(() => {
        // Slowly drift BPM and intensity depending on chosen profile!
        let nextBpm = currentBPM;
        let nextIntensity = currentIntensity;

        if (energyProfile === 'Chill Drift') {
          // Keep it low and floating: drift BPM between 85 and 95
          nextBpm += (Math.random() - 0.5) * 1.5;
          nextBpm = Math.max(85, Math.min(95, nextBpm));
          nextIntensity = Math.max(2, Math.min(4, Math.round(3 + Math.sin(Date.now() / 60000))));
        } else if (energyProfile === 'Uplifting Wave') {
          // Drive upwards slowly up to 118
          nextBpm += 0.8;
          if (nextBpm > 118) nextBpm = 100;
          nextIntensity = Math.max(5, Math.min(8, Math.round(6 + Math.cos(Date.now() / 40000))));
        } else if (energyProfile === 'Deep Peak') {
          // Heavy immersive frequencies
          nextBpm = 120 + Math.sin(Date.now() / 80000) * 4;
          nextIntensity = 8;
        }

        const roundedBpm = Math.round(nextBpm);
        setCurrentBPM(roundedBpm);
        globalAudioEngine.setBPM(roundedBpm);

        setCurrentIntensity(nextIntensity);
        globalAudioEngine.setIntensity(nextIntensity);

      }, 15000); // adjust variables every 15 seconds
    }
    return () => clearInterval(interval);
  }, [djActive, energyProfile, currentBPM, currentIntensity]);

  // Set Duration countdown
  useEffect(() => {
    let timer: any = null;
    if (djActive && setDuration > 0) {
      if (remainingTime === null) {
        setRemainingTime(setDuration * 60);
      } else if (remainingTime <= 0) {
        setDjActive(false);
        setRemainingTime(null);
        globalAudioEngine.stop();
      } else {
        timer = setTimeout(() => {
          setRemainingTime((prev) => (prev ? prev - 1 : 0));
        }, 1000);
      }
    } else {
      setRemainingTime(null);
    }
    return () => clearTimeout(timer);
  }, [djActive, remainingTime, setDuration]);

  // Sleep Timer countdown
  useEffect(() => {
    let timer: any = null;
    if (sleepTimerActive) {
      if (sleepRemaining === null) {
        setSleepRemaining(sleepMinutes * 60);
      } else if (sleepRemaining <= 0) {
        setSleepTimerActive(false);
        setSleepRemaining(null);
        globalAudioEngine.stop();
      } else {
        timer = setTimeout(() => {
          setSleepRemaining((prev) => {
            if (!prev) return 0;
            const next = prev - 1;
            
            // If gradualFade is enabled, start fading down the master gain on the last 5 minutes!
            if (gradualFade && next < 300) {
              // progressive decrease
              // We simulate gradual fade by updating remaining volumes or overall ambiance
              const fadeRatio = next / 300; // 1 down to 0
              globalAudioEngine.setAmbientLevel(Math.round(fadeRatio * 6));
            }
            return next;
          });
        }, 1000);
      }
    } else {
      setSleepRemaining(null);
    }
    return () => clearTimeout(timer);
  }, [sleepTimerActive, sleepRemaining, sleepMinutes, gradualFade]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleStartDJ = () => {
    setDjActive(true);
    if (!globalAudioEngine.isPlaying()) {
      globalAudioEngine.start();
    }
  };

  const handleStopDJ = () => {
    setDjActive(false);
  };

  return (
    <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800/60 backdrop-blur-md space-y-5" id="dj-mode-panel">
      {/* SECTION 1: DJ ENGINE TIMELINE */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
          <div>
            <h2 className="font-sans font-medium text-slate-100 flex items-center gap-2">
              <Disc size={18} className="text-pink-500 animate-spin-slow" />
              Algoritmo DJ Automático
            </h2>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              Transiciones armónicas y perfiles de energía infinitos
            </p>
          </div>
          {djActive && (
            <span className="flex items-center gap-1.5 px-2 bg-pink-950/80 border border-pink-800/50 rounded text-[9px] text-pink-400 font-mono uppercase tracking-wider">
              En Vivo
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4" id="durations-selector">
          {([30, 60, 120, 240] as const).map((mins) => (
            <button
              key={mins}
              onClick={() => {
                setSetDuration(mins);
                setRemainingTime(mins * 60);
              }}
              className={`py-2 px-3 rounded-lg border text-xs font-sans text-center transition-all ${
                setDuration === mins
                  ? 'bg-pink-500/15 border-pink-500/55 text-pink-400 font-semibold'
                  : 'bg-slate-950/50 border-slate-850 text-slate-300 hover:bg-slate-900'
              }`}
            >
              {mins >= 60 ? `${mins / 60}h` : `${mins} min`}
            </button>
          ))}
          <button
            onClick={() => {
              setSetDuration(0);
              setRemainingTime(null);
            }}
            className={`py-2 px-3 rounded-lg border text-xs font-sans text-center transition-all ${
              setDuration === 0
                ? 'bg-pink-500/15 border-pink-500/55 text-pink-400 font-semibold'
                : 'bg-slate-950/50 border-slate-850 text-slate-300 hover:bg-slate-900'
            }`}
          >
            Infinito
          </button>
        </div>

        {/* Energy Profiles curves */}
        <div className="space-y-2 mb-4">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Ajuste de variación energética:</p>
          <div className="grid grid-cols-3 gap-2" id="energy-profile-buttons">
            {(['Chill Drift', 'Uplifting Wave', 'Deep Peak'] as const).map((prof) => (
              <button
                key={prof}
                onClick={() => setEnergyProfile(prof)}
                className={`py-2 px-1 text-center rounded-lg border text-[10px] font-sans transition-colors ${
                  energyProfile === prof
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 font-semibold'
                    : 'bg-slate-950/30 border-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {prof === 'Chill Drift' ? '🌊 Calmado' : prof === 'Uplifting Wave' ? '🚀 Creciente' : '🌌 Inmersivo'}
              </button>
            ))}
          </div>
        </div>

        {/* DJ State Control Cards */}
        <div className="p-3 bg-slate-950/80 border border-slate-850 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-[10px] h-4 font-mono text-slate-500">
              {djActive ? 'CURVA DE REPRODUCCIÓN EN CURSO' : 'SISTEMA DJ LISTO'}
            </p>
            <h4 className="text-xs font-medium text-slate-300 mt-0.5">
              {energyProfile} · {setDuration === 0 ? 'Sesión Continua' : `${setDuration} minutos`}
            </h4>
            {remainingTime !== null && (
              <p className="text-[11px] font-mono text-pink-400 mt-1">Tiempo restante: {formatTime(remainingTime)}</p>
            )}
          </div>
          <div className="flex gap-1.5">
            {djActive ? (
              <button
                onClick={handleStopDJ}
                className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 transition-colors"
                id="btn-stop-dj"
              >
                <Square size={13} fill="currentColor" />
              </button>
            ) : (
              <button
                onClick={handleStartDJ}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-pink-500 hover:bg-pink-600 text-slate-950 text-xs font-sans font-medium transition-all shadow-md shadow-pink-500/10"
                id="btn-start-dj"
              >
                <Play size={10} fill="currentColor" />
                Mezclar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: TEMPORIZADOR INTELIGENTE (SLEEP TIMER) */}
      <div className="border-t border-slate-800/60 pt-4">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h3 className="font-sans font-medium text-slate-100 flex items-center gap-2 text-xs sm:text-sm">
              <Moon size={16} className="text-cyan-400" />
              Temporizador Inteligente
            </h3>
            <p className="text-[10px] text-slate-400 font-sans">Apagado automático y descenso gradual</p>
          </div>
        </div>

        <div className="space-y-3 font-sans">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-slate-350">Duración del sueño:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                max="240"
                value={sleepMinutes}
                onChange={(e) => setSleepMinutes(Math.max(5, parseInt(e.target.value) || 5))}
                className="w-14 bg-slate-950 border border-slate-850 px-2.5 py-1 text-center rounded font-mono text-xs text-cyan-400"
              />
              <span className="text-xs text-slate-400 font-sans">mins</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-350">Diminución gradual de volumen:</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={gradualFade}
                onChange={() => setGradualFade(!gradualFade)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-slate-950 border border-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-cyan-500/20 peer-checked:after:bg-cyan-400 peer-checked:after:border-cyan-400" />
            </label>
          </div>

          <div className="pt-2">
            {sleepTimerActive ? (
              <div className="flex items-center justify-between p-2.5 bg-slate-950/80 border border-slate-850 rounded-lg">
                <div className="flex items-center gap-2">
                  <Moon size={14} className="text-cyan-400 animate-pulse" />
                  <span className="text-[11px] font-mono text-cyan-400">Apagado en: {sleepRemaining ? formatTime(sleepRemaining) : '...'}</span>
                </div>
                <button
                  onClick={() => setSleepTimerActive(false)}
                  className="text-[10px] text-red-400 border border-red-500/30 px-2 py-1 rounded bg-red-950/10 hover:bg-red-500/20 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSleepTimerActive(true)}
                className="w-full flex items-center justify-center gap-2 border border-slate-850 hover:bg-slate-900 bg-slate-950 py-2.5 rounded-xl text-xs font-medium text-slate-200 transition-colors"
                id="btn-trigger-sleep"
              >
                Activar Modo Sueño
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
