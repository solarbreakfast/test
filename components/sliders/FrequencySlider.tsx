import React from 'react';
import { Slider } from '../Slider';
import { AUDIO_CONSTRAINTS } from '../../constants/audio';
import { formatFrequency } from '../../utils/formatters';
import { useFrequencyNote } from '../../hooks/useFrequencyNote';

interface FrequencySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const FrequencySlider: React.FC<FrequencySliderProps> = ({ value, onChange }) => {
  const { note, reference } = useFrequencyNote(value);
  
  const formatValue = (freq: number) => {
    return `${formatFrequency(freq)}${note ? ` (${note}${reference ? `, ${reference}` : ''})` : ''}`;
  };

  const formatTickLabel = (freq: number) => {
    if (freq >= 1000) {
      return `${(freq / 1000).toFixed(1)}k`;
    }
    return freq.toString();
  };

  return (
    <Slider
      label="Frequency"
      value={value}
      onChange={onChange}
      min={AUDIO_CONSTRAINTS.frequency.min}
      max={AUDIO_CONSTRAINTS.frequency.max}
      step={AUDIO_CONSTRAINTS.frequency.step}
      formatValue={formatValue}
      formatTickLabel={formatTickLabel}
      ticks={12}
      majorTicks={3}
      logarithmic={true}
    />
  );
};