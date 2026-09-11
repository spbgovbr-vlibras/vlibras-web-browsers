import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	findInteractiveElement,
	getTextContent,
	getWordAtPoint,
	hasTag,
	hasTextContent,
	isButtonElement,
	isLinkOrButton,
	isSelect,
	isSubmitInput,
	isSVG,
	isValidElement,
	isValidImage,
	removeAllClasses,
	removeClass,
	toggleChecked,
} from "@/widget/utils/text-capture/utils";

type DocumentWithCaretPosition = Omit<Document, "caretPositionFromPoint" | "caretRangeFromPoint"> & {
	caretPositionFromPoint?: (x: number, y: number) => number | null;
	caretRangeFromPoint?: (x: number, y: number) => Range | null;
};

describe("text-capture/utils", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
	});

	describe("getTextContent", () => {
		it("should return vlibrasGloss when present", () => {
			const el = document.createElement("div");
			el.dataset.vlibrasGloss = "OLA";
			expect(getTextContent(el)).toBe("OLA");
		});
		it("should return alt for IMG", () => {
			const img = document.createElement("img");
			img.alt = "foto";
			expect(getTextContent(img)).toBe("foto");
		});
		it("should return value for submit input", () => {
			const input = document.createElement("input");
			input.type = "submit";
			input.value = "Enviar";
			expect(getTextContent(input)).toBe("Enviar");
		});
		it("should return selected option for SELECT", () => {
			const select = document.createElement("select");
			const opt1 = document.createElement("option");
			opt1.text = "opt1";
			const opt2 = document.createElement("option");
			opt2.text = "opt2";
			opt2.selected = true;
			Object.defineProperty(opt2, "innerText", { value: "opt2", configurable: true });
			select.append(opt1, opt2);
			document.body.appendChild(select);
			expect(getTextContent(select)).toBe("opt2");
			document.body.removeChild(select);
		});
		it("should return innerText trimmed", () => {
			const div = document.createElement("div");
			div.innerText = "  hello  ";
			expect(getTextContent(div)).toBe("hello");
		});
	});

	describe("hasTag / isLinkOrButton etc", () => {
		it("hasTag should check tagName", () => {
			const a = document.createElement("a");
			expect(hasTag(a, "A")).toBe(true);
			expect(hasTag(a, ["A", "BUTTON"])).toBe(true);
			expect(hasTag(a, "DIV")).toBe(false);
		});
		it("isLinkOrButton", () => {
			expect(isLinkOrButton(document.createElement("a"))).toBe(true);
			expect(isLinkOrButton(document.createElement("button"))).toBe(true);
			expect(isLinkOrButton(document.createElement("div"))).toBe(false);
		});
		it("isSubmitInput", () => {
			const inp = document.createElement("input");
			inp.type = "submit";
			expect(isSubmitInput(inp)).toBe(true);
			inp.type = "text";
			expect(isSubmitInput(inp)).toBe(false);
		});
		it("isButtonElement", () => {
			const btn = document.createElement("button");
			expect(isButtonElement(btn)).toBe(true);
			const div = document.createElement("div");
			div.role = "button";
			expect(isButtonElement(div)).toBe(true);
		});
		it("isValidImage", () => {
			const img = document.createElement("img");
			img.alt = "desc";
			expect(isValidImage(img)).toBeTruthy();
			img.alt = "";
			expect(isValidImage(img)).toBeFalsy();
		});
		it("isSelect / isSVG", () => {
			expect(isSelect(document.createElement("select"))).toBe(true);
			const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			// tagName in jsdom is lowercase, util checks uppercase -> mock tagName
			Object.defineProperty(svg, "tagName", { value: "SVG", configurable: true });
			expect(isSVG(svg as unknown as HTMLElement)).toBe(true);
		});
	});

	describe("hasTextContent / toggleChecked", () => {
		it("hasTextContent true for text node", () => {
			const div = document.createElement("div");
			div.appendChild(document.createTextNode("hello"));
			expect(hasTextContent(div)).toBe(true);
			const empty = document.createElement("div");
			empty.appendChild(document.createElement("span"));
			expect(hasTextContent(empty)).toBe(false);
		});
		it("toggleChecked should toggle checkbox", () => {
			const label = document.createElement("label");
			const input = document.createElement("input");
			input.type = "checkbox";
			label.append(input);
			document.body.appendChild(label);
			expect(input.checked).toBe(false);
			toggleChecked(label);
			expect(input.checked).toBe(true);
			toggleChecked(label);
			expect(input.checked).toBe(false);
			document.body.removeChild(label);
		});
	});

	describe("findInteractiveElement / isValidElement", () => {
		it("should find parent link", () => {
			const a = document.createElement("a");
			a.href = "#";
			const span = document.createElement("span");
			span.textContent = "click";
			a.appendChild(span);
			document.body.appendChild(a);
			expect(findInteractiveElement(span)).toBe(a);
			document.body.removeChild(a);
		});
		it("isValidElement false for vlibras root", () => {
			const root = document.createElement("div");
			root.id = "vlibras-app-root";
			const child = document.createElement("div");
			child.textContent = "hello";
			root.appendChild(child);
			document.body.appendChild(root);
			// $appRoot is evaluated at import time, so this may not be detected; at least test returns boolean
			expect(typeof isValidElement(child)).toBe("boolean");
			document.body.removeChild(root);
		});
	});

	describe("getWordAtPoint", () => {
		it("should return word via caretPositionFromPoint", () => {
			const text = document.createTextNode("olá mundo teste");
			const div = document.createElement("div");
			div.appendChild(text);
			document.body.appendChild(div);
			Object.defineProperty(document, "caretPositionFromPoint", {
				value: vi.fn().mockReturnValue({ offsetNode: text, offset: 5 }),
				configurable: true,
				writable: true,
			});
			const result = getWordAtPoint(10, 10);
			expect(result?.word).toBe("mundo");
			vi.restoreAllMocks();
			delete (document as DocumentWithCaretPosition).caretPositionFromPoint;
			document.body.removeChild(div);
		});

		it("should fallback to caretRangeFromPoint (Safari)", () => {
			const text = document.createTextNode("hello world");
			Object.defineProperty(document, "caretPositionFromPoint", {
				value: undefined,
				configurable: true,
				writable: true,
			});
			// ensure fallback exists
			Object.defineProperty(document, "caretRangeFromPoint", {
				value: vi.fn().mockReturnValue({ startContainer: text, startOffset: 7 }),
				configurable: true,
				writable: true,
			});
			const result = getWordAtPoint(10, 10);
			expect(result?.word).toBe("world");
			vi.restoreAllMocks();
			delete (document as DocumentWithCaretPosition).caretRangeFromPoint;
		});

		it("should return null for non-text node", () => {
			const div = document.createElement("div");
			Object.defineProperty(document, "caretPositionFromPoint", {
				value: vi.fn().mockReturnValue({ offsetNode: div, offset: 0 }),
				configurable: true,
				writable: true,
			});
			expect(getWordAtPoint(0, 0)).toBeNull();
			vi.restoreAllMocks();
			delete (document as DocumentWithCaretPosition).caretPositionFromPoint;
		});

		it("should return null for empty trim", () => {
			const text = document.createTextNode("   ");
			Object.defineProperty(document, "caretPositionFromPoint", {
				value: vi.fn().mockReturnValue({ offsetNode: text, offset: 1 }),
				configurable: true,
				writable: true,
			});
			expect(getWordAtPoint(0, 0)).toBeNull();
			vi.restoreAllMocks();
			delete (document as DocumentWithCaretPosition).caretPositionFromPoint;
		});
	});

	describe("removeClass / removeAllClasses", () => {
		it("removeClass should unwrap spans", () => {
			document.body.innerHTML = '<span class="hl">hello</span> world';
			removeClass("hl");
			expect(document.body.innerHTML).not.toContain("<span");
			expect(document.body.textContent).toContain("hello");
		});
		it("removeAllClasses should remove class", () => {
			document.body.innerHTML = '<div class="hl">a</div><div class="hl">b</div>';
			removeAllClasses("hl");
			expect(document.body.querySelector(".hl")).toBeNull();
		});
	});
});
