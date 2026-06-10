export type AmbientSoundType =
  | 'rain'
  | 'thunder'
  | 'wind'
  | 'forest'
  | 'waves'
  | 'fire'
  | 'city'
  | 'train'
  | 'coffee'
  | 'space';

export interface AmbientSound {
  type: AmbientSoundType;
  label: string;
  volume: number; // 0.0 to 1.0
  active: boolean;
}

export interface TrackPreset {
  id: string;
  title: string;
  genre: 'Techno Chill' | 'Ambient Techno' | 'Deep Techno' | 'Dub Techno' | 'Melodic Techno' | 'Organic House';
  bpm: number;
  energy: number; // 1 to 5
  intensity: number; // 1 to 10
  bassDepth: number; // 1 to 10
  ambientLevel: number; // 1 to 10
  synthPreset: string; // 'warm-pad' | 'plucky' | 'cosmic' | 'deep-drone'
  chordProgression: number[][]; // Array of midi notes e.g., [[60, 64, 67], ...]
  description: string;
  isPopular?: boolean;
  createdAt: string;
}

export interface ListeningMode {
  id: string;
  name: string;
  description: string;
  bpm: number;
  intensity: number;
  bassDepth: number;
  ambientLevel: number;
  energy: number;
  synthPreset: string;
  ambientPresetVolumes: Partial<Record<AmbientSoundType, number>>;
}

export interface SavedMix {
  id: string;
  name: string;
  description: string;
  basePresetId: string;
  bpm: number;
  ambientVolumes: Record<AmbientSoundType, number>;
  likes: number;
  creator: string;
  isCustom?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  suggestedPreset?: {
    title: string;
    description: string;
    genre: string;
    bpm: number;
    intensity: number;
    ambientVolumes: Partial<Record<AmbientSoundType, number>>;
    synthPreset: string;
  };
}

export interface UserProfile {
  username: string;
  isPremium: boolean;
  favorites: {
    tracks: string[]; // TrackPreset IDs
    mixes: string[]; // SavedMix IDs
  };
  listenedHours: number;
  favoriteGenre: string;
  avgBPM: number;
  streakDays: number;
}
