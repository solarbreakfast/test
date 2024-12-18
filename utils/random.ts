export function getRandomValue(min: number, max: number, step: number): number {
  const steps = Math.floor((max - min) / step);
  return min + (Math.floor(Math.random() * steps) * step);
}