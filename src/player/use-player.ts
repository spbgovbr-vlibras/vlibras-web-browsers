import { config } from "@/core/config";
import type { Emotion } from "@/data/emotions-map";
import type { Region } from "@/data/regionalism";
import { UNITY_METHODS, UNITY_OBJECTS } from "./constants/unity";
import type { PlayerAvatar, PlayerConfig } from "./types";
import { playerStore, usePlayerStore } from "./use-player.store";

const avatars: PlayerAvatar[] = ["icaro", "guga", "hosana"];

export const usePlayer = () => {
	const send = usePlayerStore((state) => state.send);

	const setConfig = (config: Partial<PlayerConfig>) => {
		if (!config.baseUrl && !config.personalizationUrl) return;

		if (config.baseUrl) send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_BASE_URL, config.baseUrl);
		if (config.personalizationUrl)
			send(UNITY_OBJECTS.CUSTOMIZATION, UNITY_METHODS.SET_PERSONALIZATION, config.personalizationUrl);

		const { config: _config } = playerStore.get();
		playerStore.set({ config: { ..._config, ...config } });
	};

	const playWelcome = () => {
		send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.PLAY_WELCOME);
		send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_SUBTITLES_STATE, 0);
		playerStore.set({ isPlayingWelcome: true });
	};

	const play = (gloss?: string) => {
		if (gloss) {
			send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.PLAY, gloss);
			playerStore.set({ gloss });
		} else send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_PAUSE_STATE, 0);
	};

	const repeat = () => {
		const { gloss } = playerStore.get();
		if (gloss) play(gloss);
	};

	const stop = () => {
		send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.STOP);
	};

	const pause = () => {
		send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_PAUSE_STATE, 1);
	};

	const setSpeed = (speed: number) => {
		send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_SPEED, speed);
		playerStore.set({ speed });
	};

	const toggleAvatar = (avatar?: PlayerAvatar) => {
		const _avatar = playerStore.get().avatar;
		const nextIndex = (avatars.indexOf(avatar || _avatar) + (avatar ? 0 : 1)) % avatars.length;
		const nextAvatar = avatars[nextIndex];

		send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_AVATAR, nextAvatar);
		playerStore.set({ avatar: nextAvatar });
	};

	const toggleSubtitles = (show?: boolean) => {
		const { showSubtitles: _showSubtitles } = playerStore.get();
		const showSubtitles = show ?? !_showSubtitles;

		send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_SUBTITLES_STATE, Number(showSubtitles));
		playerStore.set({ showSubtitles });
	};

	const setRegion = (region: Region) => {
		const baseUrl = `${config.DICTIONARY_URL}${region.abbreviation}/`;
		setConfig({ baseUrl });
		playerStore.set({ region });
	};

	const setEmotion = (emotion: Emotion) => {
		playerStore.set({ emotion });
		send(UNITY_OBJECTS.EMOTION, emotion.action);
	};

	return {
		setConfig,
		play,
		stop,
		pause,
		setSpeed,
		repeat,
		toggleAvatar,
		playWelcome,
		toggleSubtitles,
		setRegion,
		setEmotion,
	};
};
