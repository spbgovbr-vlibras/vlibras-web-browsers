import type { Dispatch, StateUpdater } from "preact/hooks";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { resolveValue } from "./utils";

export const defaultState: Partial<WidgetStoreState> = {
	isActive: false,
};

export interface WidgetStoreState {
	isOpenWidget: boolean;
	isExpanded: boolean;
	isLoaded: boolean;
	isActive: boolean;
	setExpanded: Dispatch<StateUpdater<boolean>>;
	setOpenWidget: Dispatch<StateUpdater<boolean>>;
	setLoaded: (isLoaded: boolean) => void;
	reset: () => void;
}

export const useWidgetStore = create<WidgetStoreState>()(
	persist(
		(set) => ({
			position: "right",
			isOpenWidget: false,
			isExpanded: false,
			isLoaded: false,
			isActive: false,
			setLoaded: (isLoaded: boolean) => set({ isLoaded }),
			setExpanded: (value) => set((state) => ({ isExpanded: resolveValue(value, state.isExpanded) })),
			setOpenWidget: (value) => set((state) => ({ isOpenWidget: resolveValue(value, state.isOpenWidget) })),
			reset: () => set(defaultState),
		}),
		{
			name: "@vlibras-widget-plus",
			partialize: (state) => state,
			version: 1,
		},
	),
);

export const getState = (): WidgetStoreState => useWidgetStore.getState();
