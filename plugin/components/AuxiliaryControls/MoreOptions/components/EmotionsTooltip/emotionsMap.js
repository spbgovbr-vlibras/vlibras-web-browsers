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
  doubt: {
    action: 'ApplyDoubtEmotion',
    icon: emotions.doubt,
  },
  automatic: {
    action: 'ApplyDoubtEmotion',
    icon: emotions.automatic,
  },
};
