import { act, renderHook } from "@testing-library/preact";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { playerStore, usePlayerStore } from "@/player/stores/use-player.store";
import { useTabVisibilitySync } from "@/widget/providers/sync/use-tab-visibility-sync";
import { defaultState, useWidgetStore } from "@/widget/stores/use-widget.store";

const playMock = vi.hoisted(() => vi.fn());
const pauseMock = vi.hoisted(() => vi.fn());

vi.mock("@/player/actions", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/player/actions")>();
	return { ...actual, play: playMock, pause: pauseMock };
});

function setVisibilityState(state: DocumentVisibilityState) {
	Object.defineProperty(document, "visibilityState", { value: state, configurable: true });
}

describe("useTabVisibilitySync", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		playMock.mockClear();
		pauseMock.mockClear();
		useWidgetStore.setState(defaultState);
		playerStore.get().reset();
	});

	afterEach(() => {
		vi.useRealTimers();
		setVisibilityState("visible");
	});

	it("should not attach a listener while the player is not loaded", () => {
		usePlayerStore.setState({ isLoaded: false });
		renderHook(() => useTabVisibilitySync());

		setVisibilityState("hidden");
		window.dispatchEvent(new Event("visibilitychange"));

		expect(playMock).not.toHaveBeenCalled();
		expect(pauseMock).not.toHaveBeenCalled();
	});

	it("should do nothing when hidden and the player is not currently playing", () => {
		usePlayerStore.setState({ isLoaded: true, status: "idle" });
		renderHook(() => useTabVisibilitySync());

		setVisibilityState("hidden");
		window.dispatchEvent(new Event("visibilitychange"));

		expect(playMock).not.toHaveBeenCalled();
		expect(pauseMock).not.toHaveBeenCalled();
	});

	it("should pause when hidden while the player is playing", () => {
		usePlayerStore.setState({ isLoaded: true, status: "playing" });
		renderHook(() => useTabVisibilitySync());

		setVisibilityState("hidden");
		window.dispatchEvent(new Event("visibilitychange"));

		expect(pauseMock).toHaveBeenCalledOnce();
		expect(playMock).not.toHaveBeenCalled();
	});

	it("should resume playback after a delay when visible again and not paused by the user", () => {
		usePlayerStore.setState({ isLoaded: true, status: "playing" });
		useWidgetStore.setState({ isPausedByUser: false });
		renderHook(() => useTabVisibilitySync());

		setVisibilityState("visible");
		window.dispatchEvent(new Event("visibilitychange"));

		expect(playMock).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1000);
		expect(playMock).toHaveBeenCalledOnce();
	});

	it("should pause instead of resuming when visible again but paused by the user", () => {
		usePlayerStore.setState({ isLoaded: true, status: "playing" });
		useWidgetStore.setState({ isPausedByUser: true });
		renderHook(() => useTabVisibilitySync());

		setVisibilityState("visible");
		window.dispatchEvent(new Event("visibilitychange"));

		vi.advanceTimersByTime(1000);
		expect(pauseMock).toHaveBeenCalledOnce();
		expect(playMock).not.toHaveBeenCalled();
	});

	it("should remove the listener on unmount", () => {
		usePlayerStore.setState({ isLoaded: true, status: "playing" });
		const { unmount } = renderHook(() => useTabVisibilitySync());

		act(() => {
			unmount();
		});

		setVisibilityState("hidden");
		window.dispatchEvent(new Event("visibilitychange"));

		expect(pauseMock).not.toHaveBeenCalled();
		expect(playMock).not.toHaveBeenCalled();
	});
});
