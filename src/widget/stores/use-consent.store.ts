import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ConsentStatus = "pending" | "accepted" | "declined";

interface ConsentStoreState {
	status: ConsentStatus;
	accept: () => void;
	decline: () => void;
}

export const useConsentStore = create<ConsentStoreState>()(
	persist(
		(set) => ({
			status: "pending",
			accept: () => set({ status: "accepted" }),
			decline: () => set({ status: "declined" }),
		}),
		{ name: "@vlibras-consent", version: 1 },
	),
);

export const consentStore = {
	get: useConsentStore.getState,
	set: useConsentStore.setState,
};
