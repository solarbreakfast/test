import { AudioState } from '../types/audio';
import { Radio, Speaker, Disc, Waves, Headphones, Zap, Volume2, Music2, Mic2, Gauge } from 'lucide-react';

export interface Preset {
  id: string;
  name: string;
  state: AudioState;
  category: 'amp' | 'effect';
  Icon: typeof Radio | typeof Speaker | typeof Disc | typeof Waves | typeof Headphones | typeof Zap | typeof Volume2 | typeof Music2 | typeof Mic2 | typeof Gauge;
}

export const PRESETS: Preset[] = [
  {
    id: 'vintage-tube',
    name: 'Tube',
    category: 'amp',
    Icon: Speaker,
    state: {
      tempo: 1.0,
      pitch: 0,
      frequency: 3200,
      volume: 130,
      noise: 5,
      echo: 0
    }
  },
  {
    id: 'solid-state',
    name: 'State',
    category: 'amp',
    Icon: Radio,
    state: {
      tempo: 1.0,
      pitch: 0,
      frequency: 8000,
      volume: 150,
      noise: 1,
      echo: 0
    }
  },
  {
    id: 'british-stack',
    name: 'Stack',
    category: 'amp',
    Icon: Volume2,
    state: {
      tempo: 1.0,
      pitch: 0,
      frequency: 4500,
      volume: 160,
      noise: 8,
      echo: 5
    }
  },
  {
    id: 'class-a',
    name: 'Class A',
    category: 'amp',
    Icon: Gauge,
    state: {
      tempo: 1.0,
      pitch: 0,
      frequency: 2800,
      volume: 140,
      noise: 3,
      echo: 0
    }
  },
  {
    id: 'high-gain',
    name: 'Hi-Gain',
    category: 'amp',
    Icon: Zap,
    state: {
      tempo: 1.0,
      pitch: 0,
      frequency: 6000,
      volume: 180,
      noise: 12,
      echo: 8
    }
  },
  {
    id: 'boutique',
    name: 'Boutique',
    category: 'amp',
    Icon: Music2,
    state: {
      tempo: 1.0,
      pitch: 0,
      frequency: 3800,
      volume: 135,
      noise: 2,
      echo: 0
    }
  },
  {
    id: 'console',
    name: 'Console',
    category: 'amp',
    Icon: Mic2,
    state: {
      tempo: 1.0,
      pitch: 0,
      frequency: 5200,
      volume: 145,
      noise: 4,
      echo: 0
    }
  },
  {
    id: 'tape-saturation',
    name: 'Tape',
    category: 'effect',
    Icon: Disc,
    state: {
      tempo: 0.985,
      pitch: -0.5,
      frequency: 2800,
      volume: 125,
      noise: 12,
      echo: 15
    }
  },
  {
    id: 'radio',
    name: 'Radio',
    category: 'effect',
    Icon: Waves,
    state: {
      tempo: 1.0,
      pitch: 0,
      frequency: 1800,
      volume: 140,
      noise: 18,
      echo: 10
    }
  },
  {
    id: 'lo-fi',
    name: 'Lo-Fi',
    category: 'effect',
    Icon: Headphones,
    state: {
      tempo: 0.97,
      pitch: -1,
      frequency: 1200,
      volume: 115,
      noise: 25,
      echo: 30
    }
  }
];