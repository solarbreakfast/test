import { useCallback } from 'react';
import { AudioNodes, AudioState } from '../types/audio';
import { exportProcessedAudio } from '../utils/audioExport';
import { ExportFormat } from '../components/ExportOptions';

export function useAudioExport(
  audioContext: AudioContext | null,
  nodes: AudioNodes | null,
  audioBuffer: AudioBuffer | null,
  audioState: AudioState
) {
  const exportAudio = useCallback(async (format: ExportFormat, quality: any, filename: string) => {
    if (!audioContext || !nodes || !audioBuffer) return;

    try {
      const blob = await exportProcessedAudio(audioContext, nodes, audioBuffer, audioState, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.${format.extension}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [audioContext, nodes, audioBuffer, audioState]);

  return { exportAudio };
}