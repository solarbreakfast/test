import { useState, useRef, useCallback } from 'react';
import { AudioState } from '../types/audio';
import { AUDIO_CONSTRAINTS } from '../constants';

export function useAudioState() {
  const [state, setState] = useState<AudioState>({
    tempo: AUDIO_CONSTRAINTS.tempo.default,
    pitch: AUDIO_CONSTRAINTS.pitch.default,
    frequency: AUDIO_CONSTRAINTS.frequency.default,
    volume: AUDIO_CONSTRAINTS.volume.default,
    noise: AUDIO_CONSTRAINTS.noise.default,
    echo: AUDIO_CONSTRAINTS.echo.default
  });

  const originalState = useRef<AudioState>(state);
  const lastModifiedState = useRef<AudioState>(state);
  const [hasModifications, setHasModifications] = useState(false);

  const updateState = useCallback((param: keyof AudioState, value: number) => {
    setState(prev => {
      const newState = { ...prev, [param]: value };
      // Store the modified state
      lastModifiedState.current = newState;
      setHasModifications(
        Object.keys(originalState.current).some(
          key => originalState.current[key as keyof AudioState] !== newState[key as keyof AudioState]
        )
      );
      return newState;
    });
  }, []);

  const resetState = useCallback(() => {
    setState(originalState.current);
    lastModifiedState.current = originalState.current;
    setHasModifications(false);
    return originalState.current;
  }, []);

  const setOriginalState = useCallback((newState: AudioState) => {
    originalState.current = { ...newState };
    setState(newState);
    lastModifiedState.current = newState;
    setHasModifications(false);
  }, []);

  const restoreLastState = useCallback(() => {
    setState(lastModifiedState.current);
    return lastModifiedState.current;
  }, []);

  return {
    state,
    updateState,
    resetState,
    setOriginalState,
    restoreLastState,
    hasModifications
  };
}