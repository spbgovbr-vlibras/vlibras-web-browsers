import { beforeEach, describe, expect, it } from "vitest";
import { playerStore, usePlayerStore } from "@/player/stores/use-player.store";

describe("usePlayerStore", () => {
	beforeEach(() => {
		localStorage.clear();
		playerStore.get().reset();
		// reset() intentionally keeps the current avatar (see "should reset while keeping the
		// current avatar" below), so it isn't enough to restore full test isolation on its own.
		playerStore.set({ avatar: "icaro" });
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

	it("should update status", () => {
		playerStore.set({ status: "playing" });
		expect(playerStore.get().status).toBe("playing");
	});

	it("should update avatar", () => {
		playerStore.set({ avatar: "guga" });
		expect(playerStore.get().avatar).toBe("guga");
	});

	it("should update isLoaded", () => {
		playerStore.set({ isLoaded: true });
		expect(playerStore.get().isLoaded).toBe(true);
	});

	it("should update isBroken", () => {
		playerStore.set({ isBroken: true });
		expect(playerStore.get().isBroken).toBe(true);
	});

	it("should update showSubtitles", () => {
		playerStore.set({ showSubtitles: false });
		expect(playerStore.get().showSubtitles).toBe(false);
	});

	it("should update countGloss", () => {
		playerStore.set({ countGloss: { count: 5, max: 10 } });
		expect(playerStore.get().countGloss).toEqual({ count: 5, max: 10 });
	});
});
