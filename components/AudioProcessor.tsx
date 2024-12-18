import React, { useCallback, useEffect } from 'react';
import { AudioControls } from './AudioControls';
import { WaveformVisualizer } from './WaveformVisualizer';
import { useAudioProcessor } from '../hooks/useAudioProcessor';
import { useRandomizer } from '../hooks/useRandomizer';
import { AudioState } from '../types/audio';

export const AudioProcessor: React.FC = () => {
  const {
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
    setVolume,
    setTempo,
    setPitch,
    setFrequency,
    setNoise,
    setEcho
  } = useAudioProcessor();

  const { 
    isGenerating, 
    generateRandomParameters, 
    restoreRandomState,
    updateParameter,
    cleanup 
  } = useRandomizer((param: keyof AudioState, value: number) => {
    switch (param) {
      case 'tempo': setTempo(value); break;
      case 'pitch': setPitch(value); break;
      case 'frequency': setFrequency(value); break;
      case 'noise': setNoise(value); break;
      case 'echo': setEcho(value); break;
    }
  });

  const handleParameterUpdate = useCallback((param: keyof AudioState, value: number) => {
    // Update both audio processor and random state
    switch (param) {
      case 'tempo': setTempo(value); break;
      case 'pitch': setPitch(value); break;
      case 'frequency': setFrequency(value); break;
      case 'noise': setNoise(value); break;
      case 'echo': setEcho(value); break;
    }
    updateParameter(param, value);
  }, [updateParameter, setTempo, setPitch, setFrequency, setNoise, setEcho]);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      restoreRandomState();
      play(audioContext!, audioBuffer!, nodes!, currentTime, isLooping);
    }
  }, [
    isPlaying, pause, play, audioContext, audioBuffer, 
    nodes, currentTime, isLooping, restoreRandomState
  ]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return (
    <div className="min-h-screen crt bg-[#1a1a1a] text-[#a0a0a0] p-4 sm:p-6">
      <div className="min-w-[315px] max-w-[620px] mx-auto space-y-6">
        <WaveformVisualizer
          audioContext={audioContext}
          analyserNode={nodes?.analyserNode || null}
          onFileSelect={loadFile}
          onClear={clearFile}
          currentFile={currentFile}
          isLoading={false}
          loadingProgress={0}
        />
        
        <AudioControls
          audioBuffer={audioBuffer}
          currentFile={currentFile}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          isLooping={isLooping}
          isGenerating={isGenerating}
          hasModifications={hasModifications}
          onPlayPause={handlePlayPause}
          onSeek={seek}
          onLoop={toggleLoop}
          onRandomize={generateRandomParameters}
          onReset={resetState}
          onVolumeChange={setVolume}
          onTempoChange={(value) => handleParameterUpdate('tempo', value)}
          onPitchChange={(value) => handleParameterUpdate('pitch', value)}
          onFrequencyChange={(value) => handleParameterUpdate('frequency', value)}
          onNoiseChange={(value) => handleParameterUpdate('noise', value)}
          onEchoChange={(value) => handleParameterUpdate('echo', value)}
          onSave={exportAudio}
          volume={audioState.volume}
          tempo={audioState.tempo}
          pitch={audioState.pitch}
          frequency={audioState.frequency}
          noise={audioState.noise}
          echo={audioState.echo}
          activePreset={activePreset}
          onPresetSelect={onPresetSelect}
        />
      </div>
    </div>
  );
};