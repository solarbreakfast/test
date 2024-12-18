import React from 'react';
import { Slider } from '../Slider';
import { AUDIO_CONSTRAINTS } from '../../constants/audio';

interface PitchSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const PitchSlider: React.FC<PitchSliderProps> = ({ value, onChange }) => {
  return (
    <Slider
      label="Pitch"
      value={value}
      onChange={onChange}
      min={AUDIO_CONSTRAINTS.pitch.min}
      max={AUDIO_CONSTRAINTS.pitch.max}
      step={AUDIO_CONSTRAINTS.pitch.step}
      unit="st"
    />
  );
};