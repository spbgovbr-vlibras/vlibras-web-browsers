import { renderHook } from "@testing-library/preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "@/common/hooks/use-theme";
import { playerStore, usePlayerStore } from "@/player/stores/use-player.store";
import { useSubtitleSync } from "@/widget/providers/sync/use-subtitle-sync";

const setSubtitleColorMock = vi.hoisted(() => vi.fn());
const toggleSubtitlesMock = vi.hoisted(() => vi.fn());

vi.mock("@/player/actions", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/player/actions")>();
	return { ...actual, setSubtitleColor: setSubtitleColorMock, toggleSubtitles: toggleSubtitlesMock };
});

describe("useSubtitleSync", () => {
	beforeEach(() => {
		setSubtitleColorMock.mockClear();
		toggleSubtitlesMock.mockClear();
		playerStore.get().reset();
		useTheme.setState({ theme: "light" });
	});

	it("should not call any action while the player is not loaded", () => {
		usePlayerStore.setState({ isLoaded: false });

		renderHook(() => useSubtitleSync());

		expect(setSubtitleColorMock).not.toHaveBeenCalled();
		expect(toggleSubtitlesMock).not.toHaveBeenCalled();
	});

	it("should apply light theme subtitle colors when loaded", () => {
		useTheme.setState({ theme: "light" });
		usePlayerStore.setState({ isLoaded: true });

		renderHook(() => useSubtitleSync());

		expect(setSubtitleColorMock).toHaveBeenCalledWith({ color: "black", outline: "black", shadow: "black" });
	});

	it("should apply dark theme subtitle colors when loaded", () => {
		useTheme.setState({ theme: "dark" });
		usePlayerStore.setState({ isLoaded: true });

		renderHook(() => useSubtitleSync());

		expect(setSubtitleColorMock).toHaveBeenCalledWith({ color: "white", outline: "white", shadow: "black" });
	});

	it("should toggle subtitles on with the current store value", () => {
		usePlayerStore.setState({ isLoaded: true, showSubtitles: true });

		renderHook(() => useSubtitleSync());

		expect(toggleSubtitlesMock).toHaveBeenCalledWith(true);
	});

	it("should toggle subtitles off with the current store value", () => {
		usePlayerStore.setState({ isLoaded: true, showSubtitles: false });

		renderHook(() => useSubtitleSync());

		expect(toggleSubtitlesMock).toHaveBeenCalledWith(false);
	});

	it("should return null", () => {
		usePlayerStore.setState({ isLoaded: false });
		const { result } = renderHook(() => useSubtitleSync());

		expect(result.current).toBeNull();
	});
});
