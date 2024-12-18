import React, { useEffect, useRef } from 'react';
import { SliderTrack } from './SliderTrack';
import { SliderKnob } from './SliderKnob';
import { SliderTicks } from './SliderTicks';
import { useSliderValue } from './hooks/useSliderValue';
import { useSliderInteraction } from './hooks/useSliderInteraction';
import { calculatePercentage } from './utils/calculations';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  formatValue?: (value: number) => string;
  formatTickLabel?: (value: number) => string;
  ticks?: number;
  majorTicks?: number;
  logarithmic?: boolean;
  showTickLabels?: boolean;
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
  const sliderRef = useRef<HTMLDivElement>(null);
  const { handleValueChange, frameRef } = useSliderValue({
    min,
    max,
    step,
    value,
    onChange,
    logarithmic
  });

  const onValueChange = (clientX: number) => {
    if (!sliderRef.current) return;
    handleValueChange(clientX, sliderRef.current.getBoundingClientRect());
  };

  const { isDragging, isHovered, handlers } = useSliderInteraction(onValueChange);

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const displayValue = formatValue ? formatValue(value) : value.toString();
  const percentage = calculatePercentage(value, min, max, logarithmic);

  return (
    <div className="relative pt-8 pb-2">
      {/* Label and value display */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center mb-2">
        <span className="text-xs uppercase tracking-wider text-[#808080]">{label}</span>
        <span className={`value-display font-mono transition-all duration-150 ${
          isDragging ? 'text-[#66bb6a] scale-110' : ''
        }`}>
          {displayValue}
        </span>
      </div>

      {/* Slider track and interaction area */}
      <div 
        ref={sliderRef}
        className="relative h-8 cursor-pointer"
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