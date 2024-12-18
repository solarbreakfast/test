import { useCallback, useRef } from 'react';
import { clamp } from '../../../utils/math';
import { calculateValue } from '../utils/calculations';

interface UseSliderValueProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  logarithmic?: boolean;
}

export function useSliderValue({
  min,
  max,
  step,
  value,
  onChange,
  logarithmic = false
}: UseSliderValueProps) {
  const lastValueRef = useRef(value);
  const frameRef = useRef<number>();

  const handleValueChange = useCallback((clientX: number, rect: DOMRect) => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      const newValue = calculateValue({
        clientX,
        rect,
        min,
        max,
        step,
        logarithmic
      });
      
      const clampedValue = clamp(newValue, min, max);
      
      if (clampedValue !== lastValueRef.current) {
        lastValueRef.current = clampedValue;
        onChange(clampedValue);
      }
    });
  }, [min, max, step, onChange, logarithmic]);

  return {
    handleValueChange,
    frameRef
  };
}