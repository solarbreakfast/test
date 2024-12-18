import React from 'react';
import { formatTime } from '../../utils/formatters';

interface TimeMarkerProps {
  time: number;
  position: number;
}

export const TimeMarker: React.FC<TimeMarkerProps> = ({ time, position }) => {
  return (
    <div
      className="absolute -bottom-4 text-[8px] font-mono text-[#808080]"
      style={{
        left: `${position}%`,
        transform: 'translateX(-50%)',
      }}
    >
      {formatTime(time)}
    </div>
  );
};