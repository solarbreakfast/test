import { useState, useCallback, useRef } from 'react';
import { AudioNodes } from '../types/audio';
import { createAudioNodes } from '../utils/audioNodes';

export function useAudioNodes() {
  const [nodes, setNodes] = useState<AudioNodes | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const createNodes = useCallback(async (context: AudioContext) => {
    if (nodes) {
      disposeNodes();
    }
    
    audioContextRef.current = context;
    const newNodes = createAudioNodes(context);
    setNodes(newNodes);
  }, [nodes]);

  const disposeNodes = useCallback(() => {
    if (nodes) {
      // Clean up nodes
      nodes.gainNode.disconnect();
      nodes.analyserNode.disconnect();
      nodes.filterNode.disconnect();
      nodes.noiseNode?.disconnect();
      nodes.noiseGainNode?.disconnect();
      nodes.noiseFilter?.disconnect();
      nodes.compressor.disconnect();
      setNodes(null);
    }
  }, [nodes]);

  return {
    audioContext: audioContextRef.current,
    nodes,
    createNodes,
    disposeNodes
  };
}