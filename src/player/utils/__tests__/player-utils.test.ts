import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { avatars } from "@/player/constants";
import { getBackoff, getRandomAvatar, playingStatesToBoolean, probePlayerAvailability } from "@/player/utils";

describe("playingStatesToBoolean", () => {
	it("should map True/False array to booleans", () => {
		expect(playingStatesToBoolean(["True", "False", "True", "False", "True"])).toEqual({
			isPlaying: true,
			isPaused: false,
			isPlayingIntervalAnimation: true,
			isLoading: false,
			isRepeatable: true,
		});
	});

	it("should handle all False", () => {
		expect(playingStatesToBoolean(["False", "False", "False", "False", "False"])).toEqual({
			isPlaying: false,
			isPaused: false,
			isPlayingIntervalAnimation: false,
			isLoading: false,
			isRepeatable: false,
		});
	});

	it("should handle all True", () => {
		expect(playingStatesToBoolean(["True", "True", "True", "True", "True"])).toEqual({
			isPlaying: true,
			isPaused: true,
			isPlayingIntervalAnimation: true,
			isLoading: true,
			isRepeatable: true,
		});
	});
});

describe("getRandomAvatar", () => {
	it("should return one of the avatars", () => {
		const avatar = getRandomAvatar();
		expect(avatars).toContain(avatar);
	});

	it("should respect mocked Math.random", () => {
		vi.spyOn(Math, "random").mockReturnValue(0);
		expect(getRandomAvatar()).toBe(avatars[0]);
		vi.spyOn(Math, "random").mockReturnValue(0.99);
		expect(getRandomAvatar()).toBe(avatars[avatars.length - 1]);
		vi.restoreAllMocks();
	});
});

describe("getBackoff", () => {
	it("should compute exponential backoff capped by max", () => {
		expect(getBackoff(0, 8000, 30000)).toBe(8000);
		expect(getBackoff(1, 8000, 30000)).toBe(16000);
		expect(getBackoff(2, 8000, 30000)).toBe(30000); // 32000 capped
		expect(getBackoff(5, 8000, 30000)).toBe(30000);
	});

	it("should not cap when under max", () => {
		expect(getBackoff(0, 1000, 10000)).toBe(1000);
		expect(getBackoff(2, 1000, 10000)).toBe(4000);
	});
});

describe("probePlayerAvailability", () => {
	const originalFetch = globalThis.fetch;

	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it("should return ok for status <500", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({ status: 200 } as Response);

		const promise = probePlayerAvailability("https://example.com/player");
		// fast-forward timeout not needed - fetch resolves before abort
		const result = await promise;
		expect(result).toBe("ok");
		expect(globalThis.fetch).toHaveBeenCalledWith(
			"https://example.com/player",
			expect.objectContaining({ method: "HEAD", mode: "cors", cache: "no-store", credentials: "omit" }),
		);
	});

	it("should return unavailable for 5xx", async () => {
		globalThis.fetch = vi.fn().mockResolvedValue({ status: 503 } as Response);
		const result = await probePlayerAvailability("https://example.com/player");
		expect(result).toBe("unavailable");
	});

	it("should return unknown on fetch throw and clear timeout", async () => {
		globalThis.fetch = vi.fn().mockRejectedValue(new Error("network"));
		const result = await probePlayerAvailability("https://example.com/player");
		expect(result).toBe("unknown");
	});

	it("should abort after 5s timeout", async () => {
		let capturedSignal: AbortSignal | undefined;
		globalThis.fetch = vi.fn().mockImplementation((_url, opts: RequestInit) => {
			capturedSignal = opts.signal as AbortSignal;
			return new Promise((_resolve, reject) => {
				capturedSignal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
			});
		});

		const promise = probePlayerAvailability("https://example.com/player");
		vi.advanceTimersByTime(5000);
		const result = await promise;
		expect(result).toBe("unknown");
		expect(capturedSignal?.aborted).toBe(true);
	});
});
