import { useMemo } from 'react';
import { MUSICAL_FREQUENCIES } from '../constants/frequencies';

export function useFrequencyNote(frequency: number) {
  return useMemo(() => {
    const nearestNote = MUSICAL_FREQUENCIES.reduce((prev, curr) => {
      return Math.abs(curr.freq - frequency) < Math.abs(prev.freq - frequency) ? curr : prev;
    });

    return {
      note: nearestNote.note,
      reference: nearestNote.reference
    };
  }, [frequency]);
}