import { config } from "@/core/config";
import { playWelcome, setConfig, setSpeed, toggleAvatar, toggleSubtitles } from "@/player/actions";
import type { PlayerOptions } from "@/player/types";
import { playerStore } from "@/player/use-player.store";
import { screenStore } from "@/widget/stores/use-screens.store";
import { widgetStore } from "@/widget/stores/use-widget.store";

export const playerOptions: PlayerOptions = {
	onLoaded: () => {
		const { avatar, speed } = playerStore.get();

		setConfig({ baseUrl: config.DICTIONARY_URL });
		toggleAvatar(avatar);
		setSpeed(speed);
		if (!__IS_EXTENSION__) playWelcome();
	},

	onPlay: () => {
		const { screen, open } = screenStore.get();

		if (screen !== "main") open("main");

		widgetStore.set({ isPausedByUser: false });
		playerStore.set({ isPlayingWelcome: false, isWelcomeFinished: true });
	},

	onWelcomeFinish: () => {
		const { showSubtitles } = playerStore.get();
		toggleSubtitles(showSubtitles);
	},
};
