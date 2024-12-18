import { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AudioTrack, AudioState } from '../types/audio';
import { createAudioNodes } from '../utils/audioNodes';
import { AUDIO_CONSTRAINTS } from '../constants';

export function useTrackManager(audioContext: AudioContext | null) {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const masterGainNode = useRef<GainNode | null>(null);

  // Initialize master gain node
  const initializeMasterGain = useCallback(() => {
    if (!audioContext) return;
    if (!masterGainNode.current) {
      masterGainNode.current = audioContext.createGain();
      masterGainNode.current.connect(audioContext.destination);
    }
  }, [audioContext]);

  // Add a new track
  const addTrack = useCallback(async (buffer: AudioBuffer, name: string) => {
    if (!audioContext) return;

    initializeMasterGain();

    const trackId = uuidv4();
    const nodes = createAudioNodes(audioContext);
    
    // Connect track output to master gain
    nodes.compressor.disconnect();
    nodes.compressor.connect(masterGainNode.current!);

    const newTrack: AudioTrack = {
      id: trackId,
      name,
      buffer,
      nodes,
      state: {
        tempo: AUDIO_CONSTRAINTS.tempo.default,
        pitch: AUDIO_CONSTRAINTS.pitch.default,
        frequency: AUDIO_CONSTRAINTS.frequency.default,
        volume: AUDIO_CONSTRAINTS.volume.default,
        noise: AUDIO_CONSTRAINTS.noise.default,
        echo: AUDIO_CONSTRAINTS.echo.default
      },
      isPlaying: false,
      isMuted: false,
      volume: 100
    };

    setTracks(prev => [...prev, newTrack]);
    if (!activeTrackId) {
      setActiveTrackId(trackId);
    }

    return trackId;
  }, [audioContext, initializeMasterGain]);

  // Remove a track
  const removeTrack = useCallback((trackId: string) => {
    setTracks(prev => {
      const track = prev.find(t => t.id === trackId);
      if (track) {
        // Clean up audio nodes
        Object.values(track.nodes).forEach(node => {
          if (node && 'disconnect' in node) {
            node.disconnect();
          }
        });
      }
      return prev.filter(t => t.id !== trackId);
    });

    if (activeTrackId === trackId) {
      setActiveTrackId(tracks[0]?.id || null);
    }
  }, [activeTrackId, tracks]);

  // Update track state
  const updateTrackState = useCallback((trackId: string, updates: Partial<AudioState>) => {
    setTracks(prev => prev.map(track => {
      if (track.id === trackId) {
        return {
          ...track,
          state: { ...track.state, ...updates }
        };
      }
      return track;
    }));
  }, []);

  // Set track volume
  const setTrackVolume = useCallback((trackId: string, volume: number) => {
    setTracks(prev => prev.map(track => {
      if (track.id === trackId) {
        track.nodes.gainNode.gain.setValueAtTime(
          volume / 100,
          audioContext?.currentTime || 0
        );
        return { ...track, volume };
      }
      return track;
    }));
  }, [audioContext]);

  // Toggle track mute
  const toggleTrackMute = useCallback((trackId: string) => {
    setTracks(prev => prev.map(track => {
      if (track.id === trackId) {
        const isMuted = !track.isMuted;
        track.nodes.gainNode.gain.setValueAtTime(
          isMuted ? 0 : track.volume / 100,
          audioContext?.currentTime || 0
        );
        return { ...track, isMuted };
      }
      return track;
    }));
  }, [audioContext]);

  return {
    tracks,
    activeTrackId,
    setActiveTrackId,
    addTrack,
    removeTrack,
    updateTrackState,
    setTrackVolume,
    toggleTrackMute,
    masterGainNode: masterGainNode.current
  };
}