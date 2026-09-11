import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { subscribe, toast } from "@/common/lib/toaster";

describe("toaster", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it("should notify listeners on push, exiting, and remove", () => {
		const listener = vi.fn();
		const unsub = subscribe(listener);

		toast("hello", { duration: 10 });

		expect(listener).toHaveBeenCalledTimes(1);
		expect(listener.mock.calls[0][0][0].message).toBe("hello");

		vi.advanceTimersByTime(10);
		expect(listener).toHaveBeenCalledTimes(2);
		expect(listener.mock.calls[1][0][0].isExiting).toBe(true);

		vi.advanceTimersByTime(500);
		expect(listener).toHaveBeenCalledTimes(3);
		expect(listener.mock.calls[2][0]).toHaveLength(0);

		unsub();
	});

	it("should support unsubscribe", () => {
		const l1 = vi.fn();
		const l2 = vi.fn();
		const u1 = subscribe(l1);
		subscribe(l2);

		toast("msg", { duration: 10 });
		expect(l1).toHaveBeenCalledTimes(1);
		expect(l2).toHaveBeenCalledTimes(1);

		u1();
		vi.advanceTimersByTime(10);
		// l1 should not receive second notify
		expect(l1).toHaveBeenCalledTimes(1);
		expect(l2).toHaveBeenCalledTimes(2);

		vi.advanceTimersByTime(500);
		expect(l2).toHaveBeenCalledTimes(3);
	});

	it("should use default 3000ms duration", () => {
		const listener = vi.fn();
		subscribe(listener);
		toast("default");
		expect(listener).toHaveBeenCalledTimes(1);
		vi.advanceTimersByTime(2999);
		expect(listener).toHaveBeenCalledTimes(1);
		vi.advanceTimersByTime(1);
		expect(listener).toHaveBeenCalledTimes(2);
	});
});
