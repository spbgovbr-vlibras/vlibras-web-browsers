import { beforeEach, describe, expect, it } from "vitest";
import { defaultState, useWidgetStore } from "@/widget/stores/use-widget.store";

describe("useWidgetStore", () => {
	beforeEach(() => {
		useWidgetStore.setState(defaultState);
	});

	it("deve ter o estado padrão correto", () => {
		const state = useWidgetStore.getState();
		expect(state.position).toBe("right");
		expect(state.isOpen).toBe(false);
		expect(state.isExpanded).toBe(false);
		expect(state.isLoaded).toBe(false);
		expect(state.isTranslating).toBe(false);
		expect(state.opacity).toBe(1);
	});

	it("deve definir isLoaded", () => {
		useWidgetStore.getState().setLoaded(true);
		expect(useWidgetStore.getState().isLoaded).toBe(true);
	});

	it("deve definir isExpanded como true", () => {
		useWidgetStore.getState().setExpanded(true);
		expect(useWidgetStore.getState().isExpanded).toBe(true);
	});

	it("deve definir isOpen como true", () => {
		useWidgetStore.getState().setOpen(true);
		expect(useWidgetStore.getState().isOpen).toBe(true);
	});

	it("deve resetar para o estado padrão", () => {
		useWidgetStore.getState().setLoaded(true);
		useWidgetStore.getState().setExpanded(true);
		useWidgetStore.getState().setOpen(true);

		useWidgetStore.getState().reset();

		const state = useWidgetStore.getState();
		expect(state.isLoaded).toBe(false);
		expect(state.isExpanded).toBe(false);
		expect(state.isOpen).toBe(false);
	});

	it("deve persistir apenas isOpen e opacity", () => {
		const state = useWidgetStore.getState();
		const persisted = { isOpen: state.isOpen, opacity: state.opacity };
		expect(persisted).toEqual({ isOpen: false, opacity: 1 });
	});
});
