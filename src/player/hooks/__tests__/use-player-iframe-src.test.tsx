import { act, renderHook, waitFor } from "@testing-library/preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePlayerStore } from "@/player/stores/use-player.store";

vi.mock("@/common/utils", async () => {
	const actual = (await vi.importActual("@/common/utils")) as Record<string, unknown>;
	return {
		...actual,
		sanitizeUrl: (u: string) => u,
		delay: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),
	};
});

vi.mock("@/player/utils", async () => {
	const actual = (await vi.importActual("@/player/utils")) as Record<string, unknown>;
	return {
		...actual,
		probePlayerAvailability: vi.fn(),
		getBackoff: vi.fn((attempt: number) => 8000 * (attempt + 1)),
	};
});

import { usePlayerIframeSrc } from "@/player/hooks/use-player-iframe-src";
import { probePlayerAvailability } from "@/player/utils";

describe("usePlayerIframeSrc", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
		usePlayerStore.setState({ isLoaded: false, isBroken: false } as unknown as ReturnType<
			typeof usePlayerStore.getState
		>);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should return undefined when path empty", () => {
		const { result } = renderHook(() => usePlayerIframeSrc("", "1.0"));
		expect(result.current).toBeUndefined();
	});

	it("should set src when probe returns ok", async () => {
		vi.mocked(probePlayerAvailability).mockResolvedValue("ok");
		const { result } = renderHook(() => usePlayerIframeSrc("https://cdn", "1.0"));
		await act(async () => {
			await vi.advanceTimersByTimeAsync(0);
		});
		await waitFor(() => expect(result.current).toBeDefined());
		expect(result.current).toContain("https://cdn/unity/index.html");
	});

	it("should retry when probe returns unavailable", async () => {
		vi.mocked(probePlayerAvailability).mockResolvedValue("unavailable");
		const { result } = renderHook(() => usePlayerIframeSrc("https://cdn", "1.0"));
		await act(async () => {
			await vi.advanceTimersByTimeAsync(1000);
		});
		// retryCount incremented, probe called again
		expect(vi.mocked(probePlayerAvailability)).toHaveBeenCalledTimes(2);
		expect(result.current).toBeUndefined();
	});

	it("should mark broken after 5 retries", async () => {
		vi.mocked(probePlayerAvailability).mockResolvedValue("unavailable");
		renderHook(() => usePlayerIframeSrc("https://cdn", "1.0"));
		for (let i = 0; i < 6; i++) {
			await act(async () => {
				await vi.advanceTimersByTimeAsync(1000);
			});
		}
		expect(usePlayerStore.getState().isBroken).toBe(true);
	});

	it("should schedule stuck timeout when src set but not loaded", async () => {
		vi.mocked(probePlayerAvailability).mockResolvedValue("ok");
		const { result } = renderHook(() => usePlayerIframeSrc("https://cdn", "1.0"));
		await act(async () => {
			await vi.advanceTimersByTimeAsync(0);
		});
		await waitFor(() => expect(result.current).toBeDefined());
		// now stuck timer 8000
		await act(async () => {
			await vi.advanceTimersByTimeAsync(8000);
		});
		expect(vi.mocked(probePlayerAvailability)).toHaveBeenCalledTimes(2);
	});

	it("should expose retryLoad that resets", async () => {
		vi.mocked(probePlayerAvailability).mockResolvedValue("unavailable");
		renderHook(() => usePlayerIframeSrc("https://cdn", "1.0"));
		await act(async () => {
			await vi.advanceTimersByTimeAsync(1000);
		});
		const { retryLoad } = usePlayerStore.getState();
		act(() => retryLoad());
		expect(usePlayerStore.getState().isBroken).toBe(false);
	});
});
