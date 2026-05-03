import { config } from "@/core/config";

export const playingStatesToBoolean = (states: string[]) => {
	const [isPlaying, isPaused, isPlayingIntervalAnimation, isLoading, isRepeatable] = states.map((s) => s === "True");
	return { isPlaying, isPaused, isPlayingIntervalAnimation, isLoading, isRepeatable };
};

export const isValidHost = (path: string, origin: string) => {
	if (config.DEV) return true;

	try {
		const pathHost = new URL(path).host;
		const originHost = new URL(origin).host;
		return pathHost === originHost;
	} catch {
		return false;
	}
};
