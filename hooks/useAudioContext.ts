import { useState, useCallback } from 'react';

export function useAudioContext() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const initializeContext = useCallback(async () => {
    if (!audioContext) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      setAudioContext(ctx);
      return ctx;
    }
    return audioContext;
  }, [audioContext]);

  const ensureContext = useCallback(async () => {
    if (!audioContext) {
      return initializeContext();
    }
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    return audioContext;
  }, [audioContext, initializeContext]);

  return {
    audioContext,
    initializeContext,
    ensureContext
  };
}