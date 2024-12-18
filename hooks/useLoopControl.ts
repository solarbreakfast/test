import { useState, useCallback } from 'react';
import { AudioNodes } from '../types/audio';

export function useLoopControl(nodes: AudioNodes | null) {
  const [isLooping, setIsLooping] = useState(true);

  const toggleLoop = useCallback(() => {
    setIsLooping(prev => {
      const newState = !prev;
      if (nodes?.sourceNode) {
        nodes.sourceNode.loop = newState;
      }
      return newState;
    });
  }, [nodes]);

  const setLoop = useCallback((state: boolean) => {
    setIsLooping(state);
    if (nodes?.sourceNode) {
      nodes.sourceNode.loop = state;
    }
  }, [nodes]);

  return {
    isLooping,
    toggleLoop,
    setLoop
  };
}