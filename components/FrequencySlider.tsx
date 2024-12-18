import React from 'react';
import { MUSICAL_FREQUENCIES } from '../constants/frequencies';
import { formatFrequency } from '../utils/formatters';

interface FrequencySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const FrequencySlider: React.FC<FrequencySliderProps> = ({ value, onChange }) => {
  const getNearestNote = (freq: number) => {
    return MUSICAL_FREQUENCIES.reduce((prev, curr) => {
      return Math.abs(curr.freq - freq) < Math.abs(prev.freq - freq) ? curr : prev;
    });
  };

  const getFrequencyLabel = (freq: number) => {
    const note = getNearestNote(freq);
    return `${formatFrequency(freq)} (${note.note}${note.reference ? `, ${note.reference}` : ''})`;
  };

  const formatTickValue = (freq: number) => {
    if (freq >= 1000) {
      return `${(freq / 1000).toFixed(1)}k`;
    }
    return freq.toString();
  };

  // Logarithmic scale tick marks for better visualization
  const tickFrequencies = [
    20, 50, 100, 174, 285, 396, 417, 432, 440, 528, 
    639, 741, 852, 963, 1000, 2000, 5000, 10000, 20000
  ];

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs uppercase tracking-wider text-[#808080]">Frequency</span>
        <span className="value-display font-mono">{getFrequencyLabel(value)}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={20}
          max={20000}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider w-full"
        />
        <div className="slider-ticks">
          {tickFrequencies.map((freq, i) => (
            <React.Fragment key={freq}>
              <div
                className="slider-tick major"
                style={{ 
                  left: `${(Math.log10(freq) - Math.log10(20)) / (Math.log10(20000) - Math.log10(20)) * 100}%` 
                }}
              />
              <div
                className="slider-tick-label"
                style={{ 
                  left: `${(Math.log10(freq) - Math.log10(20)) / (Math.log10(20000) - Math.log10(20)) * 100}%` 
                }}
              >
                {formatTickValue(freq)}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};