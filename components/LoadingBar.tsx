import React from 'react';

interface LoadingBarProps {
  progress: number;
  isIndeterminate?: boolean;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ progress, isIndeterminate = false }) => {
  return (
    <div className="w-full bg-[#1a1a1a] h-2 rounded overflow-hidden border border-[#333]">
      <div
        className={`h-full bg-[#66bb6a] transition-all duration-300 ease-out ${
          isIndeterminate ? 'animate-loading-bar' : ''
        }`}
        style={{
          width: isIndeterminate ? '100%' : `${progress}%`,
          backgroundImage: isIndeterminate
            ? 'linear-gradient(45deg, rgba(102,187,106,0.2) 25%, transparent 25%, transparent 50%, rgba(102,187,106,0.2) 50%, rgba(102,187,106,0.2) 75%, transparent 75%, transparent)'
            : 'none',
          backgroundSize: '1rem 1rem',
        }}
      />
    </div>
  );
};