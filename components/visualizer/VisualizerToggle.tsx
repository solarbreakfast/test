import React from 'react';
import { Activity, BarChart } from 'lucide-react';

interface VisualizerToggleProps {
  mode: 'waveform' | 'spectrum';
  onModeChange: (mode: 'waveform' | 'spectrum') => void;
}

export const VisualizerToggle: React.FC<VisualizerToggleProps> = ({ mode, onModeChange }) => {
  return (
    <div className="absolute top-2 right-2 flex space-x-1 bg-[#1a1a1a] rounded-lg p-1 border border-[#333] z-10">
      <button
        onClick={() => onModeChange('waveform')}
        className={`p-1.5 rounded-md transition-colors ${
          mode === 'waveform' 
            ? 'bg-[#2a2a2a] text-[#66bb6a]' 
            : 'text-[#808080] hover:bg-[#222]'
        }`}
        title="Waveform View"
      >
        <Activity size={16} />
      </button>
      <button
        onClick={() => onModeChange('spectrum')}
        className={`p-1.5 rounded-md transition-colors ${
          mode === 'spectrum' 
            ? 'bg-[#2a2a2a] text-[#66bb6a]' 
            : 'text-[#808080] hover:bg-[#222]'
        }`}
        title="Spectrum View"
      >
        <BarChart size={16} />
      </button>
    </div>
  );
};