import { act, renderHook } from "@testing-library/preact";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebouncedCallback } from "@/common/hooks/use-debounced-callback";

describe("useDebouncedCallback", () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it("should invoke the callback after the delay", () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebouncedCallback(callback, 300));

		act(() => {
			result.current("test");
		});

		expect(callback).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(callback).toHaveBeenCalledWith("test");
	});

	it("should cancel the previous callback when called again", () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useDebouncedCallback(callback, 300));

		act(() => {
			result.current("first");
			result.current("second");
		});

		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith("second");
	});

	it("should clear the timeout on unmount", () => {
		const callback = vi.fn();
		const { result, unmount } = renderHook(() => useDebouncedCallback(callback, 300));

		act(() => {
			result.current("test");
		});

		unmount();

		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(callback).not.toHaveBeenCalled();
	});
});
