export interface ExportFormat {
  id: string;
  label: string;
  mimeType: string;
  extension: string;
  bitrate?: number;
}

export interface ExportQuality {
  id: string;
  label: string;
  sampleRate: number;
  bitDepth: number;
}

export interface ExportOptions {
  format: ExportFormat;
  quality: ExportQuality;
  filename: string;
  includeEchoTail?: boolean;
  normalizeAudio?: boolean;
}