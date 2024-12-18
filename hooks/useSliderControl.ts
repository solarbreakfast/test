import { useCallback, useRef, useState, useEffect } from 'react';
import { clamp } from '../utils/math';
import { rafThrottle } from '../utils/performance';

interface UseSliderControlProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  logarithmic?: boolean;
}

export function useSliderControl({
  min,
  max,
  step,
  value,
  onChange,
  logarithmic = false
}: UseSliderControlProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const lastValueRef = useRef(value);
  const frameRef = useRef<number>();

  const calculateValueFromPosition = useCallback((clientX: number) => {
    if (!sliderRef.current) return value;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = clamp((clientX - rect.left) / rect.width, 0, 1);
    
    let newValue: number;
    if (logarithmic && min > 0 && max > 0) {
      const minLog = Math.log(min);
      const maxLog = Math.log(max);
      const valueLog = minLog + percentage * (maxLog - minLog);
      newValue = Math.exp(valueLog);
    } else {
      newValue = min + (max - min) * percentage;
    }

    return Math.round(newValue / step) * step;
  }, [value, min, max, step, logarithmic]);

  const handleValueChange = useCallback((clientX: number) => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      const newValue = calculateValueFromPosition(clientX);
      const clampedValue = clamp(newValue, min, max);
      
      if (clampedValue !== lastValueRef.current) {
        lastValueRef.current = clampedValue;
        onChange(clampedValue);
      }
    });
  }, [calculateValueFromPosition, min, max, onChange]);

  const throttledMouseMove = rafThrottle(handleValueChange);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleValueChange(e.clientX);
  }, [handleValueChange]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    throttledMouseMove(e.clientX);
  }, [isDragging, throttledMouseMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return {
    sliderRef,
    isDragging,
    isHovered,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false)
    }
  };
}