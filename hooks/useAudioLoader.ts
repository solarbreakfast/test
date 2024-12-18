import { useState, useCallback } from 'react';
import { loadAudioFile } from '../utils/audio/loader';
import { AudioLoadingOptions } from '../types/audio';

export function useAudioLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [originalSpecs, setOriginalSpecs] = useState<{
    sampleRate: number;
    channels: number;
  } | null>(null);

  const loadFile = useCallback(async (
    file: File, 
    options: AudioLoadingOptions = { preserveOriginal: true }
  ) => {
    setIsLoading(true);
    setProgress(0);
    setError(null);

    try {
      // Start progress indication
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const next = prev + (100 - prev) * 0.1;
          return next > 99 ? 99 : next;
        });
      }, 100);

      // Load audio file with original settings preserved
      const audioBuffer = await loadAudioFile(file, {
        ...options,
        preserveOriginal: true
      });

      // Store original specifications
      setOriginalSpecs({
        sampleRate: audioBuffer.sampleRate,
        channels: audioBuffer.numberOfChannels
      });

      // Clean up and complete
      clearInterval(progressInterval);
      setProgress(100);
      setIsLoading(false);

      return audioBuffer;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error loading file'));
      setIsLoading(false);
      throw err;
    }
  }, []);

  return {
    loadFile,
    isLoading,
    progress,
    error,
    originalSpecs
  };
}