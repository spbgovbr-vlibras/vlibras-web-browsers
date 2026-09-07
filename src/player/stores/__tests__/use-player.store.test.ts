import { beforeEach, describe, expect, it } from "vitest";
import { playerStore, usePlayerStore } from "@/player/stores/use-player.store";

describe("usePlayerStore", () => {
	beforeEach(() => {
		localStorage.clear();
		playerStore.get().reset();
	});

	it("should have the initial defaults", () => {
		const state = playerStore.get();
		expect(state.avatar).toBe("icaro");
		expect(state.status).toBe("idle");
		expect(state.speed).toBe(1);
		expect(state.progress).toBe(0);
		expect(state.isLoaded).toBe(false);
		expect(state.isMounted).toBe(true);
		expect(state.showSubtitles).toBe(true);
		expect(state.isPlayingWelcome).toBe(true);
		expect(state.isWelcomeFinished).toBe(false);
		expect(state.isBroken).toBe(false);
		expect(state.countGloss).toEqual({ count: 0, max: 0 });
	});

	it("should update speed and gloss", () => {
		playerStore.set({ speed: 1.5, gloss: "CASA" });

		expect(playerStore.get().speed).toBe(1.5);
		expect(playerStore.get().gloss).toBe("CASA");
	});

	it("should reset while keeping the current avatar", () => {
		playerStore.set({ avatar: "guga", speed: 2, gloss: "CASA", status: "playing" });
		playerStore.get().reset();

		const state = playerStore.get();
		expect(state.avatar).toBe("guga");
		expect(state.speed).toBe(1);
		expect(state.gloss).toBeUndefined();
		expect(state.status).toBe("idle");
	});

	it("should expose send and retryLoad as functions", () => {
		expect(typeof playerStore.get().send).toBe("function");
		expect(typeof playerStore.get().retryLoad).toBe("function");
		expect(() => playerStore.get().send("unity" as never, "play" as never)).not.toThrow();
	});

	it("should keep the reactive store in sync", () => {
		playerStore.set({ progress: 42 });
		expect(usePlayerStore.getState().progress).toBe(42);
	});
});
