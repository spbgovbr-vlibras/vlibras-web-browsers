import { beforeEach, describe, expect, it, vi } from "vitest";
import { tooltipStore, useTooltipStore } from "@/widget/stores/use-tooltip.store";

describe("useTooltipStore", () => {
	beforeEach(() => {
		useTooltipStore.setState({
			event: null,
			isActive: false,
			onClick: undefined,
			type: "button",
			element: null,
			listener: null,
			render: undefined,
		});
	});

	it("should have the correct default state", () => {
		const state = tooltipStore.get();
		expect(state.isActive).toBe(false);
		expect(state.type).toBe("button");
		expect(state.element).toBeNull();
	});

	it("should activate the tooltip with element and type", () => {
		const element = document.createElement("button");
		tooltipStore.set({ element, isActive: true, type: "link" });

		const state = tooltipStore.get();
		expect(state.isActive).toBe(true);
		expect(state.element).toBe(element);
		expect(state.type).toBe("link");
	});

	it("should fire the configured onClick", () => {
		const onClick = vi.fn();
		tooltipStore.set({ onClick });
		tooltipStore.get().onClick?.();

		expect(onClick).toHaveBeenCalledOnce();
	});
});
