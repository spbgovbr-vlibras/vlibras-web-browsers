import { useEffect } from "preact/hooks";
import { usePlayer } from "@/player/use-player";
import { usePlayerStore } from "@/player/use-player.store";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

export const useScreenSync = () => {
	const { pause } = usePlayer();

	const screen = useScreensStore((s) => s.screen);
	const status = usePlayerStore((s) => s.status);

	useEffect(() => {
		const { status } = usePlayerStore.getState();
		if (screen !== "main" && status === "playing") pause();
	}, [screen]);

	useEffect(() => {
		const isPlaying = status === "playing";
		const { isPausedByUser } = useWidgetStore.getState();

		if (isPausedByUser && isPlaying) useWidgetStore.setState({ isPausedByUser: false });
		if (isPlaying) useScreensStore.getState().open("main");
	}, [status]);
};
