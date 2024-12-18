import React from 'react';

interface SliderTrackProps {
  percentage: number;
  isActive: boolean;
}

export const SliderTrack: React.FC<SliderTrackProps> = ({ percentage, isActive }) => {
  return (
    <>
      {/* Background track */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 bg-[#2a2a2a]">
        {/* Highlight effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333] to-transparent opacity-30" />
      </div>

      {/* Active track with hardware acceleration */}
      <div 
        className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 transition-[width,opacity] duration-75 ease-out"
        style={{ 
          width: `${percentage}%`,
          background: isActive 
            ? 'linear-gradient(90deg, #66bb6a, #81c784)'
            : '#66bb6a',
          opacity: isActive ? 1 : 0.8,
          transform: 'translate3d(0, -50%, 0)',
          willChange: 'width, opacity',
          backfaceVisibility: 'hidden'
        }}
      >
        {/* Glow effect */}
        {isActive && (
          <div 
            className="absolute inset-0 transition-opacity duration-150"
            style={{
              boxShadow: '0 0 8px rgba(102, 187, 106, 0.4)',
              opacity: percentage > 0 ? 1 : 0
            }}
          />
        )}
      </div>
    </>
  );
};