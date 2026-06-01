import type { PlayerOptions } from "@/player/types";
import { playerStore } from "@/player/use-player.store";
import { screenStore } from "@/widget/stores/use-screens.store";
import { widgetStore } from "@/widget/stores/use-widget.store";

export const playerOptions: PlayerOptions = {
	onPlay: () => {
		const { screen, open } = screenStore.get();

		if (screen !== "main") open("main");

		widgetStore.set({ isPausedByUser: false });
		playerStore.set({ isPlayingWelcome: false, isWelcomeFinished: true });
	},
};
