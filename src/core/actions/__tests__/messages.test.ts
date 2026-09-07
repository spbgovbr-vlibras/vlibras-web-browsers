import { describe, expect, it } from "vitest";
import { ERROR_CODES, ERROR_MESSAGES } from "@/core/actions/messages";

describe("ERROR_MESSAGES", () => {
	it("should have a non-empty message for every known code", () => {
		for (const code of ERROR_CODES) {
			expect(typeof ERROR_MESSAGES[code]).toBe("string");
			expect(ERROR_MESSAGES[code].length).toBeGreaterThan(0);
		}
	});

	it("should cover translation, feedback, and signs", () => {
		expect(ERROR_MESSAGES.TRANSLATION_ERROR).toBeTruthy();
		expect(ERROR_MESSAGES.TRANSLATION_TIMEOUT_ERROR).toBeTruthy();
		expect(ERROR_MESSAGES.TRANSLATION_SUPERSEDED_ERROR).toBeTruthy();
		expect(ERROR_MESSAGES.SEND_REVIEW_ERROR).toBeTruthy();
		expect(ERROR_MESSAGES.SIGNS_ERROR).toBeTruthy();
		expect(ERROR_MESSAGES.SIGNS_TIMEOUT_ERROR).toBeTruthy();
		expect(ERROR_MESSAGES.UNKNOWN_ERROR).toBeTruthy();
	});

	it("should expose the codes as keys of the object", () => {
		expect([...ERROR_CODES].sort()).toEqual(Object.keys(ERROR_MESSAGES).sort());
	});
});
