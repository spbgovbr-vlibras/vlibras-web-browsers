import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type HTMLPrototypeWithInert = Omit<HTMLElement, "inert"> & { inert?: boolean };

describe("core/inert", () => {
	let shadow: ShadowRoot;

	beforeEach(() => {
		shadow = document.createElement("div").attachShadow({ mode: "open" });
		// reset polyfill flag for each test via fresh module
		vi.resetModules();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		// cleanup prototype if polyfilled
		const proto: HTMLPrototypeWithInert = HTMLElement.prototype;
		if ("inert" in proto) {
			try {
				delete proto.inert;
			} catch {}
		}
	});

	it("should add inert style and define prototype setter when not natively supported", async () => {
		// ensure not natively supported - jsdom may have inert, so delete first
		const proto: HTMLPrototypeWithInert = HTMLElement.prototype;
		const originalDesc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "inert");
		if (originalDesc) {
			try {
				delete proto.inert;
			} catch {}
		}
		const { applyInertPolyfill: freshPolyfill } = await import("@/core/inert");
		freshPolyfill(shadow);
		expect(shadow.querySelector("style")?.textContent).toContain("[inert]");
		expect("inert" in HTMLElement.prototype).toBe(true);
	});

	it("should noop when HTMLElement.prototype.inert already exists", async () => {
		Object.defineProperty(HTMLElement.prototype, "inert", {
			value: false,
			writable: true,
			configurable: true,
		});
		vi.resetModules();
		const { applyInertPolyfill: fresh } = await import("@/core/inert");
		const host = document.createElement("div");
		const sh = host.attachShadow({ mode: "open" });
		fresh(sh);
		// should not add style because early return
		expect(sh.querySelector("style")).toBeNull();
		delete (HTMLElement.prototype as HTMLPrototypeWithInert).inert;
	});

	it("should blur focused element inside inert", async () => {
		// ensure polyfill installed
		const proto: HTMLPrototypeWithInert = HTMLElement.prototype;
		if ("inert" in proto) {
			try {
				delete proto.inert;
			} catch {}
		}
		vi.resetModules();
		const { applyInertPolyfill: poly } = await import("@/core/inert");
		const host = document.createElement("div");
		const sh = host.attachShadow({ mode: "open" });
		poly(sh);

		const container = document.createElement("div");
		const btn = document.createElement("button");
		container.appendChild(btn);
		document.body.appendChild(container);
		container.inert = true;
		expect(container.getAttribute("aria-hidden")).toBe("true");
		expect(btn.getAttribute("tabindex")).toBe("-1");

		btn.focus();
		// trigger focusin inside inert via shadow root listener
		const event = new FocusEvent("focusin", { bubbles: true });
		Object.defineProperty(event, "target", { value: btn });
		sh.dispatchEvent(event);
		expect(document.activeElement !== btn || btn.getAttribute("tabindex") === "-1").toBe(true);

		container.inert = false;
		expect(container.hasAttribute("aria-hidden")).toBe(false);
		expect(btn.getAttribute("tabindex")).toBeNull();
		document.body.removeChild(container);
	});
});
