import { UNITY_METHODS, UNITY_OBJECTS } from "./constants/unity";
import type { PlayerAvatar, PlayerConfig } from "./types";
import { usePlayerStore } from "./use-player.store";

const avatars: PlayerAvatar[] = ["icaro", "guga", "hozana"];

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
	};

	const play = (gloss?: string) => {
		if (gloss) store.send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.PLAY, gloss);
		else store.send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_PAUSE_STATE, 0);
	};

	const toggleAvatar = (avatar?: PlayerAvatar) => {
		const nextIndex = (avatars.indexOf(avatar || store.avatar) + 1) % avatars.length;
		const nextAvatar = avatars[nextIndex];

		store.send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_AVATAR, nextAvatar);
		usePlayerStore.setState({ avatar: nextAvatar });
	};

	const stop = () => {
		store.send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.STOP);
		usePlayerStore.setState({ status: "stopped" });
	};

	const pause = () => {
		store.send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_PAUSE_STATE, 1);
		usePlayerStore.setState({ status: "paused" });
	};

	const setSpeed = (speed: number) => {
		store.send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_SPEED, speed);
		usePlayerStore.setState({ speed });
	};

	const repeat = () => {
		if (!store.gloss) play(store.gloss);
	};

	const sendReview = async (review: unknown) => {
		console.log(review);
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
		...store,
	};
};
