import React from 'react';

export interface Section {
  start: number;
  end: number;
  color: string;
  amplitude: number;
}

interface SectionProps {
  section: Section;
  width: number;
  height: number;
  duration: number;
}

export const Section: React.FC<SectionProps> = ({ section, width, height, duration }) => {
  const startX = (section.start / duration) * width;
  const endX = (section.end / duration) * width;
  const sectionWidth = endX - startX;

  return (
    <div
      className="absolute h-full opacity-10 transition-opacity hover:opacity-20"
      style={{
        left: `${(startX / width) * 100}%`,
        width: `${(sectionWidth / width) * 100}%`,
        backgroundColor: section.color,
      }}
      title={`Amplitude: ${Math.round(section.amplitude * 100)}%`}
    />
  );
};