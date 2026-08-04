import { create } from "zustand";

interface OverlayStoreState {
	openId: string | null;
	showOverlay?: boolean;
	onClose?: () => void;
}

export const useOverlayStore = create<OverlayStoreState>()(() => ({ openId: null, showOverlay: true }));

export const overlayStore = {
	get: useOverlayStore.getState,
	set: useOverlayStore.setState,
	subscribe: useOverlayStore.subscribe,
	close: () => {
		useOverlayStore.getState().onClose?.();
		useOverlayStore.setState({ openId: null, showOverlay: true, onClose: undefined });
	},
};
