import { describe, expect, it } from "vitest";
import { cn } from "@/common/lib/utils";

describe("cn", () => {
	it("should concatenate classes", () => {
		expect(cn("a", "b")).toBe("a b");
	});

	it("should resolve conflicts with tailwind-merge", () => {
		expect(cn("px-2", "px-4")).toBe("px-4");
	});

	it("should ignore falsy conditional values", () => {
		expect(cn("a", false && "b", undefined, null)).toBe("a");
	});

	it("should accept objects and arrays from clsx", () => {
		expect(cn({ a: true, b: false }, ["c"])).toBe("a c");
	});
});
