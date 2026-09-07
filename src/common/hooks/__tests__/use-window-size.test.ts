import { act, renderHook } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { useWindowSize } from "@/common/hooks/use-window-size";

function setViewport(width: number, height: number) {
	Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: width });
	Object.defineProperty(window, "innerHeight", { writable: true, configurable: true, value: height });
}

describe("useWindowSize", () => {
	it("should return the current window size", () => {
		setViewport(1280, 720);

		const { result } = renderHook(() => useWindowSize());

		expect(result.current).toEqual({ width: 1280, height: 720 });
	});

	it("should update when the window is resized", () => {
		setViewport(800, 600);
		const { result } = renderHook(() => useWindowSize());

		act(() => {
			setViewport(1024, 768);
			window.dispatchEvent(new window.Event("resize"));
		});

		expect(result.current).toEqual({ width: 1024, height: 768 });
	});
});
