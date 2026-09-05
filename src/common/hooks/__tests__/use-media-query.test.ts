import { renderHook } from "@testing-library/preact";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useMediaQuery } from "@/common/hooks/use-media-query";

describe("useMediaQuery", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: vi.fn(),
		});
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it("deve retornar o valor inicial correspondente à media query", () => {
		const mockMatchMedia = window.matchMedia as ReturnType<typeof vi.fn>;
		mockMatchMedia.mockReturnValue({
			matches: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		});

		const { result } = renderHook(() => useMediaQuery("(max-width: 640px)"));

		expect(result.current).toBe(true);
		expect(mockMatchMedia).toHaveBeenCalledWith("(max-width: 640px)");
	});

	it("deve retornar false quando a media query não corresponde", () => {
		const mockMatchMedia = window.matchMedia as ReturnType<typeof vi.fn>;
		mockMatchMedia.mockReturnValue({
			matches: false,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		});

		const { result } = renderHook(() => useMediaQuery("(min-width: 1024px)"));

		expect(result.current).toBe(false);
	});
});
