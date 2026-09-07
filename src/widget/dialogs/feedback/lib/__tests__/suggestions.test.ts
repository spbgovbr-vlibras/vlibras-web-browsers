import { describe, expect, it } from "vitest";
import { applySuggestion, getCaretCoordinates, getCurrentWord } from "../suggestions";

describe("getCurrentWord", () => {
	it("should return the word the cursor is inside of", () => {
		expect(getCurrentWord("hello world", 3)).toBe("hello");
	});

	it("should return the trailing word when cursor is at the end of the text", () => {
		expect(getCurrentWord("hello world", 11)).toBe("world");
	});

	it("should return the leading word when cursor is at the very start", () => {
		expect(getCurrentWord("hello world", 0)).toBe("hello");
	});

	it("should return the word immediately before the cursor when cursor sits on a space", () => {
		expect(getCurrentWord("hello world", 5)).toBe("hello");
	});

	it("should handle multi-word text and pick the middle word", () => {
		expect(getCurrentWord("um dois tres", 6)).toBe("dois");
	});

	it("should return an empty string when the cursor sits between two spaces", () => {
		expect(getCurrentWord("um  tres", 3)).toBe("");
	});
});

describe("applySuggestion", () => {
	it("should replace a partial word at the very end of the string with a trailing space", () => {
		expect(applySuggestion("CAS", 3, "CASA")).toBe("CASA ");
	});

	it("should replace the word before the cursor and normalize spacing with the remainder", () => {
		expect(applySuggestion("CAS abc", 3, "CASA")).toBe("CASA abc");
	});

	it("should replace only the portion of the word before the cursor, leaving the remainder of that word attached", () => {
		expect(applySuggestion("CASADO teste", 4, "XXX")).toBe("XXX DO teste");
	});

	it("should leave the text unchanged when the cursor is at position 0 with no word to replace", () => {
		expect(applySuggestion("resto", 0, "INICIO")).toBe("resto");
	});

	it("should replace the last word across a multi-word text", () => {
		const text = "primeira segunda";
		expect(applySuggestion(text, text.length, "TERCEIRA")).toBe("primeira TERCEIRA ");
	});
});

describe("getCaretCoordinates", () => {
	it("should run without throwing and return numeric coordinates", () => {
		const textarea = document.createElement("textarea");
		textarea.value = "hello world";
		textarea.style.lineHeight = "20px";
		document.body.appendChild(textarea);

		const coords = getCaretCoordinates(textarea, 5);

		expect(typeof coords.top).toBe("number");
		expect(typeof coords.left).toBe("number");
		expect(Number.isNaN(coords.top)).toBe(false);
		expect(Number.isNaN(coords.left)).toBe(false);

		document.body.removeChild(textarea);
	});

	it("should not leave the temporary mirror element attached to the document body", () => {
		const textarea = document.createElement("textarea");
		textarea.value = "algum texto de teste";
		document.body.appendChild(textarea);

		const childrenBefore = document.body.children.length;
		getCaretCoordinates(textarea, 4);
		const childrenAfter = document.body.children.length;

		expect(childrenAfter).toBe(childrenBefore);

		document.body.removeChild(textarea);
	});
});
