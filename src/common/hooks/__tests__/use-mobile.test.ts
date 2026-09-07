import { renderHook } from "@testing-library/preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mobileQueryStore, useMobile } from "@/common/hooks/use-mobile";

function mockMatchMedia(matches: boolean) {
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		value: vi.fn().mockReturnValue({
			matches,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		}),
	});
}

describe("useMobile", () => {
	beforeEach(() => {
		mobileQueryStore.set({ isExpanded: false });
	});

	it("deve retornar verdadeiro em tela estreita não expandida", () => {
		mockMatchMedia(true);

		const { result } = renderHook(() => useMobile());

		expect(result.current).toBe(true);
	});

	it("deve retornar falso quando a tela é larga", () => {
		mockMatchMedia(false);

		const { result } = renderHook(() => useMobile());

		expect(result.current).toBe(false);
	});

	it("deve retornar falso quando o widget está expandido", () => {
		mockMatchMedia(true);
		mobileQueryStore.set({ isExpanded: true });

		const { result } = renderHook(() => useMobile());

		expect(result.current).toBe(false);
	});
});
