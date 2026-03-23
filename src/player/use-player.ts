import { useCallback } from "preact/hooks";
import type { Regionalism } from "@/data/regionalism";
import { UNITY_METHODS, UNITY_OBJECTS } from "./constants/unity";
import type { PlayerAvatar, PlayerConfig } from "./types";
import { usePlayerStore } from "./use-player.store";

const avatars: PlayerAvatar[] = ["icaro", "guga", "hosana"];

export const usePlayer = () => {
	const store = usePlayerStore();

	// const setConfig = ({ baseUrl, personalizationUrl }: Partial<PlayerConfig>) => {
	// 	if (!baseUrl && !personalizationUrl) return;

	// 	if (baseUrl) {
	// 		store.send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_BASE_URL, baseUrl);
	// 		usePlayerStore.setState({ config: { ...store.config, baseUrl } });
	// 	}
	// 	if (personalizationUrl) {
	// 		store.send(UNITY_OBJECTS.CUSTOMIZATION, UNITY_METHODS.SET_PERSONALIZATION, personalizationUrl);
	// 		usePlayerStore.setState({ config: { ...store.config, personalizationUrl } });
	// 	}
	// };

	const setConfig = (config: Partial<PlayerConfig>) => {
		if (!config.baseUrl && !config.personalizationUrl) return;

		if (config.baseUrl) store.send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_BASE_URL, config.baseUrl);
		if (config.personalizationUrl)
			store.send(UNITY_OBJECTS.CUSTOMIZATION, UNITY_METHODS.SET_PERSONALIZATION, config.personalizationUrl);

		usePlayerStore.setState({ config: { ...store.config, ...config } });
	};

	const playWelcome = () => {
		store.send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.PLAY_WELCOME);
		usePlayerStore.setState({ isPlayingWelcome: true });
		store.send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_SUBTITLES_STATE, 0);
	};

	const play = (gloss?: string) => {
		if (gloss) {
			store.send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.PLAY, gloss);
			usePlayerStore.setState({ gloss });
		} else store.send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_PAUSE_STATE, 0);
	};

	const repeat = useCallback(() => {
		if (store.gloss) play(store.gloss);
	}, [store.gloss]);

	const stop = () => {
		store.send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.STOP);
	};

	const pause = () => {
		store.send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_PAUSE_STATE, 1);
	};

	const setSpeed = (speed: number) => {
		usePlayerStore.setState({ speed });
	};

	const toggleAvatar = (avatar?: PlayerAvatar) => {
		const nextIndex = avatar ? avatars.indexOf(avatar) : (avatars.indexOf(store.avatar) + 1) % avatars.length;
		const nextAvatar = avatars[nextIndex];

		store.send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_AVATAR, nextAvatar);
		usePlayerStore.setState({ avatar: nextAvatar });
	};

	const toggleSubtitles = (show?: boolean) => {
		const showSubtitles = show ?? !store.showSubtitles;

		store.send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_SUBTITLES_STATE, Number(showSubtitles));
		usePlayerStore.setState({ showSubtitles });
	};

	const sendReview = async (review: unknown) => {
		console.log(review);
	};

	const setRegion = (region: Regionalism) => {
		const dictionaryUrl = "";
		const baseUrl = `${dictionaryUrl}/${region}/`;
		setConfig({ baseUrl });
		usePlayerStore.setState({ region });
	};

	const setOpacity = (opacity: number) => {
		usePlayerStore.setState({ opacity });
	}

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
		setOpacity,
		...store,
	};
};
