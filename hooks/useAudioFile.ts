import { useState, useCallback, useRef } from 'react';
import { createAudioContext } from '../utils/audioContext';

export function useAudioFile() {
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [duration, setDuration] = useState(0);
  const channelBuffers = useRef<AudioBuffer[]>([]);

  const loadFile = useCallback(async (file: File) => {
    try {
      const audioContext = await createAudioContext();
      const arrayBuffer = await file.arrayBuffer();
      const buffer = await audioContext.decodeAudioData(arrayBuffer);
      
      channelBuffers.current = [buffer];
      setAudioBuffer(buffer);
      setCurrentFile(file.name);
      setDuration(buffer.duration);
      
      return { audioContext, buffer };
    } catch (error) {
      console.error('Error loading audio file:', error);
      throw error;
    }
  }, []);

  const addToChannel = useCallback(async (file: File) => {
    try {
      const audioContext = await createAudioContext();
      const arrayBuffer = await file.arrayBuffer();
      const newBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Combine with existing buffers
      if (channelBuffers.current.length > 0) {
        const maxDuration = Math.max(
          ...channelBuffers.current.map(b => b.duration),
          newBuffer.duration
        );
        
        const combinedBuffer = audioContext.createBuffer(
          Math.max(...channelBuffers.current.map(b => b.numberOfChannels), newBuffer.numberOfChannels),
          Math.ceil(maxDuration * audioContext.sampleRate),
          audioContext.sampleRate
        );

        // Mix all existing buffers
        for (const buffer of [...channelBuffers.current, newBuffer]) {
          for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const channelData = buffer.getChannelData(channel);
            const combinedData = combinedBuffer.getChannelData(channel);
            
            for (let i = 0; i < channelData.length; i++) {
              combinedData[i] = (combinedData[i] || 0) + channelData[i];
            }
          }
        }

        // Normalize to prevent clipping
        for (let channel = 0; channel < combinedBuffer.numberOfChannels; channel++) {
          const data = combinedBuffer.getChannelData(channel);
          const max = Math.max(...data.map(Math.abs));
          if (max > 1) {
            for (let i = 0; i < data.length; i++) {
              data[i] /= max;
            }
          }
        }

        channelBuffers.current.push(newBuffer);
        setAudioBuffer(combinedBuffer);
        setDuration(maxDuration);
      }
      
      return { audioContext, buffer: newBuffer };
    } catch (error) {
      console.error('Error adding audio to channel:', error);
      throw error;
    }
  }, []);

  const clearFile = useCallback(() => {
    setCurrentFile(null);
    setAudioBuffer(null);
    setDuration(0);
    channelBuffers.current = [];
  }, []);

  return {
    currentFile,
    audioBuffer,
    duration,
    loadFile,
    addToChannel,
    clearFile
  };
}