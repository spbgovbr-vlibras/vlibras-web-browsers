import { useEffect } from "preact/hooks";
import { usePlayer } from "@/player/use-player";
import { usePlayerStore } from "@/player/use-player.store";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

export const useScreenSync = () => {
	const screen = useScreensStore((s) => s.screen);
	const status = usePlayerStore((s) => s.status);
	const { pause } = usePlayer();

	useEffect(() => {
		if (status === "playing") useScreensStore.getState().open("main");
	}, [status]);

	useEffect(() => {
		if (screen !== "main") pause();
	}, [screen]);

	useEffect(() => {
		const { isPausedByUser } = useWidgetStore.getState();
		if (isPausedByUser && status === "playing") {
			useWidgetStore.setState({ isPausedByUser: false });
		}
	}, [status]);
};
