import { beforeEach, describe, expect, it, vi } from "vitest";
import { overlayStore, useOverlayStore } from "@/widget/stores/use-overlay.store";

describe("useOverlayStore", () => {
	beforeEach(() => {
		useOverlayStore.setState({ openId: null, showOverlay: true, onClose: undefined });
	});

	it("should have the correct default state", () => {
		const state = useOverlayStore.getState();
		expect(state.openId).toBeNull();
		expect(state.showOverlay).toBe(true);
	});

	it("should open the overlay with id and callback", () => {
		const onClose = vi.fn();
		overlayStore.set({ openId: "menu", showOverlay: true, onClose });

		expect(overlayStore.get().openId).toBe("menu");
	});

	it("should call onClose and reset when closing", () => {
		const onClose = vi.fn();
		overlayStore.set({ openId: "menu", showOverlay: false, onClose });

		overlayStore.close();

		expect(onClose).toHaveBeenCalledOnce();
		expect(overlayStore.get().openId).toBeNull();
		expect(overlayStore.get().showOverlay).toBe(true);
		expect(overlayStore.get().onClose).toBeUndefined();
	});

	it("should close without error when there is no onClose", () => {
		overlayStore.set({ openId: "menu" });

		expect(() => overlayStore.close()).not.toThrow();
		expect(overlayStore.get().openId).toBeNull();
	});
});
