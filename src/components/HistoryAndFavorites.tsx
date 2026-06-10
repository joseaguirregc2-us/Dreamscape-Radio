import React, { useState } from 'react';
import { TrackPreset, SavedMix, AmbientSound } from '../types';
import { globalAudioEngine } from '../audioEngine';
import {
  Search,
  SlidersHorizontal,
  Bookmark,
  Share2,
  Heart,
  Globe,
  Radio,
  Sliders,
  Flame,
  Plus,
  Play,
  CheckCircle,
} from 'lucide-react';

interface HistoryAndFavoritesProps {
  tracks: TrackPreset[];
  setTracks: React.Dispatch<React.SetStateAction<TrackPreset[]>>;
  favorites: { tracks: string[]; mixes: string[] };
  setFavorites: React.Dispatch<React.SetStateAction<{ tracks: string[]; mixes: string[] }>>;
  ambientSounds: AmbientSound[];
  setAmbientSounds: React.Dispatch<React.SetStateAction<AmbientSound[]>>;
  onApplyPreset: (preset: any) => void;
  currentBPM: number;
}

export const HistoryAndFavorites: React.FC<HistoryAndFavoritesProps> = ({
  tracks,
  setTracks,
  favorites,
  setFavorites,
  ambientSounds,
  setAmbientSounds,
  onApplyPreset,
  currentBPM,
}) => {
  // Discovery selection filtering
  const [activeTab, setActiveTab] = useState<'explorar' | 'favoritos' | 'comunidad'>('explorar');
  const [genreFilter, setGenreFilter] = useState<string>('todos');
  const [energyFilter, setEnergyFilter] = useState<number | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Social sharing states
  const [shareName, setShareName] = useState('');
  const [shareDesc, setShareDesc] = useState('');
  const [sharingActive, setSharingActive] = useState(false);
  const [sharedAlert, setSharedAlert] = useState(false);

  // Simulated live community database shared mixes
  const [sharedMixes, setSharedMixes] = useState<SavedMix[]>([
    {
      id: 'com-1',
      name: 'Tormenta Eléctrica en Berlín',
      description: 'Techno profundo bajo una tormenta alemana, bajos pesados con truenos intensos.',
      basePresetId: 'metropolis',
      bpm: 104,
      ambientVolumes: {
        rain: 0.8,
        thunder: 0.9,
        wind: 0.3,
        forest: 0,
        waves: 0,
        fire: 0,
        city: 0.45,
        train: 0,
        coffee: 0,
        space: 0,
      },
      likes: 142,
      creator: '@CyberHollow',
    },
    {
      id: 'com-2',
      name: 'Tranquilidad Interestelar',
      description: 'Drone espacial con olas de fondo a 84 bpm. Perfecto para conciliar el sueño.',
      basePresetId: 'stellar',
      bpm: 84,
      ambientVolumes: {
        rain: 0,
        thunder: 0,
        wind: 0.2,
        forest: 0,
        waves: 0.7,
        fire: 0,
        city: 0,
        train: 0,
        coffee: 0,
        space: 0.9,
      },
      likes: 98,
      creator: '@AuroraSeeker',
    },
    {
      id: 'com-3',
      name: 'Café Lluvia en Kyoto',
      description: 'Lluvia suave en las cafeterías tradicionales de madera con melodía orgánica chill.',
      basePresetId: 'seoul',
      bpm: 91,
      ambientVolumes: {
        rain: 0.65,
        thunder: 0,
        wind: 0,
        forest: 0,
        waves: 0,
        fire: 0,
        city: 0.2,
        train: 0,
        coffee: 0.75,
        space: 0,
      },
      likes: 83,
      creator: '@ZenCoder',
    },
  ]);

  // Click handler to load a track preset in global cabina
  const loadTrack = (track: TrackPreset) => {
    // Generate default ambient levels to fit track feel
    onApplyPreset({
      bpm: track.bpm,
      intensity: track.intensity,
      synthPreset: track.synthPreset,
      title: track.title,
      ambientVolumes: {
        space: track.ambientLevel > 6 ? 0.35 : 0,
        rain: track.genre.includes('Deep') || track.title.toLowerCase().includes('rain') ? 0.4 : 0,
      },
    });
  };

  // Toggle favorite tracking ID lists
  const toggleFavoriteTrack = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFav = favorites.tracks.includes(id);
    const updated = isFav
      ? favorites.tracks.filter((t) => t !== id)
      : [...favorites.tracks, id];
    setFavorites({ ...favorites, tracks: updated });
  };

  const toggleFavoriteMix = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFav = favorites.mixes.includes(id);
    const updated = isFav
      ? favorites.mixes.filter((m) => m !== id)
      : [...favorites.mixes, id];
    setFavorites({ ...favorites, mixes: updated });
  };

  // Upvote/like count community sets
  const likeMix = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSharedMixes((prev) =>
      prev.map((mix) => (mix.id === id ? { ...mix, likes: mix.likes + 1 } : mix))
    );
  };

  // Load community mixer configuration
  const loadCommunityMix = (mix: SavedMix) => {
    // 1. apply bpm, presets
    onApplyPreset({
      bpm: mix.bpm,
      intensity: 5,
      synthPreset: 'warm-pad',
      title: mix.name,
      ambientVolumes: mix.ambientVolumes,
    });
  };

  // Click share handler to create live social mix
  const handleShareCurrentMix = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareName.trim()) return;

    // Build ambientVolumes object reflecting actual current active values
    const vols: any = {};
    ambientSounds.forEach((s) => {
      vols[s.type] = s.active ? s.volume : 0;
    });

    const newMix: SavedMix = {
      id: `custom-${Date.now()}`,
      name: shareName,
      description: shareDesc || 'Mezcla cibernética personalizada de Dreamscape',
      basePresetId: 'custom',
      bpm: currentBPM,
      ambientVolumes: vols,
      likes: 1,
      creator: '@Tú',
      isCustom: true,
    };

    // Add to community mixes & update active tab to verify
    setSharedMixes((prev) => [newMix, ...prev]);
    
    // Save to user favorites too!
    setFavorites((prev) => ({
      ...prev,
      mixes: [...prev.mixes, newMix.id],
    }));

    setShareName('');
    setShareDesc('');
    setSharingActive(false);
    setSharedAlert(true);
    setTimeout(() => setSharedAlert(false), 3500);
    setActiveTab('comunidad');
  };

  // Filtered tracks selector
  const filteredTracks = tracks.filter((track) => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          track.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          track.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = genreFilter === 'todos' || track.genre === genreFilter;
    const matchesEnergy = energyFilter === 'todos' || track.energy === energyFilter;
    return matchesSearch && matchesGenre && matchesEnergy;
  });

  return (
    <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800/60 backdrop-blur-md flex flex-col space-y-4" id="discovery-panel">
      
      {/* TABS SELECTOR */}
      <div className="flex border-b border-slate-800/80 pb-1 gap-1" id="nav-tabs">
        <button
          onClick={() => setActiveTab('explorar')}
          className={`flex items-center gap-1.5 px-4 py-2 font-sans text-xs font-semibold uppercase tracking-wider relative transition-colors ${
            activeTab === 'explorar' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio size={13} />
          Explorar Canales
          {activeTab === 'explorar' && (
            <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-cyan-400" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('favoritos')}
          className={`flex items-center gap-1.5 px-4 py-2 font-sans text-xs font-semibold uppercase tracking-wider relative transition-colors ${
            activeTab === 'favoritos' ? 'text-pink-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark size={13} />
          Mis Guardados
          {activeTab === 'favoritos' && (
            <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-pink-400" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('comunidad')}
          className={`flex items-center gap-1.5 px-4 py-2 font-sans text-xs font-semibold uppercase tracking-wider relative transition-colors ${
            activeTab === 'comunidad' ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe size={13} />
          Red Popular
          {activeTab === 'comunidad' && (
            <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-purple-400" />
          )}
        </button>
      </div>

      {sharedAlert && (
        <div className="bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 p-3 rounded-lg flex items-center gap-2.5 text-xs font-sans">
          <CheckCircle size={15} />
          <span>¡Mezcla compartida con éxito! Se ha añadido a tu Red Popular y Mis Guardados.</span>
        </div>
      )}

      {/* RENDER TAB 1: EXPLORAR CANALES */}
      {activeTab === 'explorar' && (
        <div className="space-y-4" id="explore-tab-content">
          {/* SEARCH & FILTERS */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
              <input
                type="text"
                placeholder="Buscar pistas, ritmos, estados de ánimo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-850 px-9 py-2 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400/40"
              />
            </div>
            <div className="flex gap-1.5">
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="bg-slate-950/80 border border-slate-850 text-slate-300 text-xs py-2 px-3 rounded-xl focus:outline-none"
              >
                <option value="todos">Todos los géneros</option>
                <option value="Techno Chill">Techno Chill</option>
                <option value="Ambient Techno">Ambient Techno</option>
                <option value="Deep Techno">Deep Techno</option>
                <option value="Dub Techno">Dub Techno</option>
                <option value="Melodic Techno">Melodic Techno</option>
                <option value="Organic House">Organic House</option>
              </select>
            </div>
          </div>

          {/* TRACKS LIST */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {filteredTracks.map((track) => {
              const isFav = favorites.tracks.includes(track.id);
              return (
                <div
                  key={track.id}
                  onClick={() => loadTrack(track)}
                  className="flex items-center justify-between p-3 bg-slate-950/40 hover:bg-slate-950/85 border border-slate-850 hover:border-slate-800/80 rounded-xl transition-all cursor-pointer group"
                  id={`track-exp-${track.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-2.5 rounded-lg bg-cyan-600/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all flexitems-center justify-center">
                      <Play size={14} fill="currentColor" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-sans font-medium text-slate-200 text-xs sm:text-sm group-hover:text-cyan-400 transition-colors">
                          {track.title}
                        </h4>
                        {track.isPopular && (
                          <span className="flex items-center gap-0.5 text-[8px] bg-red-950 text-red-400 px-1.5 py-0.5 rounded font-mono uppercase tracking-widest">
                            <Flame size={8} fill="currentColor" /> POP
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5 sm:mt-1">
                        {track.genre} · {track.bpm} BPM · {track.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => toggleFavoriteTrack(track.id, e)}
                      className={`p-2 rounded-lg border transition-all ${
                        isFav
                          ? 'bg-pink-500/10 border-pink-500/40 text-pink-400'
                          : 'bg-transparent border-slate-850 text-slate-500 hover:text-slate-350 hover:border-slate-800'
                      }`}
                    >
                      <Heart size={12} fill={isFav ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredTracks.length === 0 && (
              <p className="text-center font-sans text-xs text-slate-500 py-6">
                No se encontraron canales que coincidan con estos filtros.
              </p>
            )}
          </div>
        </div>
      )}

      {/* RENDER TAB 2: MIS FAVORITOS & AUTO GUARDADOS */}
      {activeTab === 'favoritos' && (
        <div className="space-y-4" id="favorites-tab-content">
          <div>
            <h3 className="font-sans font-medium text-slate-200 text-xs uppercase tracking-wider mb-2">Canales Favoritos</h3>
            <div className="space-y-2">
              {tracks
                .filter((t) => favorites.tracks.includes(t.id))
                .map((track) => (
                  <div
                    key={track.id}
                    onClick={() => loadTrack(track)}
                    className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-850 rounded-xl cursor-pointer hover:bg-slate-950/90 transition-all"
                  >
                    <div>
                      <h4 className="font-sans font-medium text-slate-200 text-xs sm:text-sm">{track.title}</h4>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                        {track.genre} · {track.bpm} BPM
                      </p>
                    </div>
                    <button
                      onClick={(e) => toggleFavoriteTrack(track.id, e)}
                      className="p-1.5 text-pink-400 bg-pink-500/10 border border-pink-500/30 rounded"
                    >
                      <Heart size={11} fill="currentColor" />
                    </button>
                  </div>
                ))}
              {tracks.filter((t) => favorites.tracks.includes(t.id)).length === 0 && (
                <p className="text-[10px] text-slate-500 font-sans p-1">No has guardado ningún canal aún.</p>
              )}
            </div>
          </div>

          <div className="border-t border-slate-800/60 pt-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-sans font-medium text-slate-200 text-xs uppercase tracking-wider">Sesiones & Mezclas Compartidas</h3>
              <button
                onClick={() => setSharingActive(true)}
                className="flex items-center gap-1.5 text-[10.5px] font-sans font-semibold border border-purple-500/35 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 py-1 px-2.5 rounded-lg transition-colors"
                id="btn-save-current-mix"
              >
                <Plus size={11} /> Compartir Mi Mezcla
              </button>
            </div>

            {/* User mix share dialog drawer */}
            {sharingActive && (
              <form onSubmit={handleShareCurrentMix} className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3 mb-3 animate-fade-in">
                <span className="block text-[9px] font-mono text-purple-400 uppercase tracking-widest">PUBLICAR MEZCLA ACTUAL EN LA RED</span>
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    maxLength={35}
                    placeholder="Escribe el nombre de tu sesión de sonido"
                    value={shareName}
                    onChange={(e) => setShareName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
                  />
                  <input
                    type="text"
                    maxLength={100}
                    placeholder="Escribe una breve descripción temática de la mezcla"
                    value={shareDesc}
                    onChange={(e) => setShareDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div className="flex justify-end gap-2 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setSharingActive(false)}
                    className="border border-slate-800 hover:bg-slate-900 px-3 py-1.5 rounded font-sans text-slate-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-500 hover:border-purple-400 border border-purple-500/20 text-slate-100 px-4.5 py-1.5 rounded font-sans font-semibold"
                  >
                    Confirmar Publicación
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {sharedMixes
                .filter((mix) => favorites.mixes.includes(mix.id) || mix.creator === '@Tú')
                .map((mix) => (
                  <div
                    key={mix.id}
                    onClick={() => loadCommunityMix(mix)}
                    className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-850 rounded-xl cursor-pointer hover:bg-slate-950/90 transition-all"
                  >
                    <div>
                      <h4 className="font-sans font-medium text-slate-200 text-xs sm:text-sm">{mix.name}</h4>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                        {mix.bpm} BPM · {mix.creator}
                      </p>
                    </div>
                    <button
                      onClick={(e) => toggleFavoriteMix(mix.id, e)}
                      className="p-1.5 text-pink-400 bg-pink-500/10 border border-pink-500/30 rounded"
                    >
                      <Bookmark size={11} fill="currentColor" />
                    </button>
                  </div>
                ))}
              {sharedMixes.filter((mix) => favorites.mixes.includes(mix.id) || mix.creator === '@Tú').length === 0 && (
                <p className="text-[10px] text-slate-500 font-sans p-1">No has archivado mezclas ambientales aún.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RENDER TAB 3: DISK COMPARTIDO POR LA COMUNIDAD (RATING RANK) */}
      {activeTab === 'comunidad' && (
        <div className="space-y-3" id="community-tab-content">
          <div className="flex items-center justify-between pb-1.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Estaciones de Soundscapes Populares</span>
            <span className="text-[9px] font-sans bg-emerald-500/10 text-emerald-400 py-0.5 px-2.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
              ● Red descentralizada
            </span>
          </div>

          <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {sharedMixes
              .sort((a, b) => b.likes - a.likes)
              .map((mix, idx) => (
                <div
                  key={mix.id}
                  onClick={() => loadCommunityMix(mix)}
                  className="p-3 bg-slate-950/50 border border-slate-850 hover:border-slate-800 rounded-xl cursor-pointer flex justify-between items-start group hover:bg-slate-950/90 transition-all"
                  id={`comp-mix-${mix.id}`}
                >
                  <div className="flex gap-2">
                    <div className="font-mono text-xs text-purple-400/75 w-5 pt-0.5 text-center font-bold">
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-sans font-medium text-slate-200 text-xs sm:text-sm group-hover:text-purple-400 transition-colors">
                        {mix.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                        {mix.creator} · {mix.bpm} BPM · {mix.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => likeMix(mix.id, e)}
                      className="flex items-center gap-1 py-1 px-2 border border-slate-850 bg-slate-900 rounded group-hover:border-purple-500/25 transition-colors text-[10px] text-slate-400 hover:text-purple-400"
                    >
                      <Heart size={10} fill="currentColor" className="text-red-500/80" />
                      <span>{mix.likes}</span>
                    </button>
                    <button
                      onClick={(e) => toggleFavoriteMix(mix.id, e)}
                      className={`p-1.5 rounded border ${
                        favorites.mixes.includes(mix.id)
                          ? 'bg-pink-500/10 border-pink-500/40 text-pink-400'
                          : 'border-slate-850 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Bookmark size={10} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
