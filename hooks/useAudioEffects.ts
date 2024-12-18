import { useRef, useCallback } from 'react';
import { AudioNodes, AudioState } from '../types/audio';
import { applyAudioEffects } from '../utils/audioEffects';
import { AUDIO_CONSTRAINTS } from '../constants';

export function useAudioEffects(nodes: AudioNodes | null) {
  const audioStateRef = useRef<AudioState>({
    tempo: AUDIO_CONSTRAINTS.tempo.default,
    pitch: AUDIO_CONSTRAINTS.pitch.default,
    frequency: AUDIO_CONSTRAINTS.frequency.default,
    volume: AUDIO_CONSTRAINTS.volume.default,
    noise: AUDIO_CONSTRAINTS.noise.default,
    echo: AUDIO_CONSTRAINTS.echo.default
  });

  const resetEffects = useCallback(() => {
    if (!nodes) return;

    const defaultState = {
      tempo: AUDIO_CONSTRAINTS.tempo.default,
      pitch: AUDIO_CONSTRAINTS.pitch.default,
      frequency: AUDIO_CONSTRAINTS.frequency.default,
      volume: AUDIO_CONSTRAINTS.volume.default,
      noise: AUDIO_CONSTRAINTS.noise.default,
      echo: AUDIO_CONSTRAINTS.echo.default
    };

    // Apply default values to all effects
    Object.entries(defaultState).forEach(([param, value]) => {
      applyAudioEffects(nodes, param, value);
    });

    // Update the reference state
    audioStateRef.current = defaultState;

    return defaultState;
  }, [nodes]);

  const applyEffect = useCallback((param: keyof AudioState, value: number) => {
    if (!nodes) return;
    
    audioStateRef.current[param] = value;
    applyAudioEffects(nodes, param, value);
  }, [nodes]);

  return {
    audioState: audioStateRef,
    applyEffect,
    resetEffects
  };
}