import { config } from "@/core/config";
import { availableEmotions, type EmotionKey, emotionsMap } from "@/data/emotions";
import type { Region } from "@/data/regionalism";
import { avatars } from "@/player/constants";
import { UNITY_METHODS, UNITY_OBJECTS } from "@/player/constants/unity";
import { playerStore } from "@/player/stores/use-player.store";
import { playerOptionsStore } from "@/player/stores/use-player-options.store";
import type { PlayerAvatar, PlayerConfig } from "@/player/types";
import type { SubtitleColors } from "./types";

const finishWelcome = () => {
	playerStore.set({ isPlayingWelcome: false, isWelcomeFinished: true });
};

export const send = (object: UNITY_OBJECTS, method: UNITY_METHODS, params?: unknown) => {
	playerStore.get().send(object, method, params);
};

export const setConfig = (config: Partial<PlayerConfig>) => {
	if (!config.baseUrl && !config.personalizationUrl) return;

	if (config.baseUrl) send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_BASE_URL, config.baseUrl);
	if (config.personalizationUrl)
		send(UNITY_OBJECTS.CUSTOMIZATION, UNITY_METHODS.SET_PERSONALIZATION, config.personalizationUrl);

	const { config: _config } = playerStore.get();
	playerStore.set({ config: { ..._config, ...config } });
};

export const play = (gloss?: string) => {
	if (!gloss) return send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_PAUSE_STATE, 0);

	send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.PLAY, gloss);
	playerStore.set({ gloss });
	playerOptionsStore.get().onPlay?.(gloss);

	if (!playerStore.get().isWelcomeFinished) finishWelcome();
};

export const playWelcome = () => {
	const { showSubtitles } = playerStore.get();

	send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.PLAY_WELCOME);
	send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_SUBTITLES_STATE, Number(showSubtitles));
	playerStore.set({ isPlayingWelcome: true });
};

export const playStatic = (gloss: string, _staticUrl?: string) => {
	const { region } = playerStore.get();

	const staticUrl = _staticUrl || `${config.DICTIONARY_STATIC_URL}${region.abbreviation}/`;
	const baseUrl = config.DICTIONARY_URL;

	setConfig({ baseUrl: staticUrl });

	if (gloss) {
		send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.PLAY, gloss);
		playerOptionsStore.get().onPlayStatic?.(gloss);
	} else send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_PAUSE_STATE, 0);

	setConfig({ baseUrl });

	if (!playerStore.get().isWelcomeFinished) finishWelcome();
};

export const repeat = () => {
	const { gloss } = playerStore.get();
	if (gloss) play(gloss);
	playerOptionsStore.get().onRepeat?.();
};

export const stop = () => {
	send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.STOP);
	playerOptionsStore.get().onStop?.();
};

export const pause = () => {
	send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_PAUSE_STATE, 1);
	playerOptionsStore.get().onPause?.();
};

export const setSpeed = (speed: number) => {
	if (typeof speed !== "number") return;

	send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_SPEED, speed);
	playerStore.set({ speed });
};

export const toggleAvatar = (avatar?: PlayerAvatar) => {
	const _avatar = playerStore.get().avatar;

	if (avatar && !avatars.includes(avatar)) {
		console.error(`Avatar "${avatar}" inválido!`);
		return;
	}

	const nextIndex = (avatars.indexOf(avatar || _avatar) + (avatar ? 0 : 1)) % avatars.length;
	const nextAvatar = avatars[nextIndex];

	send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_AVATAR, nextAvatar);
	playerStore.set({ avatar: nextAvatar });
};

export const toggleSubtitles = (show?: boolean) => {
	const { showSubtitles: _showSubtitles } = playerStore.get();
	const showSubtitles = show ?? !_showSubtitles;

	send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_SUBTITLES_STATE, Number(showSubtitles));
	playerStore.set({ showSubtitles });
};

export const setRegion = (region: Region) => {
	const baseUrl = `${config.DICTIONARY_URL}${region.abbreviation}/`;
	setConfig({ baseUrl });
	playerStore.set({ region });
};

export const setEmotion = (emotionKey: EmotionKey, intensity?: number) => {
	if (!availableEmotions.includes(emotionKey)) return console.error(`Emoção "${emotionKey}" inválida!`);
	const emotion = emotionsMap[emotionKey];

	playerStore.set({ emotion });
	send(UNITY_OBJECTS.EMOTION, emotion.action, intensity || emotion.intensity);
};

export const setSubtitleColor = ({ color, outline, shadow }: SubtitleColors) => {
	send(UNITY_OBJECTS.CUSTOMIZATION, UNITY_METHODS.SET_SUBTITLE_COLOR, color);
	send(UNITY_OBJECTS.CUSTOMIZATION, UNITY_METHODS.SET_SUBTITLE_OUTLINE_COLOR, outline || color);
	send(UNITY_OBJECTS.CUSTOMIZATION, UNITY_METHODS.SET_SUBTITLE_SHADOW_COLOR, shadow || color);
};
