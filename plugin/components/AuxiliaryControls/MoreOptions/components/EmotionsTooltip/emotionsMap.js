import { emotions } from '~icons';

export const UNITY_EMOTIONS_OBJECT = 'EmotionBridge';

export const emotionsMap = {
  default: {
    action: 'ApplyDefaultEmotion',
    icon: emotions.satisfied,
  },
  happy: {
    action: 'ApplyHappyEmotion',
    icon: emotions['very-satisfied'],
  },
  sad: {
    action: 'ApplySadEmotion',
    icon: emotions.dissatisfied,
  },
  automatic: {
    action: 'ApplyDoubtEmotion',
    icon: emotions.automatic,
  },
};
