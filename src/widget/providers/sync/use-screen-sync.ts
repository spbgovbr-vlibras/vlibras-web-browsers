import { useEffect } from "preact/hooks";
import { usePlayer } from "@/player/use-player";
import { playerStore, usePlayerStore } from "@/player/use-player.store";
import { screenStore, useScreensStore } from "@/widget/stores/use-screens.store";
import { widgetStore } from "@/widget/stores/use-widget.store";

export const useScreenSync = () => {
	const { pause } = usePlayer();

	const screen = useScreensStore((s) => s.screen);
	const status = usePlayerStore((s) => s.status);

	useEffect(() => {
		const { status } = playerStore.get();
		if (screen !== "main" && status === "playing") pause();
	}, [screen, pause]);

	useEffect(() => {
		const isPlaying = status === "playing";
		if (!isPlaying) return;

		const { isPausedByUser } = widgetStore.get();
		const { open, screen } = screenStore.get();

		if (isPausedByUser) widgetStore.set({ isPausedByUser: false });
		if (screen !== "main") open("main");
	}, [status]);
};
