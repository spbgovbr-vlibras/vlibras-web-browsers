import type { Dispatch, StateUpdater } from "preact/hooks";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OnlyState } from "@/common/types";
import { pick } from "@/common/utils";
import { playerStore } from "@/player/use-player.store";
import type { WidgetPosition } from "@/widget/types";
import { resolveValue } from "./utils";

export const defaultState: OnlyState<WidgetStoreState> = {
	position: "right",
	text: undefined,
	isOpen: false,
	isExpanded: false,
	isLoaded: false,
	isActive: false,
	isTranslating: false,
	isPausedByUser: undefined,
	opacity: 1,
};

export interface WidgetStoreState {
	position: WidgetPosition;
	isOpen: boolean;
	isExpanded: boolean;
	isLoaded: boolean;
	isActive: boolean;
	isTranslating: boolean;
	setExpanded: Dispatch<StateUpdater<boolean>>;
	setOpen: Dispatch<StateUpdater<boolean>>;
	isPausedByUser?: boolean;
	text?: string;
	opacity: Number;
	color?: string;
	setLoaded: (isLoaded: boolean) => void;
	reset: () => void;
}

export const useWidgetStore = create<WidgetStoreState>()(
	persist(
		(set) => ({
			...defaultState,
			setLoaded: (isLoaded: boolean) => set({ isLoaded }),
			setExpanded: (value) => set((state) => ({ isExpanded: resolveValue(value, state.isExpanded) })),
			setOpen: (value) => set((state) => ({ isOpen: resolveValue(value, state.isOpen) })),
			reset: () => set(defaultState),
		}),
		{
			name: "@vlibras-widget",
			partialize: (state) => pick(state, "position", "isActive", "isOpen", "opacity"),
			version: 1,
		},
	),
);

useWidgetStore.subscribe((state) => {
	const { instance } = playerStore.get();
	if (!instance) return;

	if (state.isOpen) instance.Module.resumeMainLoop();
	else instance.Module.pauseMainLoop();
});

export const widgetStore = {
	get: useWidgetStore.getState,
	set: useWidgetStore.setState,
	subscribe: useWidgetStore.subscribe,
};
