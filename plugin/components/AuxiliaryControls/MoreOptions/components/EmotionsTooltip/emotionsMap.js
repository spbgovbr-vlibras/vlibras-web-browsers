import { emotions } from '~icons';

export const UNITY_EMOTIONS_OBJECT = 'FacialExpressionBridge';

export const emotionsMap = {
  default: {
    action: 'ApplyDefaultExpression',
    icon: emotions.satisfied,
  },
  happy: {
    action: 'ApplyHappyExpression',
    icon: emotions['very-satisfied'],
  },
  sad: {
    action: 'ApplySadExpression',
    icon: emotions.dissatisfied,
  },
  automatic: {
    action: 'ApplyDoubtExpression',
    icon: emotions.automatic,
  },
};
