import { beforeEach, describe, expect, it } from "vitest";
import { playerOptionsStore, usePlayerOptionsStore } from "@/player/stores/use-player-options.store";

describe("usePlayerOptionsStore", () => {
	beforeEach(() => {
		usePlayerOptionsStore.setState({ isInitialized: false });
	});

	it("should start uninitialized", () => {
		expect(playerOptionsStore.get().isInitialized).toBe(false);
	});

	it("should mark as initialized", () => {
		playerOptionsStore.set({ isInitialized: true });
		expect(playerOptionsStore.get().isInitialized).toBe(true);
	});
});
