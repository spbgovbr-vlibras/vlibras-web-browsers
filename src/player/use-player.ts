import { UNITY_METHODS, UNITY_OBJECTS } from "./constants/unity";
import type { PlayerAvatar } from "./types";
import { usePlayerStore } from "./use-player.store";

const avatars: PlayerAvatar[] = ["icaro", "guga", "hozana"];

export const usePlayer = () => {
	const store = usePlayerStore();

	const playWelcome = () => {
		store.send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.PLAY_WELCOME);
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
		usePlayerStore.setState({ speed });
	};

	const repeat = () => {};

	const sendReview = async (review: unknown) => {
		console.log(review);
	};

	return {
		...store,
		play,
		stop,
		pause,
		setSpeed,
		repeat,
		sendReview,
		toggleAvatar,
		playWelcome,
	};
};
