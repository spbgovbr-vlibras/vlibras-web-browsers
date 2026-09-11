import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { $, $$, setupWidgetStyles } from "@/common/utils/dom";

describe("dom utils $ / $$", () => {
	it("should query from document by default", () => {
		document.body.innerHTML = '<div id="a"><span class="x"></span><span class="x"></span></div>';
		expect($<HTMLDivElement>("#a")).toBe(document.querySelector("#a"));
		expect($$<HTMLSpanElement>(".x")?.length).toBe(2);
	});

	it("should query from scope when provided", () => {
		const shadow = document.createElement("div").attachShadow({ mode: "open" });
		shadow.innerHTML = '<p id="p"></p>';
		expect($<HTMLParagraphElement>("#p", shadow)).toBe(shadow.querySelector("#p"));
		expect($$<HTMLParagraphElement>("p", shadow)?.length).toBe(1);
	});
});

describe("setupWidgetStyles", () => {
	let shadow: ShadowRoot;

	beforeEach(() => {
		document.head.innerHTML = "";
		const host = document.createElement("div");
		shadow = host.attachShadow({ mode: "open" });
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		document.head.innerHTML = "";
	});

	it("should inject property rules to document.head and widget styles to shadow", () => {
		setupWidgetStyles(shadow);

		const widgetStyle = shadow.querySelector("style[data-widget-styles]");
		expect(widgetStyle).not.toBeNull();

		// second call should not duplicate but call onLoad via rAF
		const onLoad = vi.fn();
		globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => {
			cb(0);
			return 0;
		};
		setupWidgetStyles(shadow, onLoad);
		expect(onLoad).toHaveBeenCalled();
	});

	it("should insert before firstChild when shadow has content", () => {
		const existing = document.createElement("div");
		shadow.appendChild(existing);
		setupWidgetStyles(shadow);
		expect(shadow.firstChild?.nodeName).toBe("STYLE");
		expect((shadow.firstChild as HTMLElement).getAttribute("data-widget-styles")).toBe("true");
	});

	it("should handle property extraction without duplication", () => {
		// call twice - second time should use early return path
		setupWidgetStyles(shadow);
		const firstPropCount = document.head.querySelectorAll("style[data-widget-properties]").length;
		setupWidgetStyles(shadow);
		const secondPropCount = document.head.querySelectorAll("style[data-widget-properties]").length;
		// either 0 or 1, but not increasing
		expect(secondPropCount).toBe(firstPropCount);
	});
});
