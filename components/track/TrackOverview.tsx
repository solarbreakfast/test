import React, { useCallback, useRef, useState } from 'react';
import { Playhead } from './Playhead';
import { WaveformCanvas } from './WaveformCanvas';
import { formatTime } from '../../utils/formatters';
import { usePlayheadTracking } from '../../hooks/usePlayheadTracking';

interface TrackOverviewProps {
  audioBuffer: AudioBuffer | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onSeek: (time: number) => void;
}

export const TrackOverview: React.FC<TrackOverviewProps> = ({
  audioBuffer,
  currentTime,
  duration,
  isPlaying,
  onSeek,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState<{ x: number, time: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Get actual duration from audio buffer if available
  const actualDuration = audioBuffer?.duration || duration || 0;

  // Use custom hook for smooth playhead tracking
  const playheadPosition = usePlayheadTracking(currentTime, actualDuration, isPlaying);

  const calculateTimeFromPosition = useCallback((clientX: number): number => {
    const container = containerRef.current;
    if (!container || !actualDuration) return 0;

    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return (x / rect.width) * actualDuration;
  }, [actualDuration]);

  const handleSeek = useCallback((clientX: number) => {
    if (!audioBuffer) return;
    
    const time = calculateTimeFromPosition(clientX);
    if (time >= 0 && time <= actualDuration) {
      onSeek(time);
    }
  }, [audioBuffer, calculateTimeFromPosition, actualDuration, onSeek]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSeek(e.clientX);
  }, [handleSeek]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const time = calculateTimeFromPosition(e.clientX);
    setHoverPosition({ x, time });

    if (isDragging) {
      handleSeek(e.clientX);
    }
  }, [isDragging, calculateTimeFromPosition, handleSeek]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!audioBuffer) return;
    e.preventDefault();
    setIsDragging(true);
    handleSeek(e.clientX);
  }, [audioBuffer, handleSeek]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!audioBuffer) return;
    e.preventDefault();
    const touch = e.touches[0];
    handleSeek(touch.clientX);
  }, [audioBuffer, handleSeek]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      handleSeek(touch.clientX);
    }
  }, [isDragging, handleSeek]);

  return (
    <div 
      ref={containerRef}
      className="relative h-[40px] min-w-[315px] bg-[#121212] rounded cursor-pointer select-none overflow-hidden"
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setHoverPosition(null);
        setIsDragging(false);
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Waveform */}
      <WaveformCanvas
        audioBuffer={audioBuffer}
        currentTime={currentTime}
        duration={actualDuration}
      />

      {/* Hover indicator */}
      {isHovering && hoverPosition && (
        <>
          <div 
            className="absolute top-0 bottom-0 w-[1px] bg-[#808080] opacity-50 pointer-events-none z-20"
            style={{ left: hoverPosition.x }}
          />
          <div 
            className="absolute top-0 px-2 py-1 text-xs font-mono bg-[#1a1a1a] border border-[#333] rounded shadow-lg pointer-events-none z-20 transform -translate-x-1/2"
            style={{ left: hoverPosition.x }}
          >
            {formatTime(hoverPosition.time)}
          </div>
        </>
      )}

      {/* Playhead */}
      <Playhead 
        position={playheadPosition} 
        height={40} 
        isPlaying={isPlaying}
      />

      {/* Time display */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 py-1 text-xs font-mono text-[#808080] bg-gradient-to-t from-black/30 to-transparent z-10">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(actualDuration)}</span>
      </div>
    </div>
  );
};