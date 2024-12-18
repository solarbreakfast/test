import { useState, useCallback, useRef } from 'react';
import { AudioNodes, AudioState } from '../types/audio';

export function usePlayback() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastPositionRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();
  const playbackParamsRef = useRef<Partial<AudioState>>({});

  const updateCurrentTime = useCallback((audioContext: AudioContext, duration: number) => {
    if (!isPlaying) return;
    
    const elapsed = audioContext.currentTime - startTimeRef.current;
    const newTime = elapsed % duration;
    setCurrentTime(newTime);
    lastPositionRef.current = newTime;
    
    animationFrameRef.current = requestAnimationFrame(() => 
      updateCurrentTime(audioContext, duration)
    );
  }, [isPlaying]);

  const stopPlayback = useCallback(() => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch (e) {
        // Ignore errors if source is already stopped
      }
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setIsPlaying(false);
  }, []);

  const play = useCallback(async (
    audioContext: AudioContext,
    audioBuffer: AudioBuffer,
    nodes: AudioNodes,
    startTime: number = lastPositionRef.current,
    isLooping: boolean = false
  ) => {
    try {
      // Stop any existing playback
      stopPlayback();

      // Resume audio context if suspended
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Create and configure new source
      const sourceNode = audioContext.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(nodes.gainNode);
      sourceNode.loop = isLooping;
      sourceNodeRef.current = sourceNode;

      // Apply saved playback parameters
      if (playbackParamsRef.current.tempo !== undefined) {
        sourceNode.playbackRate.value = playbackParamsRef.current.tempo;
      }
      if (playbackParamsRef.current.pitch !== undefined) {
        sourceNode.detune.value = playbackParamsRef.current.pitch * 100;
      }

      // Start playback from the specified time
      startTimeRef.current = audioContext.currentTime - startTime;
      sourceNode.start(0, startTime);

      // Handle playback end
      sourceNode.onended = () => {
        if (!sourceNode.loop) {
          stopPlayback();
          // Keep the last position when stopping
          setCurrentTime(lastPositionRef.current);
        }
      };

      setIsPlaying(true);
      updateCurrentTime(audioContext, audioBuffer.duration);
      nodes.sourceNode = sourceNode;
    } catch (error) {
      console.error('Playback error:', error);
      stopPlayback();
    }
  }, [updateCurrentTime, stopPlayback]);

  const pause = useCallback(() => {
    // Save current playback parameters before stopping
    if (sourceNodeRef.current) {
      playbackParamsRef.current = {
        tempo: sourceNodeRef.current.playbackRate.value,
        pitch: sourceNodeRef.current.detune.value / 100
      };
    }
    stopPlayback();
    // Keep the current position when pausing
    lastPositionRef.current = currentTime;
  }, [stopPlayback, currentTime]);

  const seek = useCallback((time: number) => {
    const newTime = Math.max(0, time);
    setCurrentTime(newTime);
    lastPositionRef.current = newTime;
    return newTime;
  }, []);

  const updatePlaybackParams = useCallback((param: keyof AudioState, value: number) => {
    playbackParamsRef.current = {
      ...playbackParamsRef.current,
      [param]: value
    };

    // Apply to current source node if playing
    if (sourceNodeRef.current) {
      if (param === 'tempo') {
        sourceNodeRef.current.playbackRate.value = value;
      } else if (param === 'pitch') {
        sourceNodeRef.current.detune.value = value * 100;
      }
    }
  }, []);

  return {
    isPlaying,
    currentTime,
    play,
    pause,
    seek,
    updatePlaybackParams,
    sourceNode: sourceNodeRef.current
  };
}