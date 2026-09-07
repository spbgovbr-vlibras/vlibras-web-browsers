import { renderHook } from "@testing-library/preact";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { playerStore } from "@/player/stores/use-player.store";
import { usePlayerIdleTeardown } from "@/widget/providers/sync/use-player-idle-teardown";
import { defaultState, useWidgetStore } from "@/widget/stores/use-widget.store";

const IDLE_TEARDOWN_MS = 5 * 60 * 1000;

describe("usePlayerIdleTeardown", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		useWidgetStore.setState(defaultState);
		playerStore.get().reset();
		playerStore.set({ isMounted: true });
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should mount the player immediately when the widget is open", () => {
		playerStore.set({ isMounted: false });
		useWidgetStore.setState({ isOpen: true });

		renderHook(() => usePlayerIdleTeardown());

		expect(playerStore.get().isMounted).toBe(true);
	});

	it("should not reset the player state after 5 minutes while the widget stays open", () => {
		playerStore.set({ gloss: "CASA" });
		useWidgetStore.setState({ isOpen: true });

		renderHook(() => usePlayerIdleTeardown());
		vi.advanceTimersByTime(IDLE_TEARDOWN_MS + 1000);

		expect(playerStore.get().gloss).toBe("CASA");
	});

	it("should reset the player and unmount it after 5 minutes of being closed", () => {
		playerStore.set({ gloss: "CASA" });
		useWidgetStore.setState({ isOpen: false });

		renderHook(() => usePlayerIdleTeardown());
		vi.advanceTimersByTime(IDLE_TEARDOWN_MS);

		expect(playerStore.get().gloss).toBeUndefined();
		expect(playerStore.get().isMounted).toBe(false);
	});

	it("should cancel the pending teardown when reopened before the timer fires", () => {
		playerStore.set({ gloss: "CASA" });
		useWidgetStore.setState({ isOpen: false });

		const { rerender } = renderHook(() => usePlayerIdleTeardown());
		vi.advanceTimersByTime(IDLE_TEARDOWN_MS - 1000);

		useWidgetStore.setState({ isOpen: true });
		rerender();

		vi.advanceTimersByTime(2000);

		expect(playerStore.get().gloss).toBe("CASA");
		expect(playerStore.get().isMounted).toBe(true);
	});

	it("should clear the pending timeout on unmount", () => {
		playerStore.set({ gloss: "CASA" });
		useWidgetStore.setState({ isOpen: false });

		const { unmount } = renderHook(() => usePlayerIdleTeardown());
		unmount();
		vi.advanceTimersByTime(IDLE_TEARDOWN_MS + 1000);

		expect(playerStore.get().gloss).toBe("CASA");
	});
});
