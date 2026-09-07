import { act, renderHook } from "@testing-library/preact";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { playerStore, usePlayerStore } from "@/player/stores/use-player.store";
import { useWindowSyncProvider } from "@/widget/providers/sync/use-window-sync";
import { defaultState, useWidgetStore } from "@/widget/stores/use-widget.store";

const translateMock = vi.hoisted(() => vi.fn().mockResolvedValue("GLOSS"));
const playMock = vi.hoisted(() => vi.fn());
const toggleAvatarMock = vi.hoisted(() => vi.fn());

vi.mock("@/widget/hooks/use-translate", () => ({
	useTranslate: () => ({ mutateAsync: translateMock, isPending: false, error: null }),
}));

vi.mock("@/player/actions", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/player/actions")>();
	return { ...actual, play: playMock, toggleAvatar: toggleAvatarMock };
});

describe("useWindowSyncProvider", () => {
	let currentUnmount: (() => void) | undefined;

	function setup() {
		const result = renderHook(() => useWindowSyncProvider());
		currentUnmount = result.unmount;
		return result;
	}

	beforeEach(() => {
		useWidgetStore.setState(defaultState);
		playerStore.get().reset();
		playerStore.set({ avatar: "icaro" });
		translateMock.mockClear();
		translateMock.mockResolvedValue("GLOSS");
		playMock.mockClear();
		toggleAvatarMock.mockClear();
		window.plugin = undefined;
		window.vlibras = undefined;
	});

	afterEach(() => {
		act(() => {
			currentUnmount?.();
		});
		currentUnmount = undefined;
		window.plugin = undefined;
		window.vlibras = undefined;
	});

	it("should not populate window globals while the player is not loaded", () => {
		usePlayerStore.setState({ isLoaded: false });
		setup();

		expect(window.vlibras).toBeUndefined();
		expect(window.plugin).toBeUndefined();
	});

	it("should populate window.vlibras and window.plugin once loaded", () => {
		usePlayerStore.setState({ isLoaded: true });
		setup();

		expect(window.vlibras).toBeDefined();
		expect(window.vlibras.project).toBeDefined();
		expect(typeof window.vlibras.translate).toBe("function");
		expect(typeof window.vlibras.translateAndPlay).toBe("function");
		expect(window.plugin.translate).toBe(window.vlibras.translateAndPlay);
		expect(window.plugin.player.changeAvatar).toBe(toggleAvatarMock);
	});

	it("should resolve translate through the mocked translate hook", async () => {
		usePlayerStore.setState({ isLoaded: true });
		setup();

		const gloss = await window.vlibras.translate("hello");

		expect(translateMock).toHaveBeenCalledWith("hello");
		expect(gloss).toBe("GLOSS");
	});

	it("should call play with the translated gloss on translateAndPlay", async () => {
		usePlayerStore.setState({ isLoaded: true });
		setup();

		await window.vlibras.translateAndPlay("hello");

		expect(playMock).toHaveBeenCalledWith("GLOSS");
	});

	it("should fall back to the original text when translate resolves empty", async () => {
		translateMock.mockResolvedValueOnce("");
		usePlayerStore.setState({ isLoaded: true });
		setup();

		await window.vlibras.translateAndPlay("hello");

		expect(playMock).toHaveBeenCalledWith("hello");
	});

	it("should re-sync window.vlibras when the player store changes", () => {
		usePlayerStore.setState({ isLoaded: true });
		setup();

		act(() => {
			playerStore.set({ speed: 2 });
		});

		expect(window.vlibras.speed).toBe(2);
	});

	it("should stop syncing after unmount", () => {
		usePlayerStore.setState({ isLoaded: true });
		const { unmount } = setup();

		act(() => {
			unmount();
		});
		const speedBeforeChange = window.vlibras.speed;
		act(() => {
			playerStore.set({ speed: 3 });
		});

		expect(window.vlibras.speed).toBe(speedBeforeChange);
	});
});
