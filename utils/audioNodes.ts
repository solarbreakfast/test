import { AudioNodes, AudioState } from '../types/audio';
import { createNoiseBuffer } from './noiseGenerator';

export function createAudioNodes(context: AudioContext): AudioNodes {
  const compressor = createCompressor(context);
  const gainNode = context.createGain();
  const analyserNode = context.createAnalyser();
  const filterNode = context.createBiquadFilter();
  const { noiseNode, noiseFilter, noiseGainNode } = createNoiseNodes(context);
  const { echoNode, echoGainNode, feedbackNode } = createEchoNodes(context);
  
  // Set initial node states
  gainNode.gain.value = 1.0;
  filterNode.type = 'lowpass';
  filterNode.frequency.value = 20000;
  filterNode.Q.value = 1.0;
  
  setupNodeConnections(context, {
    gainNode,
    analyserNode,
    filterNode,
    noiseNode,
    noiseGainNode,
    noiseFilter,
    compressor,
    echoNode,
    echoGainNode,
    feedbackNode
  });
  
  return {
    gainNode,
    analyserNode,
    filterNode,
    noiseNode,
    noiseGainNode,
    noiseFilter,
    compressor,
    echoNode,
    echoGainNode,
    feedbackNode
  };
}

function createCompressor(context: AudioContext): DynamicsCompressorNode {
  const compressor = context.createDynamicsCompressor();
  compressor.threshold.value = -24;
  compressor.knee.value = 30;
  compressor.ratio.value = 12;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.25;
  return compressor;
}

function createNoiseNodes(context: AudioContext) {
  const noiseBuffer = createNoiseBuffer(context);
  const noiseNode = context.createBufferSource();
  const noiseFilter = context.createBiquadFilter();
  const noiseGainNode = context.createGain();
  
  noiseNode.buffer = noiseBuffer;
  noiseNode.loop = true;
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = 1000;
  noiseFilter.Q.value = 0.5;
  noiseGainNode.gain.value = 0;
  
  return { noiseNode, noiseFilter, noiseGainNode };
}

function createEchoNodes(context: AudioContext) {
  const echoNode = context.createDelay(2.0);
  const echoGainNode = context.createGain();
  const feedbackNode = context.createGain();

  echoNode.delayTime.value = 0.5;
  echoGainNode.gain.value = 0;
  feedbackNode.gain.value = 0;

  return { echoNode, echoGainNode, feedbackNode };
}

function setupNodeConnections(context: AudioContext, nodes: AudioNodes) {
  const {
    gainNode,
    analyserNode,
    filterNode,
    noiseNode,
    noiseGainNode,
    noiseFilter,
    compressor,
    echoNode,
    echoGainNode,
    feedbackNode
  } = nodes;

  // Main signal path
  gainNode.connect(filterNode);
  filterNode.connect(compressor);
  
  // Echo path
  if (echoNode && echoGainNode && feedbackNode) {
    filterNode.connect(echoNode);
    echoNode.connect(echoGainNode);
    echoGainNode.connect(compressor);
    
    // Feedback loop
    echoGainNode.connect(feedbackNode);
    feedbackNode.connect(echoNode);
  }

  // Noise path
  if (noiseNode && noiseFilter && noiseGainNode) {
    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGainNode);
    noiseGainNode.connect(compressor);
    noiseNode.start(0);
  }

  // Final output path
  compressor.connect(analyserNode);
  analyserNode.connect(context.destination);
}