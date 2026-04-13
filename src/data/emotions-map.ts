import { UNITY_METHODS } from "@/player/constants/unity";
import {
	EmojiAngry,
	EmojiDefault,
	EmojiDisgust,
	EmojiDoubt,
	EmojiFear,
	EmojiHappy,
	EmojiSad,
	EmojiSurprise,
} from "../widget/icons/emotions-icons";

export const emotionsMap = {
	default: {
		name: "Padrão",
		action: UNITY_METHODS.APPLY_DEFAULT_EMOTION,
		icon: EmojiDefault,
		intensity: 2,
	},

	happy: {
		name: "Feliz",
		action: UNITY_METHODS.APPLY_HAPPY_EMOTION,
		icon: EmojiHappy,
		intensity: 2,
	},

	sad: {
		name: "Triste",
		action: UNITY_METHODS.APPLY_SAD_EMOTION,
		icon: EmojiSad,
		intensity: 2,
	},

	doubt: {
		name: "Dúvida",
		action: UNITY_METHODS.APPLY_DOUBT_EMOTION,
		icon: EmojiDoubt,
		intensity: 2,
	},

	angry: {
		name: "Raiva",
		action: UNITY_METHODS.APPLY_ANGRY_EMOTION,
		icon: EmojiAngry,
		intensity: 2,
	},

	disgust: {
		name: "Nojo",
		action: UNITY_METHODS.APPLY_DISGUST_EMOTION,
		icon: EmojiDisgust,
		intensity: 2,
	},

	fear: {
		name: "Medo",
		action: UNITY_METHODS.APPLY_FEAR_EMOTION,
		icon: EmojiFear,
		intensity: 2,
	},

	surprise: {
		name: "Surpresa",
		action: UNITY_METHODS.APPLY_SURPRISE_EMOTION,
		icon: EmojiSurprise,
		intensity: 2,
	},

	// automatic: {
	// 	name: "Automático",
	// 	action: "ApplyDoubtEmotion",
	// 	icon: EmojiAutomatic,
	// 	intensity: 2,
	// },
};

export type EmotionKey = keyof typeof emotionsMap;
export type Emotion = (typeof emotionsMap)[EmotionKey];
