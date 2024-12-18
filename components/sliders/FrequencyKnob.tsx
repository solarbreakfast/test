import React from 'react';
import { Knob } from '../Knob';
import { AUDIO_CONSTRAINTS } from '../../constants/audio';
import { formatFrequency } from '../../utils/formatters';
import { MUSICAL_FREQUENCIES } from '../../constants/frequencies';

interface FrequencyKnobProps {
  value: number;
  onChange: (value: number) => void;
}

export const FrequencyKnob: React.FC<FrequencyKnobProps> = ({ value, onChange }) => {
  const getNearestNote = (freq: number) => {
    return MUSICAL_FREQUENCIES.reduce((prev, curr) => {
      return Math.abs(curr.freq - freq) < Math.abs(prev.freq - freq) ? curr : prev;
    });
  };

  const formatValue = (freq: number) => {
    const note = getNearestNote(freq);
    return `${formatFrequency(freq)}\n${note.note}`;
  };

  return (
    <Knob
      label="Frequency"
      value={value}
      onChange={onChange}
      min={AUDIO_CONSTRAINTS.frequency.min}
      max={AUDIO_CONSTRAINTS.frequency.max}
      step={AUDIO_CONSTRAINTS.frequency.step}
      formatValue={formatValue}
    />
  );
};