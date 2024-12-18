import React from 'react';

interface PlayheadProps {
  position: number;
  height: number;
  isPlaying: boolean;
}

export const Playhead: React.FC<PlayheadProps> = ({ position, height, isPlaying }) => {
  return (
    <div
      className="absolute top-0 h-full pointer-events-none z-30"
      style={{
        left: `${position}%`,
        transform: 'translateX(-50%)',
        willChange: 'left',
        transition: isPlaying ? 'none' : 'left 100ms ease-out',
        backfaceVisibility: 'hidden',
        perspective: 1000,
        WebkitFontSmoothing: 'antialiased'
      }}
    >
      {/* Main playhead line with improved rendering */}
      <div
        className="w-[2px] h-full bg-[#66bb6a]"
        style={{
          boxShadow: '0 0 4px #66bb6a',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      />
      
      {/* Glow effect with hardware acceleration */}
      <div
        className="absolute top-0 w-[4px] h-full opacity-20"
        style={{
          left: '-1px',
          background: 'linear-gradient(to right, transparent, #66bb6a, transparent)',
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      />
    </div>
  );
};