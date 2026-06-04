import { UNITY_METHODS } from "@/player/constants/unity";
import emojiAngry from "@/widget/icons/emotions-icons/angry.webp";
import emojiDefault from "@/widget/icons/emotions-icons/default.webp";
import emojiDisgust from "@/widget/icons/emotions-icons/disgust.webp";
import emojiDoubt from "@/widget/icons/emotions-icons/doubt.webp";
import emojiFear from "@/widget/icons/emotions-icons/fear.webp";
import emojiHappy from "@/widget/icons/emotions-icons/happy.webp";
import emojiSad from "@/widget/icons/emotions-icons/sad.webp";
import emojiSurprise from "@/widget/icons/emotions-icons/surprise.webp";

export const emotionsMap = {
	default: {
		name: "Padrão",
		action: UNITY_METHODS.APPLY_DEFAULT_EMOTION,
		icon: emojiDefault,
		intensity: 2,
	},

	happy: {
		name: "Feliz",
		action: UNITY_METHODS.APPLY_HAPPY_EMOTION,
		icon: emojiHappy,
		intensity: 2,
	},

	sad: {
		name: "Triste",
		action: UNITY_METHODS.APPLY_SAD_EMOTION,
		icon: emojiSad,
		intensity: 2,
	},

	doubt: {
		name: "Dúvida",
		action: UNITY_METHODS.APPLY_DOUBT_EMOTION,
		icon: emojiDoubt,
		intensity: 2,
	},

	angry: {
		name: "Raiva",
		action: UNITY_METHODS.APPLY_ANGRY_EMOTION,
		icon: emojiAngry,
		intensity: 2,
	},

	disgust: {
		name: "Nojo",
		action: UNITY_METHODS.APPLY_DISGUST_EMOTION,
		icon: emojiDisgust,
		intensity: 2,
	},

	fear: {
		name: "Medo",
		action: UNITY_METHODS.APPLY_FEAR_EMOTION,
		icon: emojiFear,
		intensity: 2,
	},

	surprise: {
		name: "Surpresa",
		action: UNITY_METHODS.APPLY_SURPRISE_EMOTION,
		icon: emojiSurprise,
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
