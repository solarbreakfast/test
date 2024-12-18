import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Section } from './track/Section';
import { TimeMarker } from './track/TimeMarker';
import { Playhead } from './track/Playhead';
import { WaveformCanvas } from './track/WaveformCanvas';

interface TrackOverviewProps {
  audioBuffer: AudioBuffer | null;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export const TrackOverview: React.FC<TrackOverviewProps> = ({
  audioBuffer,
  currentTime,
  duration,
  onSeek,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const analyzeSections = useCallback(() => {
    if (!audioBuffer) return;

    const data = audioBuffer.getChannelData(0);
    const sectionSize = Math.floor(data.length / 16); // More detailed sections
    const newSections: Section[] = [];
    
    for (let i = 0; i < data.length; i += sectionSize) {
      let sum = 0;
      for (let j = 0; j < sectionSize && (i + j) < data.length; j++) {
        sum += Math.abs(data[i + j]);
      }
      const amplitude = sum / sectionSize;
      
      // Enhanced color mapping based on amplitude
      const color = amplitude > 0.2 ? '#4CAF50' : 
                    amplitude > 0.1 ? '#FFA726' : '#78909C';

      newSections.push({
        start: (i / data.length) * duration,
        end: (Math.min(i + sectionSize, data.length) / data.length) * duration,
        color,
        amplitude
      });
    }

    setSections(newSections);
  }, [audioBuffer, duration]);

  useEffect(() => {
    analyzeSections();
  }, [analyzeSections]);

  const handleInteraction = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    onSeek(percentage * duration);
  }, [duration, onSeek]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    handleInteraction(e.clientX);
  }, [handleInteraction]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    handleInteraction(e.clientX);
  }, [isDragging, handleInteraction]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseleave', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isDragging, handleMouseUp]);

  const playheadPosition = (currentTime / duration) * 100;

  return (
    <div 
      ref={containerRef}
      className="h-10 bg-[#121212] rounded cursor-pointer relative overflow-hidden select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      {/* Sections */}
      {sections.map((section, index) => (
        <Section
          key={index}
          section={section}
          width={800}
          height={40}
          duration={duration}
        />
      ))}

      {/* Waveform */}
      <WaveformCanvas
        audioBuffer={audioBuffer}
        sections={sections}
        currentTime={currentTime}
        duration={duration}
      />

      {/* Playhead */}
      <Playhead position={playheadPosition} height={40} />

      {/* Time markers */}
      {Array.from({ length: 11 }).map((_, i) => {
        const time = (i / 10) * duration;
        return (
          <TimeMarker
            key={i}
            time={time}
            position={i * 10}
          />
        );
      })}

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#333] to-transparent opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#444] to-transparent opacity-20" />
    </div>
  );
};