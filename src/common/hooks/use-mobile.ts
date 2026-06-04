import { create } from "zustand";
import { useMediaQuery } from "./use-media-query";

const useStore = create<{ isExpanded: boolean }>()(() => ({ isExpanded: false }));

export const useMobile = () => {
	const isExpanded = useStore((s) => s.isExpanded);
	return useMediaQuery("(max-width: 640px)") && !isExpanded;
};

export const mobileQueryStore = {
	get: useStore.getState,
	set: useStore.setState,
};
