import type { Dispatch, StateUpdater } from "preact/hooks";
import { create } from "zustand";
import { resolveValue } from "@/widget/stores/utils";
import type { GuideElement } from "./elements";

export interface GuideState {
	open: boolean;
	onOpenChange: Dispatch<StateUpdater<boolean>>;
	element?: GuideElement;
	reset: () => void;
}

export const useGuideStore = create<GuideState>((set) => ({
	open: false,
	onOpenChange: (v) => set((s) => ({ open: resolveValue(v, s.open) })),
	reset: () => set({ open: false, element: undefined }),
}));

export const guideStore = {
	get: useGuideStore.getState,
	set: useGuideStore.setState,
};

export const useGuideSelected = (selector: string) => useGuideStore((s) => s.element?.selector === selector);
