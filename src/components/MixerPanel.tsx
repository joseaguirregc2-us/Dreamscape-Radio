import React from 'react';
import { AmbientSound, AmbientSoundType } from '../types';
import { globalAudioEngine } from '../audioEngine';
import {
  CloudRain,
  CloudLightning,
  Wind,
  Trees,
  Waves,
  Flame,
  Building2,
  Train,
  Coffee,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface MixerPanelProps {
  ambientSounds: AmbientSound[];
  setAmbientSounds: React.Dispatch<React.SetStateAction<AmbientSound[]>>;
}

export const MixerPanel: React.FC<MixerPanelProps> = ({ ambientSounds, setAmbientSounds }) => {
  const [musicVol, setMusicVol] = React.useState<number>(() => globalAudioEngine.getMusicVolume());

  const handleToggle = (type: AmbientSoundType) => {
    const updated = ambientSounds.map((sound) => {
      if (sound.type === type) {
        const nextActive = !sound.active;
        // Apply instantly to audio engine
        globalAudioEngine.setAmbientVolume(type, nextActive ? sound.volume : 0);
        return { ...sound, active: nextActive };
      }
      return sound;
    });
    setAmbientSounds(updated);
  };

  const handleVolumeChange = (type: AmbientSoundType, volume: number) => {
    const updated = ambientSounds.map((sound) => {
      if (sound.type === type) {
        // If active, apply instantly to audio engine
        if (sound.active) {
          globalAudioEngine.setAmbientVolume(type, volume);
        }
        return { ...sound, volume };
      }
      return sound;
    });
    setAmbientSounds(updated);
  };

  const handleMusicVolumeChange = (vol: number) => {
    setMusicVol(vol);
    globalAudioEngine.setMusicVolume(vol);
  };

  const getIcon = (type: AmbientSoundType) => {
    const size = 18;
    switch (type) {
      case 'rain':
        return <CloudRain size={size} className="text-cyan-400" />;
      case 'thunder':
        return <CloudLightning size={size} className="text-yellow-400" />;
      case 'wind':
        return <Wind size={size} className="text-teal-400" />;
      case 'forest':
        return <Trees size={size} className="text-emerald-400" />;
      case 'waves':
        return <Waves size={size} className="text-blue-400" />;
      case 'fire':
        return <Flame size={size} className="text-orange-500" />;
      case 'city':
        return <Building2 size={size} className="text-pink-500" />;
      case 'train':
        return <Train size={size} className="text-indigo-400" />;
      case 'coffee':
        return <Coffee size={size} className="text-amber-500" />;
      case 'space':
        return <Sparkles size={size} className="text-purple-400" />;
    }
  };

  return (
    <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800/60 backdrop-blur-md" id="mixer-panel-card">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <div>
          <h2 className="font-sans font-medium text-slate-100 flex items-center gap-2">
            <Volume2 size={18} className="text-cyan-400" />
            Mezclador de Ambientes
          </h2>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">
            Superpón capas climáticas con controles independientes
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2 bg-slate-950/80 py-1 rounded-md border border-slate-800/60 font-mono text-[9px] text-cyan-400 tracking-wider uppercase">
          Procedural synth API
        </div>
      </div>

      {/* Revolutionary Main Synthesizer / Music Volume Controller */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-950/30 via-slate-950/60 to-indigo-950/30 border border-purple-500/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_0_15px_rgba(168,85,247,0.03)]" id="music-master-vol-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Sparkles size={16} className="animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-sans font-semibold text-slate-200 tracking-wide block">Volumen de la Música AI</span>
              <span className="text-[10px] text-purple-300 font-mono tracking-normal">Sintetizador &amp; Beats (BPM Reactivo)</span>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/5 px-2 py-0.5 rounded border border-purple-500/10 shadow-[0_0_8px_rgba(168,85,247,0.15)]">
            {Math.round(musicVol * 100)}%
          </span>
        </div>
        <div className="flex items-center gap-3">
          <VolumeX size={13} className="text-purple-450/60" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={musicVol}
            onChange={(e) => handleMusicVolumeChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-purple-500 focus:outline-none hover:accent-purple-400 transition-all duration-300 shadow-[0_0_4px_rgba(168,85,247,0.3)]"
            id="music-master-volume-slider"
          />
          <Volume2 size={13} className="text-purple-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4" id="ambient-sounds-grid">
        {ambientSounds.map((sound) => (
          <div
            key={sound.type}
            className={`flex flex-col p-3 rounded-lg border transition-all duration-300 ${
              sound.active
                ? 'bg-slate-950/90 border-slate-700/60 shadow-md shadow-slate-950/50'
                : 'bg-slate-950/30 border-slate-900/60 opacity-60 hover:opacity-80'
            }`}
            id={`mixer-item-${sound.type}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-md ${sound.active ? 'bg-slate-900' : 'bg-transparent'}`}>
                  {getIcon(sound.type)}
                </div>
                <span className="text-xs font-sans font-medium text-slate-200">{sound.label}</span>
              </div>
              <button
                onClick={() => handleToggle(sound.type)}
                className={`py-1 px-2.5 rounded-md text-[10px] font-sans font-medium tracking-wide uppercase transition-colors ${
                  sound.active
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 border border-slate-850'
                }`}
                id={`btn-toggle-${sound.type}`}
              >
                {sound.active ? 'Activo' : 'Mudo'}
              </button>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <VolumeX size={12} className="text-slate-500" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={sound.volume}
                disabled={!sound.active}
                onChange={(e) => handleVolumeChange(sound.type, parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-35 disabled:cursor-not-allowed"
                id={`slider-${sound.type}`}
              />
              <span className="font-mono text-[10px] text-slate-400 w-8 text-right">
                {sound.active ? Math.round(sound.volume * 100) : 0}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
