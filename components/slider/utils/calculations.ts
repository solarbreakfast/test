interface CalculateValueProps {
  clientX: number;
  rect: DOMRect;
  min: number;
  max: number;
  step: number;
  logarithmic: boolean;
}

export function calculateValue({
  clientX,
  rect,
  min,
  max,
  step,
  logarithmic
}: CalculateValueProps): number {
  const percentage = (clientX - rect.left) / rect.width;
  const boundedPercentage = Math.max(0, Math.min(percentage, 1));
  
  let value: number;
  if (logarithmic && min > 0 && max > 0) {
    const minLog = Math.log(min);
    const maxLog = Math.log(max);
    const valueLog = minLog + boundedPercentage * (maxLog - minLog);
    value = Math.exp(valueLog);
  } else {
    value = min + (max - min) * boundedPercentage;
  }

  return Math.round(value / step) * step;
}

export function calculatePercentage(value: number, min: number, max: number, logarithmic: boolean): number {
  if (logarithmic && min > 0 && max > 0) {
    return ((Math.log(value) - Math.log(min)) / (Math.log(max) - Math.log(min))) * 100;
  }
  return ((value - min) / (max - min)) * 100;
}