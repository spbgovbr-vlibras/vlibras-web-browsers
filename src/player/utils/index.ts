export const playingStatesToBoolean = (states: string[]) => {
	const [isPlaying, isPaused, isPlayingIntervalAnimation, isLoading, isRepeatable] = states.map((s) => s === "True");
	return { isPlaying, isPaused, isPlayingIntervalAnimation, isLoading, isRepeatable };
};
