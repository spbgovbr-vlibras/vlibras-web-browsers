import { config } from "@/core/config";
import type { Emotion } from "@/data/emotionsMap";
import type { Regionalism } from "@/data/regionalism";
import { UNITY_METHODS, UNITY_OBJECTS } from "./constants/unity";
import type { PlayerAvatar, PlayerConfig } from "./types";
import { usePlayerStore } from "./use-player.store";

const avatars: PlayerAvatar[] = ["icaro", "guga", "hosana"];

export const usePlayer = () => {
	const send = usePlayerStore((state) => state.send);

	const setConfig = (config: Partial<PlayerConfig>) => {
		if (!config.baseUrl && !config.personalizationUrl) return;

		if (config.baseUrl) send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_BASE_URL, config.baseUrl);
		if (config.personalizationUrl)
			send(UNITY_OBJECTS.CUSTOMIZATION, UNITY_METHODS.SET_PERSONALIZATION, config.personalizationUrl);

		const _config = usePlayerStore.getState().config;
		usePlayerStore.setState({ config: { ..._config, ...config } });
	};

	const playWelcome = () => {
		send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.PLAY_WELCOME);
		send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_SUBTITLES_STATE, 0);
		usePlayerStore.setState({ isPlayingWelcome: true });
	};

	const play = (gloss?: string) => {
		if (gloss) {
			send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.PLAY, gloss);
			usePlayerStore.setState({ gloss });
		} else send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_PAUSE_STATE, 0);

		const _isWelcomeFinished = usePlayerStore.getState().isWelcomeFinished;
		if (!_isWelcomeFinished) usePlayerStore.setState({ isWelcomeFinished: true, isPlayingWelcome: false });
	};

	const repeat = () => {
		const gloss = usePlayerStore.getState().gloss;
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
		usePlayerStore.setState({ speed });
	};

	const toggleAvatar = (avatar?: PlayerAvatar) => {
		const _avatar = usePlayerStore.getState().avatar;
		const nextIndex = (avatars.indexOf(avatar || _avatar) + (avatar ? 0 : 1)) % avatars.length;
		const nextAvatar = avatars[nextIndex];

		send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_AVATAR, nextAvatar);
		usePlayerStore.setState({ avatar: nextAvatar });
	};

	const toggleSubtitles = (show?: boolean) => {
		const _showSubtitles = usePlayerStore.getState().showSubtitles;
		const showSubtitles = show ?? !_showSubtitles;

		send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_SUBTITLES_STATE, Number(showSubtitles));
		usePlayerStore.setState({ showSubtitles });
	};

	const sendReview = async (review: unknown) => {
		console.log(review);
	};

	const setRegion = (region: Regionalism) => {
		const baseUrl = `${config.DICTIONARY_URL}${region.abbreviation}/`;
		setConfig({ baseUrl });
		usePlayerStore.setState({ region });
	};

	const setEmotion = (emotion: Emotion) => {
		usePlayerStore.setState({ emotion });
		send(UNITY_OBJECTS.EMOTION, emotion.action);
	};

	return {
		setConfig,
		play,
		stop,
		pause,
		setSpeed,
		repeat,
		sendReview,
		toggleAvatar,
		playWelcome,
		toggleSubtitles,
		setRegion,
		setEmotion,
	};
};
