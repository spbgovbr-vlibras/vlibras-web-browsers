import { UNITY_METHODS } from "@/player/constants/unity";
import type { IconName } from "@/widget/icons/types";

export type Emotion = {
	name: string;
	action: UNITY_METHODS;
	icon: IconName;
	intensity: number;
};

export type EmotionKey = "default" | "happy" | "sad" | "doubt" | "angry" | "disgust" | "fear" | "surprise";

export const emotionsMap: Record<EmotionKey, Emotion> = {
	default: {
		name: "Padrão",
		action: UNITY_METHODS.APPLY_DEFAULT_EMOTION,
		icon: "emotions-icons/default",
		intensity: 2,
	},

	happy: {
		name: "Feliz",
		action: UNITY_METHODS.APPLY_HAPPY_EMOTION,
		icon: "emotions-icons/happy",
		intensity: 2,
	},

	sad: {
		name: "Triste",
		action: UNITY_METHODS.APPLY_SAD_EMOTION,
		icon: "emotions-icons/sad",
		intensity: 2,
	},

	doubt: {
		name: "Dúvida",
		action: UNITY_METHODS.APPLY_DOUBT_EMOTION,
		icon: "emotions-icons/doubt",
		intensity: 2,
	},

	angry: {
		name: "Raiva",
		action: UNITY_METHODS.APPLY_ANGRY_EMOTION,
		icon: "emotions-icons/angry",
		intensity: 2,
	},

	disgust: {
		name: "Nojo",
		action: UNITY_METHODS.APPLY_DISGUST_EMOTION,
		icon: "emotions-icons/disgust",
		intensity: 2,
	},

	fear: {
		name: "Medo",
		action: UNITY_METHODS.APPLY_FEAR_EMOTION,
		icon: "emotions-icons/fear",
		intensity: 2,
	},

	surprise: {
		name: "Surpresa",
		action: UNITY_METHODS.APPLY_SURPRISE_EMOTION,
		icon: "emotions-icons/surprise",
		intensity: 2,
	},
};
