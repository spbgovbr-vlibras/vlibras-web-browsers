import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ERROR_MESSAGES } from "@/core/actions/messages";
import { config } from "@/core/config";
import { getCategories, getCategorySigns } from "@/widget/screens/dictionary/actions";

describe("dictionary/actions", () => {
	const originalFetch = globalThis.fetch;

	beforeEach(() => {
		vi.clearAllMocks();
		vi.spyOn(console, "error").mockImplementation(() => {});
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	describe("getCategories", () => {
		it("should return data on success", async () => {
			const fakeData = [{ tag: "comida" }];
			globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => fakeData } as Response);
			const result = await getCategories();
			expect(result).toEqual({ data: fakeData, success: true });
			expect(globalThis.fetch).toHaveBeenCalledWith(
				`${config.DICTIONARY_CATEGORIES_URL}/tags`,
				expect.objectContaining({ method: "GET" }),
			);
		});

		it("should return SIGNS_ERROR on 500", async () => {
			globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 } as Response);
			const result = await getCategories();
			expect(result).toEqual({ success: false, error: ERROR_MESSAGES.SIGNS_ERROR, code: "SIGNS_ERROR" });
		});

		it("should return SIGNS_TIMEOUT_ERROR on AbortError", async () => {
			const err = new Error("aborted");
			err.name = "AbortError";
			globalThis.fetch = vi.fn().mockRejectedValue(err);
			const result = await getCategories();
			expect(result).toEqual({
				success: false,
				error: ERROR_MESSAGES.SIGNS_TIMEOUT_ERROR,
				code: "SIGNS_TIMEOUT_ERROR",
			});
		});

		it("should return SIGNS_ERROR on generic throw", async () => {
			globalThis.fetch = vi.fn().mockRejectedValue(new Error("network"));
			const result = await getCategories();
			expect(result).toEqual({ success: false, error: ERROR_MESSAGES.SIGNS_ERROR, code: "SIGNS_ERROR" });
		});
	});

	describe("getCategorySigns", () => {
		it("should return data on success", async () => {
			const fakeData = [{ name: "oi" }];
			globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => fakeData } as Response);
			const result = await getCategorySigns("saudacao");
			expect(result).toEqual({ data: fakeData, success: true });
			expect(globalThis.fetch).toHaveBeenCalledWith(
				`${config.DICTIONARY_CATEGORIES_URL}/tagsigns?tag=saudacao`,
				expect.any(Object),
			);
		});

		it("should return SIGNS_TIMEOUT_ERROR on AbortError", async () => {
			const err = new Error("aborted");
			err.name = "AbortError";
			globalThis.fetch = vi.fn().mockRejectedValue(err);
			const result = await getCategorySigns("saudacao");
			expect(result.code).toBe("SIGNS_TIMEOUT_ERROR");
		});

		it("should return SIGNS_ERROR on not ok", async () => {
			globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 } as Response);
			const result = await getCategorySigns("x");
			expect(result.code).toBe("SIGNS_ERROR");
		});
	});
});
