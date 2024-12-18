export const AUDIO_CONSTRAINTS = {
  tempo: {
    min: 0.5,
    max: 2,
    step: 0.1,
    default: 1
  },
  pitch: {
    min: -12,
    max: 12,
    step: 1,
    default: 0
  },
  frequency: {
    min: 20,
    max: 20000,
    step: 1,
    default: 16000 // Set default to B9 frequency
  },
  volume: {
    min: 0,
    max: 300,
    step: 1,
    default: 100
  },
  noise: {
    min: 0,
    max: 100,
    step: 1,
    default: 0
  },
  echo: {
    min: 0,
    max: 100,
    step: 1,
    default: 0
  }
} as const;