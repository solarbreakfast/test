import React from 'react';

interface SliderKnobProps {
  percentage: number;
  isActive: boolean;
}

export const SliderKnob: React.FC<SliderKnobProps> = ({ percentage, isActive }) => {
  return (
    <div
      className="absolute top-1/2 w-6 h-6 rounded-full transition-opacity duration-75 ease-out"
      style={{ 
        left: `${percentage}%`,
        transform: 'translate3d(-50%, -50%, 0)',
        background: isActive
          ? 'linear-gradient(180deg, #909090 0%, #707070 100%)'
          : 'linear-gradient(180deg, #808080 0%, #666666 100%)',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: isActive ? '#505050' : '#444',
        boxShadow: isActive 
          ? '0 1px 2px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.1)'
          : '0 2px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)',
        willChange: 'transform, left',
        backfaceVisibility: 'hidden',
        perspective: 1000,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Grooves with dynamic lighting */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-[1px] origin-bottom transition-opacity duration-75 ease-out"
          style={{
            left: '50%',
            bottom: '50%',
            height: '8px',
            transform: `translate3d(-50%, 0, 0) rotate(${i * (360 / 8)}deg)`,
            background: isActive
              ? 'linear-gradient(to bottom, #505050, #404040)'
              : 'linear-gradient(to bottom, #444, #333)',
            opacity: isActive ? 0.8 : 1
          }}
        />
      ))}

      {/* Center dot */}
      <div 
        className="absolute inset-0 m-auto w-1 h-1 rounded-full transition-opacity duration-75 ease-out"
        style={{
          background: isActive ? '#505050' : '#444',
          boxShadow: isActive 
            ? 'inset 0 1px 1px rgba(0,0,0,0.3)'
            : 'inset 0 1px 2px rgba(0,0,0,0.4)',
          transform: 'translate3d(0, 0, 1px)'
        }}
      />
    </div>
  );
};