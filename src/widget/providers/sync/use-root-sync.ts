import { useEffect } from "preact/hooks";
import { usePick } from "@/common/hooks";
import { usePlayerStore } from "@/player/use-player.store";
import { rootStore } from "@/widget/stores/use-root.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

export const useRootSync = () => {
	const status = usePlayerStore((s) => s.status);
	const { isTranslating, isExpanded, isOpen } = useWidgetStore(usePick("isTranslating", "isExpanded", "isOpen"));

	useEffect(() => {
		const { root } = rootStore.get();
		if (root) root.dataset.status = status;
	}, [status]);

	useEffect(() => {
		const { root } = rootStore.get();
		if (!root || !isOpen) return;

		if (isExpanded) {
			root.dataset.expanded = "true";
			document.body.dataset.vlibrasExpanded = "true";
		} else {
			delete root.dataset.expanded;
			delete document.body.dataset.vlibrasExpanded;
		}
	}, [isExpanded, isOpen]);

	useEffect(() => {
		const html = document.documentElement;
		if (isTranslating) html.dataset.vlibrasStatus = "translating";
		else delete html.dataset.vlibrasStatus;
	}, [isTranslating]);
};
