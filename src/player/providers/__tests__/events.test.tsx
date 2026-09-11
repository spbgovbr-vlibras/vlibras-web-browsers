import { render } from "@testing-library/preact";
import { createRef } from "preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UNITY_EVENTS } from "@/player/constants/unity";
import { PlayerEventsProvider } from "@/player/providers/events";
import { usePlayerStore } from "@/player/stores/use-player.store";
import { usePlayerOptionsStore } from "@/player/stores/use-player-options.store";

describe("PlayerEventsProvider", () => {
	const iframeRef = createRef<HTMLIFrameElement>();

	beforeEach(() => {
		vi.clearAllMocks();
		usePlayerStore.setState({
			isWelcomeFinished: false,
			isPlayingWelcome: true,
			isLoaded: false,
			progress: 0,
			status: "idle",
			countGloss: { count: 0, max: 0 },
		});
		usePlayerOptionsStore.setState({});
		const iframe = document.createElement("iframe");
		Object.defineProperty(iframe, "contentWindow", { value: window, writable: true });
		iframeRef.current = iframe;
	});

	it("should ignore message from different source", () => {
		render(<PlayerEventsProvider path="https://cdn" iframeRef={iframeRef} />);
		const otherWindow = {} as Window;
		window.dispatchEvent(
			new MessageEvent("message", {
				source: otherWindow,
				data: { type: "unity_event", event: UNITY_EVENTS.ON_LOAD_PLAYER },
			}),
		);
		expect(usePlayerStore.getState().isLoaded).toBe(false);
	});

	it("should handle FINISH_WELCOME True -> finished", () => {
		const onWelcomeFinish = vi.fn();
		usePlayerOptionsStore.setState({ onWelcomeFinish });
		render(<PlayerEventsProvider path="https://cdn" iframeRef={iframeRef} />);
		window.dispatchEvent(
			new MessageEvent("message", {
				source: window,
				data: { type: "unity_event", event: UNITY_EVENTS.FINISH_WELCOME, data: "True" },
			}),
		);
		expect(usePlayerStore.getState().isWelcomeFinished).toBe(true);
		expect(usePlayerStore.getState().isPlayingWelcome).toBe(false);
		expect(onWelcomeFinish).toHaveBeenCalled();
	});

	it("should not handle FINISH_WELCOME when already finished", () => {
		usePlayerStore.setState({ isWelcomeFinished: true });
		render(<PlayerEventsProvider path="https://cdn" iframeRef={iframeRef} />);
		window.dispatchEvent(
			new MessageEvent("message", {
				source: window,
				data: { type: "unity_event", event: UNITY_EVENTS.FINISH_WELCOME, data: "True" },
			}),
		);
		expect(usePlayerStore.getState().isPlayingWelcome).toBe(true); // unchanged (default true)
	});

	it("should handle ON_LOAD_PLAYER", () => {
		const onLoaded = vi.fn();
		usePlayerOptionsStore.setState({ onLoaded });
		render(<PlayerEventsProvider path="https://cdn" iframeRef={iframeRef} />);
		window.dispatchEvent(
			new MessageEvent("message", {
				source: window,
				data: { type: "unity_event", event: UNITY_EVENTS.ON_LOAD_PLAYER },
			}),
		);
		expect(usePlayerStore.getState().isLoaded).toBe(true);
		expect(onLoaded).toHaveBeenCalled();
	});

	it("should handle UPDATE_PROGRESS with NaN guard", () => {
		render(<PlayerEventsProvider path="https://cdn" iframeRef={iframeRef} />);
		window.dispatchEvent(
			new MessageEvent("message", {
				source: window,
				data: { type: "unity_event", event: UNITY_EVENTS.UPDATE_PROGRESS, data: "invalid" },
			}),
		);
		expect(usePlayerStore.getState().progress).toBe(0);
		window.dispatchEvent(
			new MessageEvent("message", {
				source: window,
				data: { type: "unity_event", event: UNITY_EVENTS.UPDATE_PROGRESS, data: "0.5" },
			}),
		);
		expect(usePlayerStore.getState().progress).toBe(50);
	});

	it("should handle ON_PLAYING_STATE_CHANGE", () => {
		render(<PlayerEventsProvider path="https://cdn" iframeRef={iframeRef} />);
		window.dispatchEvent(
			new MessageEvent("message", {
				source: window,
				data: {
					type: "unity_event",
					event: UNITY_EVENTS.ON_PLAYING_STATE_CHANGE,
					data: ["True", "False", "False", "False", "False"],
				},
			}),
		);
		expect(usePlayerStore.getState().status).toBe("playing");
	});

	it("should handle COUNTER_GLOSS", () => {
		render(<PlayerEventsProvider path="https://cdn" iframeRef={iframeRef} />);
		window.dispatchEvent(
			new MessageEvent("message", {
				source: window,
				data: { type: "unity_event", event: UNITY_EVENTS.COUNTER_GLOSS, data: [2, 10] },
			}),
		);
		expect(usePlayerStore.getState().countGloss).toEqual({ count: 2, max: 10 });
	});

	it("should not listen when path empty", () => {
		const { unmount } = render(<PlayerEventsProvider path="" iframeRef={iframeRef} />);
		window.dispatchEvent(
			new MessageEvent("message", {
				source: window,
				data: { type: "unity_event", event: UNITY_EVENTS.ON_LOAD_PLAYER },
			}),
		);
		expect(usePlayerStore.getState().isLoaded).toBe(false);
		unmount();
	});
});
