import { avatars } from "@/player/constants";

export const playingStatesToBoolean = (states: string[]) => {
	const [isPlaying, isPaused, isPlayingIntervalAnimation, isLoading, isRepeatable] = states.map((s) => s === "True");
	return { isPlaying, isPaused, isPlayingIntervalAnimation, isLoading, isRepeatable };
};

export const getRandomAvatar = () => avatars[Math.floor(Math.random() * avatars.length)];
