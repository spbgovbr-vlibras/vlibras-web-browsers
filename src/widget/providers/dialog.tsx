import type { VNode } from "preact";
import { create } from "zustand";

export const DialogProvider = () => {
	const { content } = useDialog();
	return content;
};

export const useDialog = create<{
	content?: VNode;
	setDialog: (content?: VNode) => void;
}>((set) => ({
	setDialog: (content?: VNode) => set({ content }),
}));
