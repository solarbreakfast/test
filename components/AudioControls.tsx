import React from 'react';
import { PlaybackControls } from './PlaybackControls';
import { PresetSelector } from './PresetSelector';
import { FrequencySlider } from './sliders/FrequencySlider';
import { TempoSlider } from './sliders/TempoSlider';
import { PitchSlider } from './sliders/PitchSlider';
import { NoiseSlider } from './sliders/NoiseSlider';
import { EchoSlider } from './sliders/EchoSlider';
import { ExportFormat } from './ExportOptions';

interface AudioControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLooping: boolean;
  isGenerating: boolean;
  hasModifications: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onLoop: () => void;
  onRandomize: () => void;
  onReset: () => void;
  onVolumeChange: (value: number) => void;
  onTempoChange: (value: number) => void;
  onPitchChange: (value: number) => void;
  onFrequencyChange: (value: number) => void;
  onNoiseChange: (value: number) => void;
  onEchoChange: (value: number) => void;
  onSave: (format: ExportFormat, quality: any, filename: string) => void;
  currentFile?: string | null;
  audioBuffer: AudioBuffer | null;
  volume: number;
  tempo: number;
  pitch: number;
  frequency: number;
  noise: number;
  echo: number;
  activePreset: string | null;
  onPresetSelect: (presetId: string, state: any) => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  isLooping,
  isGenerating,
  hasModifications,
  onPlayPause,
  onSeek,
  onLoop,
  onRandomize,
  onReset,
  onVolumeChange,
  onTempoChange,
  onPitchChange,
  onFrequencyChange,
  onNoiseChange,
  onEchoChange,
  onSave,
  currentFile,
  audioBuffer,
  volume,
  tempo,
  pitch,
  frequency,
  noise,
  echo,
  activePreset,
  onPresetSelect
}) => {
  return (
    <div className="space-y-6 px-2">
      <PlaybackControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        isLooping={isLooping}
        isGenerating={isGenerating}
        onPlayPause={onPlayPause}
        onSeek={onSeek}
        onLoop={onLoop}
        onRandomize={onRandomize}
        onReset={onReset}
        onVolumeChange={onVolumeChange}
        volume={volume}
        onSave={onSave}
        currentFile={currentFile}
        audioBuffer={audioBuffer}
        hasModifications={hasModifications}
      />

      <PresetSelector
        onPresetSelect={onPresetSelect}
        activePreset={activePreset}
      />

      <div className="space-y-4">
        <FrequencySlider value={frequency} onChange={onFrequencyChange} />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <TempoSlider value={tempo} onChange={onTempoChange} />
          <PitchSlider value={pitch} onChange={onPitchChange} />
          <NoiseSlider value={noise} onChange={onNoiseChange} />
          <EchoSlider value={echo} onChange={onEchoChange} />
        </div>
      </div>
    </div>
  );
};