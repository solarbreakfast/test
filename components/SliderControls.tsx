import React from 'react';
import { FrequencySlider } from './sliders/FrequencySlider';
import { TempoSlider } from './sliders/TempoSlider';
import { PitchSlider } from './sliders/PitchSlider';
import { NoiseSlider } from './sliders/NoiseSlider';
import { EchoSlider } from './sliders/EchoSlider';

interface SliderControlsProps {
  // ... existing props ...
}

export const SliderControls: React.FC<SliderControlsProps> = ({
  // ... existing props ...
}) => {
  return (
    <div className="space-y-6">
      <FrequencySlider value={frequency} onChange={onFrequencyChange} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <TempoSlider value={tempo} onChange={onTempoChange} />
        <PitchSlider value={pitch} onChange={onPitchChange} />
        <NoiseSlider value={noise} onChange={onNoiseChange} />
        <EchoSlider value={echo} onChange={onEchoChange} />
      </div>
    </div>
  );
};