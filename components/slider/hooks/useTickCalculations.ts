import { useMemo } from 'react';
import { calculateTickPositions } from '../utils/tickCalculations';

interface UseTickCalculationsProps {
  count: number;
  majorStep: number;
  min: number;
  max: number;
  logarithmic: boolean;
}

export function useTickCalculations({
  count,
  majorStep,
  min,
  max,
  logarithmic
}: UseTickCalculationsProps) {
  return useMemo(() => {
    return calculateTickPositions({
      count,
      majorStep,
      min,
      max,
      logarithmic
    });
  }, [count, majorStep, min, max, logarithmic]);
}