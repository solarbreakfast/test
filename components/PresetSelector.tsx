import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PRESETS, Preset } from '../constants/presets';
import { AudioState } from '../types/audio';

interface PresetSelectorProps {
  onPresetSelect: (presetId: string, state: AudioState) => void;
  activePreset: string | null;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ 
  onPresetSelect,
  activePreset 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative">
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleExpand}
        className="md:hidden w-full flex items-center justify-between p-3 bg-[#1a1a1a] border border-[#333] rounded-lg mb-2"
      >
        <span className="text-xs uppercase tracking-wider text-[#808080]">
          Presets {activePreset && `(${PRESETS.find(p => p.id === activePreset)?.name})`}
        </span>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Preset Grid */}
      <div className={`
        grid gap-2 transition-all duration-200
        md:grid-cols-5 md:min-w-0
        ${isExpanded ? 'grid-cols-2' : 'hidden md:grid'}
      `}>
        {PRESETS.map((preset) => {
          const Icon = preset.Icon;
          const isActive = activePreset === preset.id;
          
          return (
            <button
              key={preset.id}
              onClick={() => {
                onPresetSelect(preset.id, preset.state);
                setIsExpanded(false);
              }}
              className={`
                flex items-center justify-center w-full p-3 rounded
                transition-colors duration-200 space-x-2 whitespace-nowrap
                ${isActive 
                  ? 'bg-[#2a2a2a] border-[#66bb6a] text-[#66bb6a] shadow-[0_0_10px_rgba(102,187,106,0.1)]' 
                  : 'bg-[#1a1a1a] border-[#333] text-[#808080] hover:bg-[#222]'
                } border
              `}
              title={preset.name}
            >
              <Icon size={18} />
              <span className="text-xs font-medium tracking-wide uppercase">
                {preset.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};