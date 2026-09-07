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
		useWidgetStore.getState().setOpen(true);
		useWidgetStore.getState().setExpanded(true);

		const raw = localStorage.getItem("@vlibras-widget");
		expect(raw).not.toBeNull();

		const persisted = JSON.parse(raw as string).state;
		expect(persisted).toEqual({ isOpen: true, opacity: 1 });
		expect(persisted).not.toHaveProperty("isExpanded");
	});

	it("should setOpen with boolean", () => {
		useWidgetStore.getState().setOpen(true);
		expect(useWidgetStore.getState().isOpen).toBe(true);
		useWidgetStore.getState().setOpen(false);
		expect(useWidgetStore.getState().isOpen).toBe(false);
	});

	it("should setOpen with function", () => {
		useWidgetStore.getState().setOpen(true);
		useWidgetStore.getState().setOpen((prev) => !prev);
		expect(useWidgetStore.getState().isOpen).toBe(false);
	});

	it("should setExpanded with boolean", () => {
		useWidgetStore.getState().setExpanded(true);
		expect(useWidgetStore.getState().isExpanded).toBe(true);
		useWidgetStore.getState().setExpanded(false);
		expect(useWidgetStore.getState().isExpanded).toBe(false);
	});

	it("should setLoaded with boolean", () => {
		useWidgetStore.getState().setLoaded(true);
		expect(useWidgetStore.getState().isLoaded).toBe(true);
		useWidgetStore.getState().setLoaded(false);
		expect(useWidgetStore.getState().isLoaded).toBe(false);
	});
});
