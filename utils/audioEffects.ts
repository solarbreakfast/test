import { AudioNodes, AudioState } from '../types/audio';

export function applyAudioEffects(nodes: AudioNodes, param: keyof AudioState, value: number) {
  const ctx = nodes.gainNode.context;
  const now = ctx.currentTime;

  switch (param) {
    case 'tempo':
      if (nodes.sourceNode) {
        nodes.sourceNode.playbackRate.setTargetAtTime(value, now, 0.016);
      }
      break;
      
    case 'pitch':
      if (nodes.sourceNode) {
        nodes.sourceNode.detune.setTargetAtTime(value * 100, now, 0.016);
      }
      break;
      
    case 'frequency':
      nodes.filterNode.frequency.setTargetAtTime(value, now, 0.016);
      break;
      
    case 'volume':
      const gainValue = Math.pow(value / 100, 2);
      nodes.gainNode.gain.setTargetAtTime(gainValue, now, 0.016);
      break;
      
    case 'noise':
      if (nodes.noiseGainNode) {
        const noiseValue = (value / 100) * 0.15;
        nodes.noiseGainNode.gain.setTargetAtTime(noiseValue, now, 0.016);
      }
      break;
      
    case 'echo':
      if (nodes.echoGainNode && nodes.feedbackNode) {
        const normalizedEcho = value / 100;
        nodes.echoGainNode.gain.setTargetAtTime(normalizedEcho * 0.75, now, 0.016);
        nodes.feedbackNode.gain.setTargetAtTime(normalizedEcho * 0.5, now, 0.016);
      }
      break;
  }
}