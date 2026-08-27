import { avatars } from "@/player/constants";

export const playingStatesToBoolean = (states: string[]) => {
	const [isPlaying, isPaused, isPlayingIntervalAnimation, isLoading, isRepeatable] = states.map((s) => s === "True");
	return { isPlaying, isPaused, isPlayingIntervalAnimation, isLoading, isRepeatable };
};

export const getRandomAvatar = () => avatars[Math.floor(Math.random() * avatars.length)];

export const getBackoff = (attempt: number, base: number, max: number) => Math.min(base * 2 ** attempt, max);

const PROBE_TIMEOUT_MS = 5_000;

export type PlayerProbeResult = "ok" | "unavailable" | "unknown";

export const probePlayerAvailability = async (url: string): Promise<PlayerProbeResult> => {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);

	try {
		const response = await fetch(url, {
			method: "HEAD",
			mode: "cors",
			cache: "no-store",
			credentials: "omit",
			signal: controller.signal,
		});

		return response.status >= 500 ? "unavailable" : "ok";
	} catch {
		return "unknown";
	} finally {
		clearTimeout(timeoutId);
	}
};
