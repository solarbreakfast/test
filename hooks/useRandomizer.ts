import { useState, useCallback, useRef } from 'react';
import { AudioState } from '../types/audio';
import { useRandomState } from './useRandomState';

export function useRandomizer(
  onParameterChange: (param: keyof AudioState, value: number) => void
) {
  const [isGenerating, setIsGenerating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { generateNewState, updateState, getState } = useRandomState();

  const generateRandomParameters = useCallback(() => {
    if (isGenerating) return;
    setIsGenerating(true);

    // Generate and apply new random state
    const newState = generateNewState();
    Object.entries(newState).forEach(([param, value]) => {
      onParameterChange(param as keyof AudioState, value);
    });

    // Reset generating state after delay
    timeoutRef.current = setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  }, [isGenerating, generateNewState, onParameterChange]);

  const restoreRandomState = useCallback(() => {
    const currentState = getState();
    Object.entries(currentState).forEach(([param, value]) => {
      onParameterChange(param as keyof AudioState, value);
    });
  }, [onParameterChange, getState]);

  const updateParameter = useCallback((param: keyof AudioState, value: number) => {
    updateState(param, value);
  }, [updateState]);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    isGenerating,
    generateRandomParameters,
    restoreRandomState,
    updateParameter,
    cleanup
  };
}