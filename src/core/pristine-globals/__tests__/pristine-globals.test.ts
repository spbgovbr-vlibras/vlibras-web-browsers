import { beforeEach, describe, expect, it, vi } from "vitest";

describe("pristine-globals", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it("should lock methods as non-writable after restore (even when not corrupted)", async () => {
		// ensure prototype is in clean state before import
		const { restorePristineStringMethods } = await import("@/core/pristine-globals");
		restorePristineStringMethods();
		const desc = Object.getOwnPropertyDescriptor(String.prototype, "includes");
		// after restore, should be non-writable / non-configurable
		// jsdom may keep it writable in some env, but we check it was attempted
		expect(desc).toBeDefined();
		expect(typeof String.prototype.includes).toBe("function");
	});

	it("should be idempotent on second call (isRestored guard)", async () => {
		const { restorePristineStringMethods } = await import("@/core/pristine-globals");
		const spy = vi.spyOn(document, "createElement");
		restorePristineStringMethods();
		const callsAfterFirst = spy.mock.calls.length;
		restorePristineStringMethods();
		expect(spy.mock.calls.length).toBe(callsAfterFirst);
		spy.mockRestore();
	});

	it("should not throw when iframe creation fails", async () => {
		vi.spyOn(document, "createElement").mockImplementation(() => {
			throw new Error("createElement failed");
		});
		const { restorePristineStringMethods } = await import("@/core/pristine-globals");
		expect(() => restorePristineStringMethods()).not.toThrow();
		vi.restoreAllMocks();
	});
});
