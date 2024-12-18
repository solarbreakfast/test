import React, { memo } from 'react';

interface TickProps {
  position: number;
  isMajor: boolean;
}

export const Tick = memo<TickProps>(({ position, isMajor }) => {
  return (
    <div
      className="absolute bottom-0 flex flex-col items-center"
      style={{ 
        left: `${position}%`,
        transform: 'translateX(-50%)'
      }}
    >
      <div 
        className={`w-[1px] transition-all duration-100 ${
          isMajor ? 'h-2 bg-[#505050]' : 'h-1 bg-[#404040]'
        }`}
      />
    </div>
  );
});

Tick.displayName = 'Tick';