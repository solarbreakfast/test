import { useCallback, useRef } from 'react';
import { AudioNodes, AudioState } from '../types/audio';
import { AUDIO_CONSTRAINTS } from '../constants';

export function useReset(
  nodes: AudioNodes | null,
  onPause: () => void,
  onSeek: (time: number) => void,
  updateState: (state: AudioState) => void
) {
  const initialStateRef = useRef<AudioState>({
    tempo: AUDIO_CONSTRAINTS.tempo.default,
    pitch: AUDIO_CONSTRAINTS.pitch.default,
    frequency: AUDIO_CONSTRAINTS.frequency.default,
    volume: AUDIO_CONSTRAINTS.volume.default,
    noise: AUDIO_CONSTRAINTS.noise.default,
    echo: AUDIO_CONSTRAINTS.echo.default
  });

  const reset = useCallback(async () => {
    if (!nodes) return;

    // Pause playback
    onPause();
    
    // Reset playback position
    onSeek(0);

    // Reset to default state
    const defaultState = { ...initialStateRef.current };
    updateState(defaultState);

    // Reset source node parameters
    if (nodes.sourceNode) {
      nodes.sourceNode.playbackRate.value = defaultState.tempo;
      nodes.sourceNode.detune.value = defaultState.pitch * 100;
    }

    // Reset gain node
    nodes.gainNode.gain.setValueAtTime(
      defaultState.volume / 100,
      nodes.gainNode.context.currentTime
    );

    // Reset filter
    nodes.filterNode.frequency.setValueAtTime(
      defaultState.frequency,
      nodes.filterNode.context.currentTime
    );

    // Reset noise
    if (nodes.noiseGainNode) {
      nodes.noiseGainNode.gain.setValueAtTime(
        defaultState.noise / 100,
        nodes.noiseGainNode.context.currentTime
      );
    }

    // Reset echo
    if (nodes.echoGainNode) {
      nodes.echoGainNode.gain.setValueAtTime(
        defaultState.echo / 100,
        nodes.echoGainNode.context.currentTime
      );
    }

    return defaultState;
  }, [nodes, onPause, onSeek, updateState]);

  const setInitialState = useCallback((state: AudioState) => {
    initialStateRef.current = { ...state };
  }, []);

  return {
    reset,
    setInitialState
  };
}