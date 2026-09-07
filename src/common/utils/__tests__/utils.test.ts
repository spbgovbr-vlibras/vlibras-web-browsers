import { describe, expect, it } from "vitest";
import { capitalize, delay, omit, pick, randomStr, sanitizeUrl } from "@/common/utils";

describe("omit", () => {
	it("should remove the specified keys from the object", () => {
		const obj = { a: 1, b: 2, c: 3 };
		expect(omit(obj, "a", "c")).toEqual({ b: 2 });
	});

	it("should return a copy without modifying the original", () => {
		const obj = { a: 1, b: 2 };
		omit(obj, "a");
		expect(obj).toEqual({ a: 1, b: 2 });
	});

	it("should return an empty object when all keys are removed", () => {
		const obj = { a: 1 };
		expect(omit(obj, "a")).toEqual({});
	});

	it("should return the original object when no key is specified", () => {
		const obj = { a: 1, b: 2 };
		expect(omit(obj)).toEqual({ a: 1, b: 2 });
	});
});

describe("pick", () => {
	it("should select only the specified keys", () => {
		const obj = { a: 1, b: 2, c: 3 };
		expect(pick(obj, "a", "c")).toEqual({ a: 1, c: 3 });
	});

	it("should return an empty object when no key is specified", () => {
		const obj = { a: 1 };
		expect(pick(obj)).toEqual({});
	});
});

describe("capitalize", () => {
	it("should capitalize the first letter of each word", () => {
		expect(capitalize("hello world")).toBe("Hello World");
	});

	it("should work with a single word", () => {
		expect(capitalize("hello")).toBe("Hello");
	});

	it("should handle empty strings", () => {
		expect(capitalize("")).toBe("");
	});

	it("should capitalize already-capitalized words without breaking them", () => {
		expect(capitalize("Hello World")).toBe("Hello World");
	});
});

describe("delay", () => {
	it("should resolve after the specified time", async () => {
		const start = Date.now();
		await delay(50);
		const elapsed = Date.now() - start;
		expect(elapsed).toBeGreaterThanOrEqual(45);
	});
});

describe("sanitizeUrl", () => {
	it("should normalize URLs by removing duplicate slashes", () => {
		expect(sanitizeUrl("https://example.com/path//to//file")).toBe("https://example.com/path/to/file");
	});

	it("should return the same string when there is no protocol", () => {
		expect(sanitizeUrl("example.com")).toBe("example.com");
	});

	it("should return an empty string for empty input", () => {
		expect(sanitizeUrl("")).toBe("");
	});
});

describe("randomStr", () => {
	it("should generate a string with at least 6 characters", () => {
		const result = randomStr();
		expect(result.length).toBeGreaterThanOrEqual(6);
	});

	it("should generate different strings on distinct calls", () => {
		const results = new Set([randomStr(), randomStr(), randomStr()]);
		expect(results.size).toBeGreaterThan(1);
	});
});
