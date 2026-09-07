import { useEffect } from "preact/hooks";
import { $ } from "@/common/utils/dom";
import { pause, play } from "@/player/actions";
import { playerStore, usePlayerStore } from "@/player/stores/use-player.store";
import { rootStore } from "@/widget/stores/use-root.store";
import { widgetStore } from "@/widget/stores/use-widget.store";

export const useTabVisibilitySync = () => {
	const isLoaded = usePlayerStore((s) => s.isLoaded);

	useEffect(() => {
		if (!isLoaded) return;

		const handleVisibilityChange = () => {
			const { appRoot } = rootStore.get();
			const { isPausedByUser } = widgetStore.get();
			const { status } = playerStore.get();

			if ($("[data-slot='dialog-content']", appRoot)) return;

			const isVisible = document.visibilityState === "visible";

			if (!isVisible && status !== "playing") return;
			if (isVisible && !isPausedByUser) setTimeout(play, 1000);
			else pause();
		};

		window.addEventListener("visibilitychange", handleVisibilityChange);
		return () => window.removeEventListener("visibilitychange", handleVisibilityChange);
	}, [isLoaded]);
};
