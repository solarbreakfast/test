interface TickPosition {
  position: number;
  value: number;
  isMajor: boolean;
}

interface CalculateTickPositionsProps {
  count: number;
  majorStep: number;
  min: number;
  max: number;
  logarithmic: boolean;
}

export function calculateTickPositions({
  count,
  majorStep,
  min,
  max,
  logarithmic
}: CalculateTickPositionsProps): TickPosition[] {
  const ticks: TickPosition[] = [];
  const step = (max - min) / count;

  for (let i = 0; i <= count; i++) {
    const isMajor = i % majorStep === 0;
    let position: number;
    let value: number;

    if (logarithmic && min > 0 && max > 0) {
      // Logarithmic scale calculations
      const minLog = Math.log(min);
      const maxLog = Math.log(max);
      const logStep = (maxLog - minLog) / count;
      const logValue = minLog + (i * logStep);
      value = Math.exp(logValue);
      position = ((Math.log(value) - minLog) / (maxLog - minLog)) * 100;
    } else {
      // Linear scale calculations
      value = min + (i * step);
      position = (i / count) * 100;
    }

    // Ensure position is within bounds
    position = Math.max(0, Math.min(100, position));
    
    // Round value to avoid floating point issues
    value = Number(value.toFixed(3));

    ticks.push({ position, value, isMajor });
  }

  return ticks;
}