import { emotions } from '~icons';

export const emotionsMap = {
  default: {
    action: 'ApplyDefaultEmotion',
    icon: emotions.default,
    intensity: 2,
  },

  happy: {
    name: 'Feliz',
    action: 'ApplyHappyEmotion',
    icon: emotions.happy,
    intensity: 2,
  },

  sad: {
    action: 'ApplySadEmotion',
    icon: emotions.sad,
    intensity: 2,
  },

  doubt: {
    action: 'ApplyDoubtEmotion',
    icon: emotions.doubt,
    intensity: 2,
  },

  angry: {
    action: 'ApplyAngryEmotion',
    icon: emotions.angry,
    intensity: 2,
  },

  disgust: {
    action: 'ApplyDisgustEmotion',
    icon: emotions.disgust,
    intensity: 2,
  },

  fear: {
    action: 'ApplyFearEmotion',
    icon: emotions.fear,
    intensity: 2,
  },

  surprise: {
    action: 'ApplySurpriseEmotion',
    icon: emotions.surprise,
    intensity: 2,
  },

  automatic: {
    action: 'ApplyDoubtEmotion',
    icon: emotions.automatic,
    intensity: 2,
  },
};
