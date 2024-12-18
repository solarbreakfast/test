import { formatDecimal } from './numbers';

export function formatFrequency(freq: number): string {
  if (freq >= 1000) {
    return `${formatDecimal(freq / 1000, 1)}kHz`;
  }
  return `${formatDecimal(freq, 0)}Hz`;
}

export function formatFrequencyWithNote(freq: number, note: string, reference?: string): string {
  const freqStr = formatFrequency(freq);
  if (!note) return freqStr;
  return `${freqStr} (${note}${reference ? `, ${reference}` : ''})`;
}