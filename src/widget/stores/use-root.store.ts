import { create } from "zustand";

interface RootStoreState {
	root: HTMLDivElement;
	shadowRoot: ShadowRoot;
}

export const useRootStore = create<RootStoreState>()(() => ({
	root: {} as HTMLDivElement,
	shadowRoot: {} as ShadowRoot,
}));
