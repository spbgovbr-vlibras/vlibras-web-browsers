import { describe, expect, it } from "vitest";
import { resolveValue } from "@/widget/stores/utils";

describe("resolveValue", () => {
	it("should return direct value when not a function", () => {
		expect(resolveValue(5, 1)).toBe(5);
		expect(resolveValue("a", "b")).toBe("a");
	});

	it("should call updater function with currentValue", () => {
		expect(resolveValue((prev: number) => prev + 1, 1)).toBe(2);
		expect(resolveValue((prev: string) => `${prev}x`, "a")).toBe("ax");
	});

	it("should handle boolean updater", () => {
		expect(resolveValue((prev: boolean) => !prev, true)).toBe(false);
		expect(resolveValue(false, true)).toBe(false);
	});
});
