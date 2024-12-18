import React from 'react';
import { Slider } from '../Slider';
import { AUDIO_CONSTRAINTS } from '../../constants/audio';
import { formatPercentage } from '../../utils/formatters/numbers';

interface VolumeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const VolumeSlider: React.FC<VolumeSliderProps> = ({ value, onChange }) => {
  return (
    <Slider
      label="Volume"
      value={value}
      onChange={onChange}
      min={AUDIO_CONSTRAINTS.volume.min}
      max={AUDIO_CONSTRAINTS.volume.max}
      step={AUDIO_CONSTRAINTS.volume.step}
      formatValue={formatPercentage}
    />
  );
};