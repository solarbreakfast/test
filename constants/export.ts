import { ExportFormat, ExportQuality } from '../types/export';

export const EXPORT_FORMATS: ExportFormat[] = [
  { id: 'wav', label: 'WAV', mimeType: 'audio/wav', extension: 'wav' },
  { id: 'mp3', label: 'MP3', mimeType: 'audio/mpeg', extension: 'mp3', bitrate: 320 },
  { id: 'aac', label: 'AAC', mimeType: 'audio/aac', extension: 'aac', bitrate: 256 }
];

export const EXPORT_QUALITIES: ExportQuality[] = [
  { id: 'high', label: 'High Quality', sampleRate: 48000, bitDepth: 24 },
  { id: 'medium', label: 'Standard', sampleRate: 44100, bitDepth: 16 },
  { id: 'low', label: 'Compressed', sampleRate: 22050, bitDepth: 16 }
];