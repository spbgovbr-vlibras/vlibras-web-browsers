import { describe, expect, it } from "vitest";
import { config } from "@/core/config";

describe("config", () => {
	it("should expose the current environment URLs", () => {
		for (const key of [
			"TRANSLATE_URL",
			"DICTIONARY_URL",
			"DICTIONARY_STATIC_URL",
			"DICTIONARY_CATEGORIES_URL",
			"SIGNS_URL",
			"REVIEW_URL",
			"BUNDLES_URL",
		] as const) {
			expect(typeof config[key]).toBe("string");
			expect(config[key].length).toBeGreaterThan(0);
		}
	});

	it("should expose the request timeout and the mode", () => {
		expect(config.REQUEST_TIMEOUT).toBe(10000);
		// under vitest, import.meta.env.MODE is "test" and falls back to development
		expect(["development", "homolog", "production", "test"]).toContain(config.MODE);
	});
});
