import React from 'react';
import { Knob } from '../Knob';
import { AUDIO_CONSTRAINTS } from '../../constants/audio';

interface VolumeKnobProps {
  value: number;
  onChange: (value: number) => void;
}

export const VolumeKnob: React.FC<VolumeKnobProps> = ({ value, onChange }) => {
  return (
    <Knob
      label="Volume"
      value={value}
      onChange={onChange}
      min={AUDIO_CONSTRAINTS.volume.min}
      max={AUDIO_CONSTRAINTS.volume.max}
      step={AUDIO_CONSTRAINTS.volume.step}
      formatValue={(value) => `${value}%`}
      size={60}
      grooves={28} // Add more grooves for finer control
      color="#66bb6a"
    />
  );
};