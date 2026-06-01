import { config } from "@/core/config";
import type { Emotion } from "@/data/emotions-map";
import type { Region } from "@/data/regionalism";
import { UNITY_METHODS, UNITY_OBJECTS } from "@/player/constants/unity";
import { playerOptionsStore } from "@/player/stores/use-player-options.store";
import type { PlayerAvatar, PlayerConfig } from "@/player/types";
import { playerStore } from "@/player/use-player.store";

const avatars: PlayerAvatar[] = ["icaro", "guga", "hosana"];

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
};

export const playWelcome = () => {
	send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.PLAY_WELCOME);
	send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_SUBTITLES_STATE, 0);
	playerStore.set({ isPlayingWelcome: true });
};

export const playStatic = (gloss: string) => {
	const staticUrl = config.DICTIONARY_STATIC_URL;
	const baseUrl = config.DICTIONARY_URL;

	setConfig({ baseUrl: staticUrl });

	if (gloss) send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.PLAY, gloss);
	else send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_PAUSE_STATE, 0);

	setConfig({ baseUrl });
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
	send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_SPEED, speed);
	playerStore.set({ speed });
};

export const toggleAvatar = (avatar?: PlayerAvatar) => {
	const _avatar = playerStore.get().avatar;
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

export const setEmotion = (emotion: Emotion) => {
	playerStore.set({ emotion });
	send(UNITY_OBJECTS.EMOTION, emotion.action);
};
