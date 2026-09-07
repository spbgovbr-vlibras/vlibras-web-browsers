import { describe, expect, it } from "vitest";
import { ERROR_CODES, ERROR_MESSAGES } from "@/core/actions/messages";

const EXPECTED_CODES = [
	"TRANSLATION_ERROR",
	"TRANSLATION_EMPTY_ERROR",
	"TRANSLATION_TIMEOUT_ERROR",
	"TRANSLATION_SUPERSEDED_ERROR",
	"SEND_REVIEW_ERROR",
	"SEND_REVIEW_TIMEOUT_ERROR",
	"SIGNS_ERROR",
	"SIGNS_EMPTY_ERROR",
	"SIGNS_TIMEOUT_ERROR",
	"UNKNOWN_ERROR",
];

describe("ERROR_MESSAGES", () => {
	it("should expose exactly the expected error codes", () => {
		// Compared against a hardcoded list (not Object.keys(ERROR_MESSAGES)) so this actually
		// fails if a code is renamed, removed, or added without updating the messages map.
		expect([...ERROR_CODES].sort()).toEqual([...EXPECTED_CODES].sort());
	});

	it("should have a non-empty message for every known code", () => {
		for (const code of ERROR_CODES) {
			expect(typeof ERROR_MESSAGES[code]).toBe("string");
			expect(ERROR_MESSAGES[code].length).toBeGreaterThan(0);
		}
	});
});
