import { useEffect } from "preact/hooks";
import { playerStore } from "@/player/stores/use-player.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

const IDLE_TEARDOWN_MS = 5 * 60 * 1000;

export const usePlayerIdleTeardown = () => {
	const isOpen = useWidgetStore((s) => s.isOpen);

	useEffect(() => {
		if (isOpen) {
			playerStore.set({ isMounted: true });
			return;
		}

		const timer = setTimeout(() => {
			playerStore.get().reset();
			playerStore.set({ isMounted: false });
		}, IDLE_TEARDOWN_MS);

		return () => clearTimeout(timer);
	}, [isOpen]);
};
