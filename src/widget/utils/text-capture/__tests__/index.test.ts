import type { Mock } from "vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { tooltipStore } from "@/widget/stores/use-tooltip.store";
import type { CallbackProps } from "@/widget/utils/text-capture";
import { textCapture } from "@/widget/utils/text-capture";
import * as utils from "@/widget/utils/text-capture/utils";

describe("textCapture", () => {
	let callback: Mock<(props: CallbackProps) => void>;

	beforeEach(() => {
		document.body.innerHTML = "";
		tooltipStore.set({ isActive: false });
		callback = vi.fn();
		vi.clearAllMocks();
	});

	afterEach(() => {
		document.body.innerHTML = "";
		tooltipStore.set({ isActive: false });
		vi.restoreAllMocks();
	});

	it("should add hover class on mouseover when valid", () => {
		vi.spyOn(utils, "isValidElement").mockReturnValue(true);
		const cleanup = textCapture({ callback, hoverClss: "hl" });
		const el = document.createElement("div");
		el.textContent = "hello";
		document.body.appendChild(el);
		el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
		expect(el.classList.contains("hl")).toBe(true);
		cleanup();
	});

	it("should not add hover class for IMG when word-by-word", () => {
		vi.spyOn(utils, "isValidElement").mockReturnValue(true);
		const cleanup = textCapture({ callback, hoverClss: "hl", isWordByWord: true });
		const img = document.createElement("img");
		document.body.appendChild(img);
		img.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
		expect(img.classList.contains("hl")).toBe(false);
		cleanup();
	});

	it("should wrap word on mousemove when word-by-word", () => {
		vi.spyOn(utils, "isValidElement").mockReturnValue(true);
		const textNode = document.createTextNode("olá mundo");
		const container = document.createElement("div");
		container.appendChild(textNode);
		document.body.appendChild(container);
		vi.spyOn(utils, "getWordAtPoint").mockReturnValue({ word: "mundo", node: textNode, offset: 4 });
		const cleanup = textCapture({ callback, hoverClss: "hl", isWordByWord: true });
		document.body.dispatchEvent(new MouseEvent("mousemove", { bubbles: true, clientX: 10, clientY: 10 }));
		expect(document.querySelector("span.hl")?.textContent).toBe("mundo");
		cleanup();
	});

	it("should handle click with selected text (non word-by-word)", () => {
		vi.spyOn(utils, "isValidElement").mockReturnValue(true);
		vi.spyOn(window, "getSelection").mockReturnValue({ toString: () => "selected" } as Selection);
		const cleanup = textCapture({ callback, hoverClss: "hl" });
		const el = document.createElement("div");
		el.textContent = "hello";
		document.body.appendChild(el);
		el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
		expect(callback).toHaveBeenCalledWith(expect.objectContaining({ text: "selected" }));
		cleanup();
	});

	it("should handle click word-by-word via hover span", () => {
		vi.spyOn(utils, "isValidElement").mockReturnValue(true);
		vi.spyOn(window, "getSelection").mockReturnValue({ toString: () => "" } as Selection);
		document.body.innerHTML = '<span class="hl">palavra</span>';
		const cleanup = textCapture({ callback, hoverClss: "hl", isWordByWord: true });
		const el = document.createElement("div");
		el.textContent = "x";
		document.body.appendChild(el);
		el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
		expect(callback).toHaveBeenCalledWith(expect.objectContaining({ text: "palavra" }));
		cleanup();
	});

	it("should handle click with gloss", () => {
		vi.spyOn(utils, "isValidElement").mockReturnValue(true);
		vi.spyOn(window, "getSelection").mockReturnValue({ toString: () => "" } as Selection);
		vi.spyOn(utils, "getTextContent").mockReturnValue("texto gloss");
		const cleanup = textCapture({ callback });
		const el = document.createElement("div");
		el.dataset.vlibrasGloss = "GLOSS";
		document.body.appendChild(el);
		el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
		expect(callback).toHaveBeenCalledWith(expect.objectContaining({ isGloss: true, text: "texto gloss" }));
		cleanup();
	});

	it("should show tooltip for link", () => {
		vi.spyOn(utils, "isValidElement").mockReturnValue(true);
		vi.spyOn(window, "getSelection").mockReturnValue({ toString: () => "" } as Selection);
		vi.spyOn(utils, "getTextContent").mockReturnValue("link text");
		vi.spyOn(utils, "findInteractiveElement").mockReturnValue(null);
		const cleanup = textCapture({ callback });
		const a = document.createElement("a");
		a.href = "https://example.com";
		a.textContent = "link";
		document.body.appendChild(a);
		a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
		expect(tooltipStore.get().isActive).toBe(true);
		expect(tooltipStore.get().type).toBe("link");
		cleanup();
	});

	it("should toggle checked for LABEL", () => {
		vi.spyOn(utils, "isValidElement").mockReturnValue(true);
		vi.spyOn(window, "getSelection").mockReturnValue({ toString: () => "" } as Selection);
		vi.spyOn(utils, "getTextContent").mockReturnValue("label");
		const spy = vi.spyOn(utils, "toggleChecked");
		const cleanup = textCapture({ callback });
		const label = document.createElement("label");
		label.textContent = "label";
		document.body.appendChild(label);
		label.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
		expect(spy).toHaveBeenCalledWith(label);
		cleanup();
	});

	it("should ignore synthetic click", () => {
		const cleanup = textCapture({ callback });
		const el = document.createElement("div");
		document.body.appendChild(el);
		const evt = new MouseEvent("click", { bubbles: true });
		Object.defineProperty(evt, "__vlibrasSyntheticClick", { value: true });
		el.dispatchEvent(evt);
		expect(callback).not.toHaveBeenCalled();
		cleanup();
	});

	it("should remove hover class on mouseout", () => {
		const cleanup = textCapture({ callback, hoverClss: "hl" });
		const el = document.createElement("div");
		el.classList.add("hl");
		document.body.appendChild(el);
		el.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
		expect(el.classList.contains("hl")).toBe(false);
		cleanup();
	});

	it("should handle activeClass and tooltip button", () => {
		vi.spyOn(utils, "isValidElement").mockReturnValue(true);
		vi.spyOn(window, "getSelection").mockReturnValue({ toString: () => "" } as Selection);
		vi.spyOn(utils, "getTextContent").mockReturnValue("btn");
		const cleanup = textCapture({ callback, activeClass: "active" });
		const btn = document.createElement("button");
		btn.textContent = "btn";
		document.body.appendChild(btn);
		btn.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
		expect(btn.classList.contains("active")).toBe(true);
		expect(tooltipStore.get().isActive).toBe(true);
		// trigger tooltip onClick synthetic
		const onClick = tooltipStore.get().onClick;
		expect(onClick).toBeDefined();
		const dispatchSpy = vi.spyOn(btn, "dispatchEvent");
		onClick?.();
		expect(dispatchSpy).toHaveBeenCalled();
		expect(tooltipStore.get().isActive).toBe(false);
		cleanup();
	});

	it("should cleanup listeners", () => {
		const addSpy = vi.spyOn(document.body, "addEventListener");
		const removeSpy = vi.spyOn(document.body, "removeEventListener");
		const cleanup = textCapture({ callback, hoverClss: "hl", isWordByWord: true });
		expect(addSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));
		expect(addSpy).toHaveBeenCalledWith("click", expect.any(Function), true);
		cleanup();
		expect(removeSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));
		expect(removeSpy).toHaveBeenCalledWith("click", expect.any(Function), true);
	});

	it("should register mouseover/mouseout when not word-by-word", () => {
		const addSpy = vi.spyOn(document.body, "addEventListener");
		const cleanup = textCapture({ callback, hoverClss: "hl", isWordByWord: false });
		expect(addSpy).toHaveBeenCalledWith("mouseover", expect.any(Function));
		expect(addSpy).toHaveBeenCalledWith("mouseout", expect.any(Function));
		cleanup();
	});
});
