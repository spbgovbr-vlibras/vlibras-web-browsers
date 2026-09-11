import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type GlobalWithFontFace = Omit<typeof globalThis, "FontFace"> & {
	FontFace?: typeof FontFace | undefined;
};

describe("core/fonts", () => {
	let shadow: ShadowRoot;

	beforeEach(() => {
		shadow = document.createElement("div").attachShadow({ mode: "open" });
		vi.resetModules();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.resetModules();
	});

	it("should inject @font-face style when FontFace undefined", async () => {
		const globalWithFontFace = globalThis as GlobalWithFontFace;
		const originalFontFace = globalWithFontFace.FontFace;
		globalWithFontFace.FontFace = undefined;

		const { loadDefaultFont } = await import("@/core/fonts");
		await loadDefaultFont("https://cdn", shadow);

		const style = shadow.querySelector("style");
		expect(style).not.toBeNull();
		expect(style?.textContent).toContain("@font-face");
		expect(style?.textContent).toContain("VLibrasWidget_Font");
		expect(style?.textContent).toContain("rawline-500.woff2");

		globalWithFontFace.FontFace = originalFontFace;
	});

	it("should load via FontFace when available", async () => {
		const loadMock = vi.fn().mockResolvedValue(undefined);
		const addMock = vi.fn();
		function MockFontFace(_family: string, _src: string, _desc: FontFaceDescriptors) {
			return { load: loadMock } as unknown as FontFace;
		}
		(globalThis as GlobalWithFontFace).FontFace = MockFontFace as unknown as typeof FontFace;

		Object.defineProperty(document, "fonts", {
			value: { add: addMock },
			configurable: true,
		});

		const { loadDefaultFont } = await import("@/core/fonts");
		await loadDefaultFont("https://cdn", shadow);

		expect(loadMock).toHaveBeenCalledTimes(6);
		expect(addMock).toHaveBeenCalledTimes(6);
	});

	it("should fallback to style on FontFace load error", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const loadMock = vi.fn().mockRejectedValue(new Error("fail"));
		function MockFontFace(_family: string, _src: string, _desc: FontFaceDescriptors) {
			return { load: loadMock } as unknown as FontFace;
		}
		(globalThis as GlobalWithFontFace).FontFace = MockFontFace as unknown as typeof FontFace;

		const { loadDefaultFont } = await import("@/core/fonts");
		await loadDefaultFont("https://cdn2", shadow);

		expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Error loading default font"), expect.any(Error));
		expect(shadow.querySelector("style")).not.toBeNull();
		consoleSpy.mockRestore();
	});

	it("should not reload when already loaded (isFontLoaded guard)", async () => {
		const globalWithFontFace = globalThis as GlobalWithFontFace;
		const originalFontFace = globalWithFontFace.FontFace;
		globalWithFontFace.FontFace = undefined;
		const { loadDefaultFont } = await import("@/core/fonts");
		// first load already done in previous test shares module state - need fresh module
		// so this test checks second call no-ops
		await loadDefaultFont("https://cdn", shadow);
		const firstCount = shadow.querySelectorAll("style").length;
		await loadDefaultFont("https://cdn", shadow);
		const secondCount = shadow.querySelectorAll("style").length;
		expect(secondCount).toBe(firstCount);
		globalWithFontFace.FontFace = originalFontFace;
	});

	it("loadFontFace should add fonts to document.fonts", async () => {
		const addMock = vi.fn();
		Object.defineProperty(document, "fonts", { value: { add: addMock }, configurable: true });
		const f1 = { load: vi.fn().mockResolvedValue(undefined) } as unknown as FontFace;
		const f2 = { load: vi.fn().mockResolvedValue(undefined) } as unknown as FontFace;

		const { loadFontFace } = await import("@/core/fonts");
		await loadFontFace([f1, f2]);
		expect(f1.load).toHaveBeenCalled();
		expect(addMock).toHaveBeenCalledTimes(2);
	});
});
