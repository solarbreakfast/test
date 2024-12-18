import { useRef, useEffect, useState } from 'react';

export function usePlayheadTracking(currentTime: number, duration: number, isPlaying: boolean): number {
  const [position, setPosition] = useState(0);
  const frameRef = useRef<number>();
  const lastTimeRef = useRef(currentTime);
  const startTimeRef = useRef(performance.now());

  useEffect(() => {
    if (duration <= 0) return;

    const updatePosition = () => {
      if (!isPlaying) {
        // When paused, show exact position
        setPosition((currentTime / duration) * 100);
        return;
      }

      // Calculate elapsed time since last update
      const now = performance.now();
      const elapsed = (now - startTimeRef.current) / 1000;
      const estimatedTime = lastTimeRef.current + elapsed;

      // Calculate percentage with high precision
      const percentage = ((estimatedTime % duration) / duration) * 100;
      setPosition(Math.max(0, Math.min(percentage, 100)));

      frameRef.current = requestAnimationFrame(updatePosition);
    };

    // Reset timing references when playback state or time changes
    startTimeRef.current = performance.now();
    lastTimeRef.current = currentTime;

    frameRef.current = requestAnimationFrame(updatePosition);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [currentTime, duration, isPlaying]);

  return position;
}