import { ExportFormat } from '../components/ExportOptions';

export interface AudioTrack {
  id: string;
  name: string;
  buffer: AudioBuffer;
  state: AudioState;
  nodes: AudioNodes;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
}

export interface AudioState {
  tempo: number;
  pitch: number;
  frequency: number;
  volume: number;
  noise: number;
  echo: number;
  originalSampleRate?: number;
  originalChannels?: number;
}

export interface AudioNodes {
  gainNode: GainNode;
  analyserNode: AnalyserNode;
  filterNode: BiquadFilterNode;
  sourceNode?: AudioBufferSourceNode;
  noiseNode?: AudioBufferSourceNode;
  noiseGainNode?: GainNode;
  noiseFilter?: BiquadFilterNode;
  compressor: DynamicsCompressorNode;
  echoNode?: DelayNode;
  echoGainNode?: GainNode;
  feedbackNode?: GainNode;
}

export interface AudioSpecs {
  sampleRate: number;
  channels: number;
  duration: number;
}

export interface FrequencyRange {
  name: string;
  min: number;
  max: number;
}

export interface AudioLoadingOptions {
  sampleRate?: number;
  preserveOriginal?: boolean;
}