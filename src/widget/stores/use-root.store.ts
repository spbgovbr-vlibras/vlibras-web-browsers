import { create } from "zustand";

interface RootStoreState {
	root: HTMLDivElement;
	shadowRoot: ShadowRoot;
	appRoot?: HTMLDivElement;
	appContent?: HTMLDivElement;
}

export const useRootStore = create<RootStoreState>()(() => ({
	root: {} as HTMLDivElement,
	shadowRoot: {} as ShadowRoot,
}));
