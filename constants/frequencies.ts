import { FrequencyRange } from '../types/audio';

export const MUSICAL_FREQUENCIES = [
  // Sub-bass frequencies (20-60 Hz)
  { freq: 20, note: 'E0', reference: 'Sub-bass' },
  { freq: 40, note: 'E1', reference: 'Deep Bass' },
  
  // Bass frequencies (60-250 Hz)
  { freq: 55, note: 'A1', reference: 'Bass' },
  { freq: 110, note: 'A2', reference: 'Bass' },
  
  // Solfeggio and healing frequencies
  { freq: 174, note: 'F3', reference: '438.48 Hz A' },
  { freq: 285, note: 'C#4', reference: '452.37 Hz A' },
  { freq: 396, note: 'G4', reference: '444.34 Hz A' },
  { freq: 417, note: 'G#4', reference: '441.78 Hz A' },
  { freq: 432, note: 'A4', reference: 'Verdi\'s A' },
  { freq: 440, note: 'A4', reference: 'Concert Pitch' },
  { freq: 528, note: 'C5', reference: '444 Hz A' },
  { freq: 639, note: 'D#5', reference: '451.84 Hz A' },
  { freq: 741, note: 'F#5', reference: '440.60 Hz A' },
  { freq: 852, note: 'G#5', reference: '451.33 Hz A' },
  { freq: 963, note: 'B5', reference: '428.96 Hz A' },
  
  // High-Mid frequencies (2-4 kHz)
  { freq: 2000, note: 'B6', reference: 'Presence' },
  { freq: 3000, note: 'F#7', reference: 'Definition' },
  { freq: 4000, note: 'B7', reference: 'Brilliance' },
  
  // High frequencies (4-10 kHz)
  { freq: 5000, note: 'D#8', reference: 'Clarity' },
  { freq: 6000, note: 'F#8', reference: 'Air' },
  { freq: 7000, note: 'A8', reference: 'Shimmer' },
  { freq: 8000, note: 'B8', reference: 'Sparkle' },
  { freq: 10000, note: 'C#9', reference: 'Crystal' },
  
  // Ultra-high frequencies (10-20 kHz)
  { freq: 12000, note: 'E9', reference: 'Ultra Detail' },
  { freq: 14000, note: 'F#9', reference: 'Ultra Air' },
  { freq: 16000, note: 'G#9', reference: 'Ultra High' },
  { freq: 18000, note: 'A#9', reference: 'Super High' },
  { freq: 20000, note: 'B9', reference: 'Maximum' }
] as const;

export const FREQUENCY_RANGES: FrequencyRange[] = [
  { name: 'Sub Bass', min: 20, max: 60 },
  { name: 'Bass', min: 60, max: 250 },
  { name: 'Low Mids', min: 250, max: 500 },
  { name: 'Mids', min: 500, max: 2000 },
  { name: 'High Mids', min: 2000, max: 4000 },
  { name: 'Presence', min: 4000, max: 6000 },
  { name: 'Brilliance', min: 6000, max: 10000 },
  { name: 'Air', min: 10000, max: 16000 },
  { name: 'Ultra', min: 16000, max: 20000 }
];