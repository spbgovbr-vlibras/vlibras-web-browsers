import { act, renderHook } from "@testing-library/preact";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { usePlayerStore } from "@/player/stores/use-player.store";
import { useRootSync } from "@/widget/providers/sync/use-root-sync";
import { rootStore } from "@/widget/stores/use-root.store";
import { defaultState, useWidgetStore } from "@/widget/stores/use-widget.store";

function clearDataset(el: HTMLElement | undefined) {
	if (!el) return;
	for (const key of Object.keys(el.dataset)) delete el.dataset[key];
}

describe("useRootSync", () => {
	beforeEach(() => {
		useWidgetStore.setState(defaultState);
		clearDataset(document.documentElement);
		clearDataset(document.body);
	});

	afterEach(() => {
		rootStore.set({ root: undefined });
		clearDataset(document.documentElement);
		clearDataset(document.body);
	});

	it("should sync the player status onto the root dataset", () => {
		const root = document.createElement("div");
		rootStore.set({ root });

		renderHook(() => useRootSync());
		act(() => {
			usePlayerStore.setState({ status: "playing" });
		});

		expect(rootStore.get().root?.dataset.status).toBe("playing");
	});

	it("should not throw when there is no root element and status changes", () => {
		rootStore.set({ root: undefined });

		renderHook(() => useRootSync());
		expect(() => {
			act(() => {
				usePlayerStore.setState({ status: "paused" });
			});
		}).not.toThrow();
	});

	it("should set expanded attributes on the root and body when open and expanded", () => {
		const root = document.createElement("div");
		rootStore.set({ root });
		useWidgetStore.setState({ isOpen: true, isExpanded: true });

		renderHook(() => useRootSync());

		expect(root.dataset.expanded).toBe("true");
		expect(document.body.dataset.vlibrasExpanded).toBe("true");
	});

	it("should remove expanded attributes when open but not expanded", () => {
		const root = document.createElement("div");
		root.dataset.expanded = "true";
		document.body.dataset.vlibrasExpanded = "true";
		rootStore.set({ root });
		useWidgetStore.setState({ isOpen: true, isExpanded: false });

		renderHook(() => useRootSync());

		expect(root.dataset.expanded).toBeUndefined();
		expect(document.body.dataset.vlibrasExpanded).toBeUndefined();
	});

	it("should not set expanded attributes when the widget is closed", () => {
		const root = document.createElement("div");
		rootStore.set({ root });
		useWidgetStore.setState({ isOpen: false, isExpanded: true });

		renderHook(() => useRootSync());

		expect(root.dataset.expanded).toBeUndefined();
		expect(document.body.dataset.vlibrasExpanded).toBeUndefined();
	});

	it("should set the vlibrasStatus dataset on the html element when translating", () => {
		useWidgetStore.setState({ isTranslating: true });

		renderHook(() => useRootSync());

		expect(document.documentElement.dataset.vlibrasStatus).toBe("translating");
	});

	it("should remove the vlibrasStatus dataset when not translating", () => {
		document.documentElement.dataset.vlibrasStatus = "translating";
		useWidgetStore.setState({ isTranslating: false });

		renderHook(() => useRootSync());

		expect(document.documentElement.dataset.vlibrasStatus).toBeUndefined();
	});
});
