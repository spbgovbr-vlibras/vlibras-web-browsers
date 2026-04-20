import { useEffect } from "preact/hooks";
import { useTranslate } from "@/core/actions/hooks";
import { createStyle } from "@/core/dom";
import { usePlayer } from "@/player/use-player";
import { usePlayerStore } from "@/player/use-player.store";
import { resetCallback } from "@/widget/stores/use-callback.store";
import { widgetStore } from "@/widget/stores/use-widget.store";
import css from "@/widget/styles/text-capture.css?inline";
import { textCapture } from "@/widget/utils/text-capture";

export const useTextCaptureSync = () => {
	const isLoaded = usePlayerStore((s) => s.isLoaded);

	const { mutateAsync: translate } = useTranslate();
	const { play, stop } = usePlayer();

	useEffect(() => {
		if (!isLoaded) return;

		createStyle(css, "@text-capture.style");

		const cleanup = textCapture({
			hoverClss: "vlibras--hover",
			activeClass: "vlibras--active",
			callback: async ({ text, isGloss }) => {
				stop();
				if (isGloss) return play(text);

				try {
					widgetStore.set({ isTranslating: true, text });
					const gloss = await translate(text);

					resetCallback();
					play(gloss);
				} finally {
					widgetStore.set({ isTranslating: false });
				}
			},
		});

		return () => cleanup?.();
	}, [isLoaded]);
};
