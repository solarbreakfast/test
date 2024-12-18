import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface FullscreenButtonProps {
  isFullscreen: boolean;
  onToggle: () => void;
}

export const FullscreenButton: React.FC<FullscreenButtonProps> = ({ isFullscreen, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="absolute top-2 left-2 p-1.5 bg-[#1a1a1a] rounded-lg border border-[#333] text-[#808080] hover:bg-[#222] transition-colors z-10"
      title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
    >
      {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
    </button>
  );
};