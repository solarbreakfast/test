import React, { useMemo } from 'react';
import { Tick } from './Tick';

interface SliderTicksProps {
  count: number;
  majorStep: number;
  logarithmic?: boolean;
  min?: number;
  max?: number;
}

export const SliderTicks: React.FC<SliderTicksProps> = ({ 
  count, 
  majorStep,
  logarithmic = false,
  min = 0,
  max = 100
}) => {
  const ticks = useMemo(() => {
    const positions = [];
    const tickCount = count * 2; // Double the tick count for smoother appearance

    for (let i = 0; i <= tickCount; i++) {
      let position;
      if (logarithmic && min > 0 && max > 0) {
        const minLog = Math.log(min);
        const maxLog = Math.log(max);
        const logStep = (maxLog - minLog) / tickCount;
        position = ((i * logStep) / (maxLog - minLog)) * 100;
      } else {
        position = (i / tickCount) * 100;
      }

      // Only add major ticks at original count intervals
      const isMajor = i % 2 === 0 && (i / 2) % majorStep === 0;
      
      positions.push({
        position,
        isMajor
      });
    }
    return positions;
  }, [count, majorStep, logarithmic, min, max]);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-4">
      {ticks.map((tick, i) => (
        <Tick
          key={i}
          position={tick.position}
          isMajor={tick.isMajor}
        />
      ))}
    </div>
  );
};