import React from 'react';
import { SliderTrack } from './slider/SliderTrack';
import { SliderKnob } from './slider/SliderKnob';
import { SliderTicks } from './slider/SliderTicks';
import { useSliderControl } from '../hooks/useSliderControl';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  formatValue?: (value: number) => string;
  ticks?: number;
  majorTicks?: number;
  logarithmic?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  formatValue,
  ticks = 10,
  majorTicks = 5,
  logarithmic = false
}) => {
  const {
    sliderRef,
    isDragging,
    isHovered,
    handlers
  } = useSliderControl({
    min,
    max,
    step,
    value,
    onChange,
    logarithmic
  });

  const displayValue = formatValue ? formatValue(value) : value.toString();
  const percentage = logarithmic && min > 0 && max > 0
    ? ((Math.log(value) - Math.log(min)) / (Math.log(max) - Math.log(min))) * 100
    : ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs uppercase tracking-wider text-[#808080]">{label}</span>
        <span className={`value-display font-mono transition-opacity duration-150 ${
          isDragging ? 'text-[#66bb6a]' : ''
        }`}>
          {displayValue}
        </span>
      </div>
      <div 
        ref={sliderRef}
        className="relative h-12 cursor-pointer"
        {...handlers}
      >
        <SliderTrack 
          percentage={percentage} 
          isActive={isDragging || isHovered}
        />
        <SliderKnob 
          percentage={percentage} 
          isActive={isDragging || isHovered}
        />
        <SliderTicks 
          count={ticks} 
          majorStep={majorTicks}
          logarithmic={logarithmic}
          min={min}
          max={max}
        />
      </div>
    </div>
  );
};