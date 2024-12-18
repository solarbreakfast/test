export function createEchoNodes(context: AudioContext) {
  const echoNode = context.createDelay(2.0);
  const echoGainNode = context.createGain();
  const feedbackNode = context.createGain();

  echoNode.delayTime.value = 0.5;
  echoGainNode.gain.value = 0;
  feedbackNode.gain.value = 0;

  return { echoNode, echoGainNode, feedbackNode };
}