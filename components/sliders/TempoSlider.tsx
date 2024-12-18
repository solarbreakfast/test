import React from 'react';
import { Slider } from '../Slider';
import { AUDIO_CONSTRAINTS } from '../../constants/audio';
import { formatMultiplier } from '../../utils/formatters/numbers';

interface TempoSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const TempoSlider: React.FC<TempoSliderProps> = ({ value, onChange }) => {
  return (
    <Slider
      label="Tempo"
      value={value}
      onChange={onChange}
      min={AUDIO_CONSTRAINTS.tempo.min}
      max={AUDIO_CONSTRAINTS.tempo.max}
      step={AUDIO_CONSTRAINTS.tempo.step}
      formatValue={formatMultiplier}
      showTickLabels={false}
    />
  );
};