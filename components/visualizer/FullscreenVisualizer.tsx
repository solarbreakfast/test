import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { WaveformVisualizer } from './WaveformVisualizer';
import { SpectrumVisualizer } from './SpectrumVisualizer';
import { VisualizerToggle } from './VisualizerToggle';

interface FullscreenVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
  analyserNode: AnalyserNode | null;
  visualizerMode: 'waveform' | 'spectrum';
  onModeChange: (mode: 'waveform' | 'spectrum') => void;
}

export const FullscreenVisualizer: React.FC<FullscreenVisualizerProps> = ({
  isOpen,
  onClose,
  analyserNode,
  visualizerMode,
  onModeChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-[#121212] z-50 flex flex-col"
    >
      {/* Controls overlay - positioned absolutely */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
        <VisualizerToggle
          mode={visualizerMode}
          onModeChange={onModeChange}
        />
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-lg text-[#808080] hover:bg-[#2a2a2a] transition-colors z-10"
        title="Close Fullscreen"
      >
        <X size={20} />
      </button>

      {/* Visualizer - takes full screen */}
      <div className="flex-1 relative">
        {visualizerMode === 'waveform' ? (
          <WaveformVisualizer 
            analyserNode={analyserNode}
            isFullscreen={true}
          />
        ) : (
          <SpectrumVisualizer 
            analyserNode={analyserNode}
            isFullscreen={true}
          />
        )}
      </div>
    </div>
  );
};