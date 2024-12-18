import React from 'react';
import { Slider } from '../Slider';
import { AUDIO_CONSTRAINTS } from '../../constants/audio';
import { formatPercentage } from '../../utils/formatters/numbers';

interface EchoSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const EchoSlider: React.FC<EchoSliderProps> = ({ value, onChange }) => {
  return (
    <Slider
      label="Echo"
      value={value}
      onChange={onChange}
      min={AUDIO_CONSTRAINTS.echo.min}
      max={AUDIO_CONSTRAINTS.echo.max}
      step={AUDIO_CONSTRAINTS.echo.step}
      formatValue={formatPercentage}
    />
  );
};