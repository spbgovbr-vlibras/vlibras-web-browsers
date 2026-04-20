// src/widget/providers/sync/use-dialog-sync.ts
import { useEffect } from "preact/hooks";
import { usePlayer } from "@/player/use-player";
import { usePlayerStore } from "@/player/use-player.store";
import { useRootStore } from "@/widget/stores/use-root.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

export const useDialogSync = () => {
	const { pause, play } = usePlayer();
	const appContent = useRootStore((s) => s.appContent);

	useEffect(() => {
		if (!appContent) return;

		const checkDialogs = () => {
			const hasOpenDialog = !!appContent.querySelector('[data-slot="dialog-wrapper"][data-state="open"]');
			console.log("@@@@@@@@@@@@@@@@@@@@", hasOpenDialog);

			const { isPausedByUser } = useWidgetStore.getState();
			const { status, gloss, isWelcomeFinished } = usePlayerStore.getState();

			if (hasOpenDialog && status === "playing") pause();
			else if (!hasOpenDialog && !isPausedByUser && (gloss || !isWelcomeFinished)) {
				setTimeout(play, 300);
			}
		};

		const observer = new MutationObserver(checkDialogs);

		observer.observe(appContent, {
			attributes: true,
			subtree: true,
			attributeFilter: ["data-state"],
		});

		return () => observer.disconnect();
	}, []);
};
