import React from 'react';
import { Slider } from '../Slider';
import { AUDIO_CONSTRAINTS } from '../../constants/audio';
import { formatPercentage } from '../../utils/formatters/numbers';

interface NoiseSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const NoiseSlider: React.FC<NoiseSliderProps> = ({ value, onChange }) => {
  return (
    <Slider
      label="Noise"
      value={value}
      onChange={onChange}
      min={AUDIO_CONSTRAINTS.noise.min}
      max={AUDIO_CONSTRAINTS.noise.max}
      step={AUDIO_CONSTRAINTS.noise.step}
      formatValue={formatPercentage}
    />
  );
};