import type { VNode } from "preact";
import { create } from "zustand";

const defaultState: TooltipStoreState = {
	event: null,
	isActive: false,
	onClick: undefined,
	type: "button",
	element: null,
	listener: null,
	render: undefined,
};

interface TooltipStoreState {
	element: HTMLElement | null;
	event: MouseEvent | null;
	isActive?: boolean;
	type: "button" | "link";
	onClick?: () => void;
	listener: ((event: MouseEvent) => void) | null;
	render?: VNode;
}

export const useTooltipStore = create<TooltipStoreState>()(() => ({
	...defaultState,
}));

export const tooltipStore = {
	get: useTooltipStore.getState,
	set: useTooltipStore.setState,
	subscribe: useTooltipStore.subscribe,
};
