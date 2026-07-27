import { UNITY_METHODS } from "@/player/constants/unity";
import type { IconName } from "@/widget/icons/types";

export type Emotion = {
	name: string;
	action: UNITY_METHODS;
	icon: IconName;
	intensity: number;
};

export type EmotionKey = "default" | "happy" | "sad" | "angry" | "disgust" | "fear" | "surprise" | "upset";

export const emotionsMap: Record<EmotionKey, Emotion> = {
	default: {
		name: "Padrão",
		action: UNITY_METHODS.APPLY_DEFAULT_EMOTION,
		icon: "emotions/default",
		intensity: 2,
	},

	happy: {
		name: "Feliz",
		action: UNITY_METHODS.APPLY_HAPPY_EMOTION,
		icon: "emotions/happy",
		intensity: 2,
	},

	sad: {
		name: "Triste",
		action: UNITY_METHODS.APPLY_SAD_EMOTION,
		icon: "emotions/sad",
		intensity: 2,
	},

	angry: {
		name: "Raiva",
		action: UNITY_METHODS.APPLY_ANGRY_EMOTION,
		icon: "emotions/angry",
		intensity: 2,
	},

	disgust: {
		name: "Nojo",
		action: UNITY_METHODS.APPLY_DISGUST_EMOTION,
		icon: "emotions/disgust",
		intensity: 2,
	},

	fear: {
		name: "Medo",
		action: UNITY_METHODS.APPLY_FEAR_EMOTION,
		icon: "emotions/fear",
		intensity: 2,
	},

	surprise: {
		name: "Surpresa",
		action: UNITY_METHODS.APPLY_SURPRISE_EMOTION,
		icon: "emotions/surprise",
		intensity: 2,
	},

	upset: {
		name: "Chateado",
		action: UNITY_METHODS.APPLY_UPSET_EMOTION,
		icon: "emotions/upset",
		intensity: 2,
	},
};
