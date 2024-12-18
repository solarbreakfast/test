import React, { useCallback } from 'react';

interface CropHandleProps {
  position: number;
  duration: number;
  isStart: boolean;
  onChange: (position: number) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const CropHandle: React.FC<CropHandleProps> = ({
  position,
  duration,
  isStart,
  onChange,
  onKeyDown
}) => {
  const handleDrag = useCallback((e: React.MouseEvent) => {
    const container = e.currentTarget.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newPosition = (x / rect.width) * duration;
    onChange(newPosition);
  }, [duration, onChange]);

  return (
    <div
      role="slider"
      aria-label={`${isStart ? 'Start' : 'End'} crop handle`}
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={position}
      tabIndex={0}
      className={`
        absolute top-0 bottom-0 w-2 cursor-col-resize
        bg-[#66bb6a] opacity-50 hover:opacity-75
        transition-opacity duration-200
        border-2 border-[#66bb6a] shadow-lg
        focus:outline-none focus:ring-2 focus:ring-[#66bb6a] focus:ring-opacity-50
      `}
      style={{
        left: `${(position / duration) * 100}%`,
        transform: 'translateX(-50%)'
      }}
      onMouseDown={handleDrag}
      onKeyDown={onKeyDown}
    />
  );
};