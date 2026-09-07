import { beforeEach, describe, expect, it } from "vitest";
import { defaultState, useWidgetStore } from "@/widget/stores/use-widget.store";

describe("useWidgetStore", () => {
	beforeEach(() => {
		useWidgetStore.setState(defaultState);
	});

	it("should have the correct default state", () => {
		const state = useWidgetStore.getState();
		expect(state.position).toBe("right");
		expect(state.isOpen).toBe(false);
		expect(state.isExpanded).toBe(false);
		expect(state.isLoaded).toBe(false);
		expect(state.isTranslating).toBe(false);
		expect(state.opacity).toBe(1);
	});

	it("should set isLoaded", () => {
		useWidgetStore.getState().setLoaded(true);
		expect(useWidgetStore.getState().isLoaded).toBe(true);
	});

	it("should set isExpanded to true", () => {
		useWidgetStore.getState().setExpanded(true);
		expect(useWidgetStore.getState().isExpanded).toBe(true);
	});

	it("should set isOpen to true", () => {
		useWidgetStore.getState().setOpen(true);
		expect(useWidgetStore.getState().isOpen).toBe(true);
	});

	it("should reset to the default state", () => {
		useWidgetStore.getState().setLoaded(true);
		useWidgetStore.getState().setExpanded(true);
		useWidgetStore.getState().setOpen(true);

		useWidgetStore.getState().reset();

		const state = useWidgetStore.getState();
		expect(state.isLoaded).toBe(false);
		expect(state.isExpanded).toBe(false);
		expect(state.isOpen).toBe(false);
	});

	it("should persist only isOpen and opacity", () => {
		const state = useWidgetStore.getState();
		const persisted = { isOpen: state.isOpen, opacity: state.opacity };
		expect(persisted).toEqual({ isOpen: false, opacity: 1 });
	});
});
