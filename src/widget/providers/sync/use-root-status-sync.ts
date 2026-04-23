import { useEffect } from "preact/hooks";
import { usePlayerStore } from "@/player/use-player.store";
import { rootStore } from "@/widget/stores/use-root.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

export const useRootStatusSync = () => {
	const status = usePlayerStore((s) => s.status);
	const isTranslating = useWidgetStore((s) => s.isTranslating);

	useEffect(() => {
		const { root } = rootStore.get();
		if (root) root.dataset.status = status;
	}, [status]);

	useEffect(() => {
		const html = document.documentElement;
		if (isTranslating) html.dataset.vlibrasStatus = "translating";
		else delete html.dataset.vlibrasStatus;
	}, [isTranslating]);
};
