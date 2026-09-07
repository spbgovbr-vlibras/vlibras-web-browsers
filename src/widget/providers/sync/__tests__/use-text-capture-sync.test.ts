import { act, renderHook } from "@testing-library/preact";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { usePlayerStore } from "@/player/stores/use-player.store";
import { useTextCaptureSync } from "@/widget/providers/sync/use-text-capture-sync";
import { defaultState, useWidgetStore } from "@/widget/stores/use-widget.store";

type CaptureCallbackArgs = { text: string; element: HTMLElement; isGloss?: boolean };
type CaptureCallback = (args: CaptureCallbackArgs) => void | Promise<void>;
type TextCaptureOptions = {
	callback?: CaptureCallback;
	hoverClss?: string;
	activeClass?: string;
	isWordByWord?: boolean;
};

const createStyleMock = vi.hoisted(() => vi.fn());
const removeStyleMock = vi.hoisted(() => vi.fn());
const playMock = vi.hoisted(() => vi.fn());
const stopMock = vi.hoisted(() => vi.fn());
const translateMock = vi.hoisted(() => vi.fn().mockResolvedValue("GLOSS"));
const resetCallbackMock = vi.hoisted(() => vi.fn());
const cleanupMock = vi.hoisted(() => vi.fn());
const textCaptureMock = vi.hoisted(() => vi.fn());

vi.mock("@/core/dom", () => ({
	createStyle: createStyleMock,
	removeStyle: removeStyleMock,
}));

vi.mock("@/player/actions", () => ({
	play: playMock,
	stop: stopMock,
}));

vi.mock("@/widget/hooks/use-translate", () => ({
	useTranslate: () => ({ mutateAsync: translateMock, isPending: false, error: null }),
}));

vi.mock("@/widget/stores/use-callback.store", () => ({
	resetCallback: resetCallbackMock,
}));

vi.mock("@/widget/utils/text-capture", () => ({
	textCapture: textCaptureMock,
}));

function getCapturedCallback(): CaptureCallback {
	const calls = textCaptureMock.mock.calls;
	const [options] = calls[calls.length - 1] as [TextCaptureOptions];
	return options.callback as CaptureCallback;
}

describe("useTextCaptureSync", () => {
	let currentUnmount: (() => void) | undefined;

	function setup() {
		const result = renderHook(() => useTextCaptureSync());
		currentUnmount = result.unmount;
		return result;
	}

	beforeEach(() => {
		createStyleMock.mockClear();
		removeStyleMock.mockClear();
		playMock.mockClear();
		stopMock.mockClear();
		translateMock.mockClear();
		translateMock.mockResolvedValue("GLOSS");
		resetCallbackMock.mockClear();
		cleanupMock.mockClear();
		textCaptureMock.mockClear();
		textCaptureMock.mockReturnValue(cleanupMock);
		useWidgetStore.setState(defaultState);
	});

	afterEach(() => {
		act(() => {
			currentUnmount?.();
		});
		currentUnmount = undefined;
	});

	it("should do nothing while the player is not loaded", () => {
		usePlayerStore.setState({ isLoaded: false });
		setup();

		expect(createStyleMock).not.toHaveBeenCalled();
		expect(removeStyleMock).not.toHaveBeenCalled();
		expect(textCaptureMock).not.toHaveBeenCalled();
	});

	it("should create the text-capture style and start capture when open and loaded", () => {
		usePlayerStore.setState({ isLoaded: true });
		useWidgetStore.setState({ isOpen: true });

		setup();

		expect(createStyleMock).toHaveBeenCalledWith(expect.any(String), "@text-capture.style");
		expect(removeStyleMock).not.toHaveBeenCalled();
		expect(textCaptureMock).toHaveBeenCalledOnce();
		expect(cleanupMock).not.toHaveBeenCalled();
	});

	it("should remove the style and immediately clean up capture when loaded but closed", () => {
		usePlayerStore.setState({ isLoaded: true });
		useWidgetStore.setState({ isOpen: false });

		setup();

		expect(removeStyleMock).toHaveBeenCalledWith("@text-capture.style");
		expect(createStyleMock).not.toHaveBeenCalled();
		expect(cleanupMock).toHaveBeenCalledOnce();
	});

	it("should call stop and play directly when the captured text is already a gloss", async () => {
		usePlayerStore.setState({ isLoaded: true });
		useWidgetStore.setState({ isOpen: true });

		setup();
		const callback = getCapturedCallback();

		await callback({ text: "OI", element: document.createElement("div"), isGloss: true });

		expect(stopMock).toHaveBeenCalledOnce();
		expect(playMock).toHaveBeenCalledWith("OI");
		expect(translateMock).not.toHaveBeenCalled();
	});

	it("should translate, reset callback state, and play the resolved gloss for plain text", async () => {
		usePlayerStore.setState({ isLoaded: true });
		useWidgetStore.setState({ isOpen: true });

		setup();
		const callback = getCapturedCallback();

		await callback({ text: "hello", element: document.createElement("div"), isGloss: false });

		expect(stopMock).toHaveBeenCalledOnce();
		expect(translateMock).toHaveBeenCalledWith("hello");
		expect(resetCallbackMock).toHaveBeenCalledOnce();
		expect(playMock).toHaveBeenCalledWith("GLOSS");
	});

	it("should fall back to the original text when translate resolves empty", async () => {
		translateMock.mockResolvedValueOnce("");
		usePlayerStore.setState({ isLoaded: true });
		useWidgetStore.setState({ isOpen: true });

		setup();
		const callback = getCapturedCallback();

		await callback({ text: "hello", element: document.createElement("div"), isGloss: false });

		expect(playMock).toHaveBeenCalledWith("hello");
	});

	it("should clean up text capture on unmount", () => {
		usePlayerStore.setState({ isLoaded: true });
		useWidgetStore.setState({ isOpen: true });

		const { unmount } = setup();
		act(() => {
			unmount();
		});

		expect(cleanupMock).toHaveBeenCalled();
	});
});
