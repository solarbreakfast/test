import React from 'react';
import { Play, Pause } from 'lucide-react';
import { VolumeKnob } from './sliders/VolumeKnob';
import { ExportOptions } from './ExportOptions';
import { TrackOverview } from './track/TrackOverview';
import { LoopButton } from './controls/LoopButton';
import { RandomizeButton } from './controls/RandomizeButton';
import { ResetButton } from './controls/ResetButton';
import { VolumeSlider } from './sliders/VolumeSlider';

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLooping: boolean;
  isGenerating: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onLoop: () => void;
  onRandomize: () => void;
  onReset: () => void;
  onVolumeChange: (value: number) => void;
  volume: number;
  onSave: (format: any, quality: any, filename: string) => void;
  currentFile?: string | null;
  audioBuffer: AudioBuffer | null;
  hasModifications: boolean;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  isLooping,
  isGenerating,
  onPlayPause,
  onSeek,
  onLoop,
  onRandomize,
  onReset,
  onVolumeChange,
  volume,
  onSave,
  currentFile,
  audioBuffer,
  hasModifications
}) => {
  const hasAudio = audioBuffer !== null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        {/* Left section - Play and Loop */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPlayPause}
            disabled={!hasAudio}
            className={`
              p-2 sm:p-3 rounded-full transition-colors
              ${!hasAudio 
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'bg-zinc-700 hover:bg-zinc-600 text-[#a0a0a0]'
              }
            `}
            title={hasAudio ? (isPlaying ? 'Pause' : 'Play') : 'Load audio to play'}
          >
            {isPlaying ? <Pause size={20} className="sm:w-6 sm:h-6" /> : <Play size={20} className="sm:w-6 sm:h-6" />}
          </button>
          <LoopButton 
            isLooping={isLooping} 
            onToggle={onLoop}
            disabled={!hasAudio}
          />
        </div>

        {/* Center section - Randomize and Reset */}
        <div className="flex items-center justify-center gap-2 flex-grow">
          <div className="flex gap-2">
            <RandomizeButton 
              isGenerating={isGenerating}
              onGenerate={onRandomize}
              disabled={!hasAudio}
            />
            <ResetButton 
              onReset={onReset}
              disabled={!hasAudio}
              hasModifications={hasModifications}
            />
          </div>
        </div>

        {/* Right section - Volume and Export */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:block">
            <VolumeKnob value={volume} onChange={onVolumeChange} />
          </div>
          <ExportOptions onExport={onSave} currentFilename={currentFile} />
        </div>
      </div>

      {/* Mobile Volume Control */}
      <div className="sm:hidden">
        <VolumeSlider value={volume} onChange={onVolumeChange} />
      </div>

      <TrackOverview
        audioBuffer={audioBuffer}
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        onSeek={onSeek}
      />
    </div>
  );
};