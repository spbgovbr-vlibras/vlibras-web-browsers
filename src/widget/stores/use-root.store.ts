import { create } from "zustand";

interface RootStoreState {
	root: HTMLDivElement;
	appRoot: HTMLDivElement;
	appContent: HTMLDivElement;
	shadowRoot: ShadowRoot;
}

export const useRootStore = create<RootStoreState>()(() => ({
	root: {} as HTMLDivElement,
	appRoot: {} as HTMLDivElement,
	appContent: {} as HTMLDivElement,
	shadowRoot: {} as ShadowRoot,
}));
