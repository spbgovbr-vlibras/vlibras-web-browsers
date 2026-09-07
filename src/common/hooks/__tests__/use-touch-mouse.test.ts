import { act, renderHook } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { useMousePosition } from "@/common/hooks/use-mouse-position";
import { useTouchDevice } from "@/common/hooks/use-touch-device";

function mockMatchMedia(matchesByQuery: Record<string, boolean>) {
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		value: vi.fn((query: string) => ({
			matches: matchesByQuery[query] ?? false,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		})),
	});
}

describe("useTouchDevice", () => {
	it("should detect a touch device via pointer coarse", () => {
		mockMatchMedia({ "(pointer: coarse)": true, "(hover: none)": false });

		const { result } = renderHook(() => useTouchDevice());

		expect(result.current).toBe(true);
	});

	it("should detect a touch device via absence of hover", () => {
		mockMatchMedia({ "(pointer: coarse)": false, "(hover: none)": true });

		const { result } = renderHook(() => useTouchDevice());

		expect(result.current).toBe(true);
	});

	it("should return false on a mouse device", () => {
		mockMatchMedia({ "(pointer: coarse)": false, "(hover: none)": false });

		const { result } = renderHook(() => useTouchDevice());

		expect(result.current).toBe(false);
	});
});

describe("useMousePosition", () => {
	it("should start at the origin", () => {
		const { result } = renderHook(() => useMousePosition());

		expect(result.current).toEqual({ x: 0, y: 0 });
	});

	it("should update on mouse movement", () => {
		const { result } = renderHook(() => useMousePosition());

		act(() => {
			window.dispatchEvent(new window.MouseEvent("mousemove", { clientX: 120, clientY: 80 }));
		});

		expect(result.current).toEqual({ x: 120, y: 80 });
	});
});
