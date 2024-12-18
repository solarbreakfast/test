import React, { useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { LoadingBar } from './LoadingBar';
import { VisualizerToggle } from './visualizer/VisualizerToggle';
import { WaveformVisualizer as WaveformView } from './visualizer/WaveformVisualizer';
import { SpectrumVisualizer } from './visualizer/SpectrumVisualizer';
import { FullscreenButton } from './visualizer/FullscreenButton';
import { FullscreenVisualizer } from './visualizer/FullscreenVisualizer';

interface WaveformVisualizerProps {
  audioContext: AudioContext | null;
  analyserNode: AnalyserNode | null;
  onFileSelect: (file: File) => Promise<void>;
  onClear: () => void;
  currentFile: string | null;
  isLoading: boolean;
  loadingProgress: number;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  audioContext,
  analyserNode,
  onFileSelect,
  onClear,
  currentFile,
  isLoading,
  loadingProgress
}) => {
  const [visualizerMode, setVisualizerMode] = useState<'waveform' | 'spectrum'>('waveform');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const validateFileType = (file: File): boolean => {
    const supportedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/aac', 'audio/x-m4a'];
    if (!supportedTypes.includes(file.type)) {
      setError('Unsupported file type');
      return false;
    }
    return true;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setError(null);
    if (validateFileType(file)) {
      try {
        await onFileSelect(file);
      } catch (err) {
        setError('Unsupported file type');
        console.error('File processing error:', err);
      }
    }
    event.target.value = '';
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;
    
    setError(null);
    if (validateFileType(file)) {
      try {
        await onFileSelect(file);
      } catch (err) {
        setError('Unsupported file type');
        console.error('File processing error:', err);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  return (
    <>
      <div 
        className="relative w-full h-40 bg-[#121212] rounded-lg overflow-hidden"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !analyserNode && fileInputRef.current?.click()}
      >
        {analyserNode && (
          <>
            <FullscreenButton
              isFullscreen={isFullscreen}
              onToggle={toggleFullscreen}
            />
            <VisualizerToggle
              mode={visualizerMode}
              onModeChange={setVisualizerMode}
            />
          </>
        )}

        {visualizerMode === 'waveform' ? (
          <WaveformView analyserNode={analyserNode} />
        ) : (
          <SpectrumVisualizer analyserNode={analyserNode} />
        )}

        {!analyserNode && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#121212] bg-opacity-90 text-center select-none">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".mp3,.wav,.aac"
              className="hidden"
            />
            <Upload className="mb-2 text-zinc-400" size={24} />
            <p className="text-zinc-400 px-4">Drop file here or click anywhere to browse</p>
            <p className="text-xs text-zinc-500 mt-1">Supports MP3, WAV, AAC</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#121212] bg-opacity-95 text-center select-none">
            <AlertCircle className="mb-2 text-red-400" size={24} />
            <p className="text-red-400 text-center px-4">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-3 px-4 py-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#121212] to-transparent select-none">
            <LoadingBar progress={loadingProgress} isIndeterminate={loadingProgress < 20} />
            <p className="text-xs text-center text-zinc-500 mt-2">
              Loading audio file... {Math.round(loadingProgress)}%
            </p>
          </div>
        )}

        {currentFile && !isLoading && (
          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-[#121212] to-transparent select-none">
            <div className="flex items-center justify-between px-2">
              <p className="text-xs text-[#808080] font-mono">
                {currentFile}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="p-1 rounded-full hover:bg-[#2a2a2a] text-[#808080] transition-colors"
                title="Clear file"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <FullscreenVisualizer
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        analyserNode={analyserNode}
        visualizerMode={visualizerMode}
        onModeChange={setVisualizerMode}
      />
    </>
  );
};