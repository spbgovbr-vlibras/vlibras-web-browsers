import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RootStoreState } from "@/widget/stores/use-root.store";
import { rootStore } from "@/widget/stores/use-root.store";
import {
	focusAccessButton,
	focusWidgetPanel,
	getWidgetTrigger,
	restoreFocus,
	trapTabFocus,
} from "@/widget/utils/focus";

describe("focus utils", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
		rootStore.set({ shadowRoot: undefined } as unknown as Partial<RootStoreState>);
	});

	describe("trapTabFocus", () => {
		it("should ignore non-Tab keys", () => {
			const container = document.createElement("div");
			const e = new KeyboardEvent("keydown", { key: "Enter" }) as unknown as KeyboardEvent & {
				stopPropagation: () => void;
				preventDefault: () => void;
			};
			e.stopPropagation = vi.fn();
			e.preventDefault = vi.fn();
			trapTabFocus(container, e);
			expect(e.stopPropagation).not.toHaveBeenCalled();
		});

		it("should preventDefault when no focusable elements", () => {
			const container = document.createElement("div");
			document.body.appendChild(container);
			const e = new KeyboardEvent("keydown", { key: "Tab" }) as unknown as KeyboardEvent & {
				stopPropagation: () => void;
				preventDefault: () => void;
			};
			e.stopPropagation = vi.fn();
			e.preventDefault = vi.fn();
			trapTabFocus(container, e);
			expect(e.preventDefault).toHaveBeenCalled();
		});

		it("should trap Tab on last element to first", () => {
			const container = document.createElement("div");
			const btn1 = document.createElement("button");
			const btn2 = document.createElement("button");
			container.append(btn1, btn2);
			document.body.appendChild(container);
			// mock getClientRects to be focusable
			vi.spyOn(btn1, "getClientRects").mockReturnValue([
				{ width: 10, height: 10 } as unknown as DOMRect,
			] as unknown as DOMRectList);
			vi.spyOn(btn2, "getClientRects").mockReturnValue([
				{ width: 10, height: 10 } as unknown as DOMRect,
			] as unknown as DOMRectList);
			btn2.focus();
			// need shadowRoot activeElement mock
			const shadow = { activeElement: btn2 } as unknown as ShadowRoot;
			rootStore.set({ shadowRoot: shadow } as unknown as Partial<RootStoreState>);

			const e = new KeyboardEvent("keydown", { key: "Tab" }) as unknown as KeyboardEvent & {
				stopPropagation: () => void;
				preventDefault: () => void;
			};
			e.stopPropagation = vi.fn();
			e.preventDefault = vi.fn();
			const focusSpy = vi.spyOn(btn1, "focus");

			trapTabFocus(container, e);
			expect(e.preventDefault).toHaveBeenCalled();
			expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
		});

		it("should trap Shift+Tab on first to last", () => {
			const container = document.createElement("div");
			const btn1 = document.createElement("button");
			const btn2 = document.createElement("button");
			container.append(btn1, btn2);
			document.body.appendChild(container);
			vi.spyOn(btn1, "getClientRects").mockReturnValue([{} as unknown as DOMRect] as unknown as DOMRectList);
			vi.spyOn(btn2, "getClientRects").mockReturnValue([{} as unknown as DOMRect] as unknown as DOMRectList);
			btn1.focus();
			const shadow = { activeElement: btn1 } as unknown as ShadowRoot;
			rootStore.set({ shadowRoot: shadow } as unknown as Partial<RootStoreState>);

			const e = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true }) as unknown as KeyboardEvent & {
				stopPropagation: () => void;
				preventDefault: () => void;
			};
			e.stopPropagation = vi.fn();
			e.preventDefault = vi.fn();
			const focusSpy = vi.spyOn(btn2, "focus");

			trapTabFocus(container, e);
			expect(focusSpy).toHaveBeenCalled();
		});

		it("should not trap when active is middle", () => {
			const container = document.createElement("div");
			const btn1 = document.createElement("button");
			const btn2 = document.createElement("button");
			const btn3 = document.createElement("button");
			container.append(btn1, btn2, btn3);
			document.body.appendChild(container);
			vi.spyOn(btn1, "getClientRects").mockReturnValue([{} as unknown as DOMRect] as unknown as DOMRectList);
			vi.spyOn(btn2, "getClientRects").mockReturnValue([{} as unknown as DOMRect] as unknown as DOMRectList);
			vi.spyOn(btn3, "getClientRects").mockReturnValue([{} as unknown as DOMRect] as unknown as DOMRectList);
			btn2.focus();
			rootStore.set({
				shadowRoot: { activeElement: btn2 } as unknown as ShadowRoot,
			} as unknown as Partial<RootStoreState>);
			const e = new KeyboardEvent("keydown", { key: "Tab" }) as unknown as KeyboardEvent & {
				stopPropagation: () => void;
				preventDefault: () => void;
			};
			e.stopPropagation = vi.fn();
			e.preventDefault = vi.fn();
			trapTabFocus(container, e);
			expect(e.preventDefault).not.toHaveBeenCalled();
		});
	});

	describe("focusAccessButton / focusWidgetPanel / getWidgetTrigger / restoreFocus", () => {
		it("focusAccessButton should focus button in shadowRoot", () => {
			const btn = document.createElement("button");
			const focusSpy = vi.spyOn(btn, "focus");
			const wrapper = document.createElement("div");
			wrapper.id = "vlibras-access-wrapper";
			const shadow = wrapper.attachShadow({ mode: "open" });
			btn.id = "vlibras-button";
			shadow.appendChild(btn);
			document.body.appendChild(wrapper);

			focusAccessButton();
			expect(focusSpy).toHaveBeenCalled();
		});

		it("focusWidgetPanel should focus panel", () => {
			const panel = document.createElement("div");
			panel.id = "vlibras-app-panel";
			const spy = vi.spyOn(panel, "focus");
			document.body.appendChild(panel);
			focusWidgetPanel();
			expect(spy).toHaveBeenCalled();
		});

		it("getWidgetTrigger should return activeElement when not body", () => {
			const btn = document.createElement("button");
			document.body.appendChild(btn);
			btn.focus();
			expect(getWidgetTrigger()).toBe(btn);
		});

		it("getWidgetTrigger should return null when active is body", () => {
			document.body.focus();
			expect(getWidgetTrigger()).toBeNull();
		});

		it("restoreFocus should focus connected target", () => {
			const el = document.createElement("button");
			document.body.appendChild(el);
			const spy = vi.spyOn(el, "focus");
			restoreFocus(el);
			expect(spy).toHaveBeenCalled();
		});

		it("restoreFocus should call fallback when target not connected", () => {
			const el = document.createElement("button");
			const fallback = vi.fn();
			restoreFocus(el, fallback);
			expect(fallback).toHaveBeenCalled();
			const connected = document.createElement("button");
			document.body.appendChild(connected);
			const fb2 = vi.fn();
			restoreFocus(connected, fb2);
			expect(fb2).not.toHaveBeenCalled();
		});
	});
});
