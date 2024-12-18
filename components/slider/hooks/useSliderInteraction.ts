import { useState, useCallback } from 'react';
import { rafThrottle } from '../../../utils/performance';

export function useSliderInteraction(onValueChange: (clientX: number) => void) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const throttledMouseMove = rafThrottle(onValueChange);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    onValueChange(e.clientX);
  }, [onValueChange]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    throttledMouseMove(e.clientX);
  }, [isDragging, throttledMouseMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
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