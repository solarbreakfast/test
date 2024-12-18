import { useRef, useCallback } from 'react';
import { AudioState } from '../types/audio';
import { getConstraintsForParam } from '../utils/random/constraints';
import { generateRandomParameters, RandomParameters } from '../utils/random/parameters';
import { AUDIO_CONSTRAINTS } from '../constants';

export function useRandomState() {
  // Store the last generated random state
  const stateRef = useRef<RandomParameters>({
    tempo: AUDIO_CONSTRAINTS.tempo.default,
    pitch: AUDIO_CONSTRAINTS.pitch.default,
    frequency: AUDIO_CONSTRAINTS.frequency.default,
    noise: AUDIO_CONSTRAINTS.noise.default,
    echo: AUDIO_CONSTRAINTS.echo.default
  });

  const generateNewState = useCallback((): RandomParameters => {
    // Get constraints for all parameters
    const constraints = {
      tempo: getConstraintsForParam('tempo'),
      pitch: getConstraintsForParam('pitch'),
      frequency: getConstraintsForParam('frequency'),
      noise: getConstraintsForParam('noise'),
      echo: getConstraintsForParam('echo')
    };

    // Generate new random state
    const newState = generateRandomParameters(constraints);
    stateRef.current = newState;
    return newState;
  }, []);

  const updateState = useCallback((param: keyof RandomParameters, value: number) => {
    stateRef.current = {
      ...stateRef.current,
      [param]: value
    };
  }, []);

  const getState = useCallback(() => stateRef.current, []);

  return {
    generateNewState,
    updateState,
    getState
  };
}