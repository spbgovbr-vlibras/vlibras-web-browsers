import { beforeEach, describe, expect, it, vi } from "vitest";
import { createOverlay, createRoot, createStyle, isValidElement, removeStyle } from "@/core/dom";

beforeEach(() => {
	document.body.innerHTML = "";
	document.head.innerHTML = "";
});

describe("createRoot", () => {
	it("should create the root with max z-index and an open shadow root", () => {
		const { root, shadowRoot, isRootActive } = createRoot();

		expect(root.id).toBe("vlibras-app-root");
		expect(root.style.zIndex).toBe("2147483647");
		expect(shadowRoot).toBeInstanceOf(ShadowRoot);
		expect(document.body.contains(root)).toBe(true);
		expect(isRootActive()).toBe(false);
	});

	it("should reuse the existing root on subsequent calls", () => {
		const first = createRoot().root;
		const second = createRoot().root;

		expect(second).toBe(first);
		expect(document.querySelectorAll("#vlibras-app-root")).toHaveLength(1);
	});

	it("should detect the active root via data-active", () => {
		const { root, isRootActive } = createRoot();
		root.setAttribute("data-active", "true");

		expect(isRootActive()).toBe(true);
	});
});

describe("createOverlay", () => {
	it("should attach the overlay to the widget shadow by default", () => {
		const overlay = createOverlay("overlay-teste");
		const host = document.getElementById("vlibras-root-overlay");

		expect(overlay.id).toBe("overlay-teste");
		expect(host?.shadowRoot?.contains(overlay)).toBe(true);
	});

	it("should attach to the document when inDocument is true", () => {
		const overlay = createOverlay("overlay-doc", true);

		expect(document.body.contains(overlay)).toBe(true);
	});

	it("should reuse the existing overlay", () => {
		const first = createOverlay("overlay-memo");
		const second = createOverlay("overlay-memo");

		expect(second).toBe(first);
	});
});

describe("createStyle and removeStyle", () => {
	it("should inject the style into the head and call the callback", () => {
		const callback = vi.fn();
		createStyle(".a{color:red}", "style-test", callback);

		const style = document.head.querySelector("#style-test");
		expect(style?.innerHTML).toBe(".a{color:red}");
		expect(callback).toHaveBeenCalledOnce();
	});

	it("should reuse the existing style without duplicating", () => {
		createStyle(".a{}", "style-memo");
		createStyle(".b{}", "style-memo");

		expect(document.head.querySelectorAll("#style-memo")).toHaveLength(1);
		expect(document.head.querySelector("#style-memo")?.innerHTML).toBe(".a{}");
	});

	it("should remove the style and allow recreation", () => {
		createStyle(".a{}", "removable-style");
		removeStyle("removable-style");

		expect(document.head.querySelector("#removable-style")).toBeNull();
	});

	it("should ignore removal of a non-existent style", () => {
		expect(() => removeStyle("missing-style")).not.toThrow();
	});
});

describe("isValidElement", () => {
	it("should accept ordinary text elements", () => {
		const el = document.createElement("p");
		expect(isValidElement(el)).toBe(true);
	});

	it("should reject default-ignored tags", () => {
		for (const tag of ["script", "style", "iframe", "input", "canvas"]) {
			expect(isValidElement(document.createElement(tag))).toBe(false);
		}
	});

	it("should reject the widget root and elements with the ignore class", () => {
		const { root } = createRoot();
		expect(isValidElement(root)).toBe(false);

		const ignored = document.createElement("p");
		ignored.classList.add("vlibras-ignore");
		expect(isValidElement(ignored)).toBe(false);
	});

	it("should reject elements inside the widget", () => {
		const { root } = createRoot();
		const child = document.createElement("p");
		root.appendChild(child);

		expect(isValidElement(child)).toBe(false);
	});

	it("should respect a custom ignore list", () => {
		const el = document.createElement("p");
		expect(isValidElement(el, ["p"])).toBe(false);
		expect(isValidElement(document.createElement("span"), ["p"])).toBe(true);
	});
});
