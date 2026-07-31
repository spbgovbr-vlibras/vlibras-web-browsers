import { useEffect } from "preact/hooks";
import { pause, play } from "@/player/actions";
import { playerStore, usePlayerStore } from "@/player/use-player.store";
import { widgetStore } from "@/widget/stores/use-widget.store";

export const useTabVisibilitySync = () => {
	const isLoaded = usePlayerStore((s) => s.isLoaded);

	useEffect(() => {
		if (!isLoaded) return;

		const handleVisibilityChange = () => {
			const { isPausedByUser } = widgetStore.get();
			const { status } = playerStore.get();

			if (status === "idle") return;

			const isVisible = document.visibilityState === "visible";

			if (isVisible && !isPausedByUser) setTimeout(play, 1000);
			else pause();
		};

		window.addEventListener("visibilitychange", handleVisibilityChange);
		return () => window.removeEventListener("visibilitychange", handleVisibilityChange);
	}, [isLoaded]);
};
