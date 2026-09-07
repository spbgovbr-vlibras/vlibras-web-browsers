import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { callbackStore, createCallback, resetCallback, useCallbackStore } from "@/widget/stores/use-callback.store";

describe("useCallbackStore", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		resetCallback();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should have the correct default state", () => {
		const state = callbackStore.get();
		expect(state.content).toBeUndefined();
		expect(state.action).toBeUndefined();
		expect(state.auto).toBe(false);
	});

	it("should apply the callback after the delay", () => {
		createCallback({ content: "oi", auto: true });
		expect(callbackStore.get().content).toBeUndefined();

		vi.advanceTimersByTime(300);

		expect(callbackStore.get().content).toBe("oi");
		expect(callbackStore.get().auto).toBe(true);
	});

	it("should reset to the default state", () => {
		useCallbackStore.setState({ content: "oi", auto: true });
		resetCallback();

		expect(callbackStore.get().content).toBeUndefined();
		expect(callbackStore.get().auto).toBe(false);
	});
});
