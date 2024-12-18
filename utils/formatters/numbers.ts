export function formatDecimal(value: number, precision: number = 1): string {
  // Prevent scientific notation and round to specified precision
  return Number(value.toFixed(precision)).toString();
}

export function formatPercentage(value: number): string {
  return `${formatDecimal(value, 0)}%`;
}

export function formatMultiplier(value: number): string {
  return `${formatDecimal(value, 1)}x`;
}