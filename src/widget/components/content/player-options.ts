import { config } from "@/core/config";
import { playWelcome, setConfig, setSpeed, toggleAvatar, toggleSubtitles } from "@/player/actions";
import { playerStore } from "@/player/stores/use-player.store";
import type { PlayerOptions } from "@/player/types";
import { rootStore } from "@/widget/stores/use-root.store";
import { screenStore } from "@/widget/stores/use-screens.store";
import { widgetStore } from "@/widget/stores/use-widget.store";
import type { WidgetPosition } from "@/widget/types";

export const playerOptions: PlayerOptions = {
	onLoaded: () => {
		const personalizationUrl = window.VLibrasWidget?.configUrl;
		const defaultAvatar = window.VLibrasWidget?.avatar;
		const defaultPosition: WidgetPosition = window.VLibrasWidget?.position === "l" ? "left" : "right";

		const { avatar, speed } = playerStore.get();

		widgetStore.set({ position: defaultPosition });
		setConfig({ baseUrl: config.DICTIONARY_URL, personalizationUrl });
		setSpeed(speed);

		if (!__IS_EXTENSION__) {
			const timeout = setTimeout(() => {
				toggleAvatar(defaultAvatar || avatar);
				playWelcome();
				clearTimeout(timeout);
			}, 500);
		} else {
			const { root } = rootStore.get();
			if (root) root.dataset.extension = "true";
			playerStore.set({ isPlayingWelcome: false, isWelcomeFinished: true });
		}
	},

	onPlay: () => {
		const { screen, open } = screenStore.get();
		if (screen !== "main") open("main");
		widgetStore.set({ isPausedByUser: false });
	},

	onPlayStatic: () => {
		const { screen, open } = screenStore.get();
		if (screen !== "main") open("main");
		widgetStore.set({ isPausedByUser: false });
	},

	onWelcomeFinish: () => {
		const { showSubtitles } = playerStore.get();
		toggleSubtitles(showSubtitles);
	},
};
