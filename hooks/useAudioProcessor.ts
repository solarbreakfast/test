import { useState, useCallback } from 'react';
import { useAudioContext } from './useAudioContext';
import { useAudioNodes } from './useAudioNodes';
import { useAudioState } from './useAudioState';
import { usePlayback } from './usePlayback';
import { useLoopControl } from './useLoopControl';
import { AudioState } from '../types/audio';
import { PRESETS } from '../constants/presets';
import { applyAudioEffects } from '../utils/audioEffects';
import { exportProcessedAudio } from '../utils/audioExport';
import { ExportFormat, ExportQuality } from '../types/export';

export function useAudioProcessor() {
  const { audioContext, initializeContext } = useAudioContext();
  const { nodes, createNodes, disposeNodes } = useAudioNodes();
  const { 
    state: audioState, 
    updateState, 
    resetState, 
    setOriginalState, 
    restoreLastState,
    hasModifications 
  } = useAudioState();
  
  const { 
    isPlaying, 
    currentTime, 
    duration, 
    play, 
    pause, 
    seek, 
    sourceNode,
    updatePlaybackParams 
  } = usePlayback();
  
  const { isLooping, toggleLoop } = useLoopControl(nodes);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const loadFile = useCallback(async (file: File) => {
    try {
      const context = await initializeContext();
      const arrayBuffer = await file.arrayBuffer();
      const buffer = await context.decodeAudioData(arrayBuffer);
      
      await createNodes(context);
      setAudioBuffer(buffer);
      setCurrentFile(file.name);
      
      return { context, buffer };
    } catch (error) {
      console.error('Error loading file:', error);
      throw error;
    }
  }, [initializeContext, createNodes]);

  const clearFile = useCallback(() => {
    if (isPlaying) {
      pause();
    }
    setCurrentFile(null);
    setAudioBuffer(null);
    disposeNodes();
    setActivePreset(null);
  }, [isPlaying, pause, disposeNodes]);

  const handleParameterChange = useCallback((param: keyof AudioState, value: number) => {
    updateState(param, value);
    if (nodes && audioContext) {
      applyAudioEffects(nodes, param, value);
      // Update playback parameters
      if (param === 'tempo' || param === 'pitch') {
        updatePlaybackParams(param, value);
      }
    }
  }, [nodes, audioContext, updateState, updatePlaybackParams]);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
      restoreLastState();
    } else {
      play(audioContext!, audioBuffer!, nodes!, currentTime, isLooping);
    }
  }, [
    isPlaying, pause, play, audioContext, audioBuffer, 
    nodes, currentTime, isLooping, restoreLastState
  ]);

  const onPresetSelect = useCallback((presetId: string, state: AudioState) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    if (activePreset === presetId) {
      setActivePreset(null);
      resetState();
    } else {
      setActivePreset(presetId);
      Object.entries(preset.state).forEach(([param, value]) => {
        handleParameterChange(param as keyof AudioState, value);
      });
    }
  }, [activePreset, resetState, handleParameterChange]);

  const exportAudio = useCallback(async (
    format: ExportFormat, 
    quality: ExportQuality, 
    filename: string
  ) => {
    if (!audioContext || !nodes || !audioBuffer) {
      throw new Error('Cannot export: missing audio components');
    }

    try {
      const blob = await exportProcessedAudio(
        audioContext, 
        nodes, 
        audioBuffer, 
        audioState, 
        format,
        quality
      );
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.${format.extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }, [audioContext, nodes, audioBuffer, audioState]);

  return {
    audioContext,
    audioBuffer,
    nodes,
    currentFile,
    isPlaying,
    currentTime,
    duration,
    isLooping,
    hasModifications,
    audioState,
    activePreset,
    play,
    pause,
    seek,
    loadFile,
    clearFile,
    toggleLoop,
    resetState,
    onPresetSelect,
    exportAudio,
    handleParameterChange,
    handlePlayPause,
    setVolume: (value: number) => handleParameterChange('volume', value),
    setTempo: (value: number) => handleParameterChange('tempo', value),
    setPitch: (value: number) => handleParameterChange('pitch', value),
    setFrequency: (value: number) => handleParameterChange('frequency', value),
    setNoise: (value: number) => handleParameterChange('noise', value),
    setEcho: (value: number) => handleParameterChange('echo', value)
  };
}