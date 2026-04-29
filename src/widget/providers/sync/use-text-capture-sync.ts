import { useEffect } from "preact/hooks";
import { useTranslate } from "@/core/actions/hooks";
import { createStyle, removeStyle } from "@/core/dom";
import { usePlayer } from "@/player/use-player";
import { usePlayerStore } from "@/player/use-player.store";
import { resetCallback } from "@/widget/stores/use-callback.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import css from "@/widget/styles/text-capture.css?inline";
import { textCapture } from "@/widget/utils/text-capture";

export const useTextCaptureSync = () => {
	const isLoaded = usePlayerStore((s) => s.isLoaded);
	const isOpen = useWidgetStore((s) => s.isOpen);

	const { mutateAsync: translate } = useTranslate();
	const { play, stop } = usePlayer();

	useEffect(() => {
		if (!isLoaded) return;

		if (isOpen) createStyle(css, "@text-capture.style");
		else removeStyle("@text-capture.style");
	}, [isOpen, isLoaded]);

	useEffect(() => {
		if (!isLoaded) return;

		const cleanup = textCapture({
			hoverClss: "vlibras--hover",
			activeClass: "vlibras--active",
			callback: async ({ text, isGloss }) => {
				stop();
				if (isGloss) return play(text);

				const gloss = await translate(text);

				resetCallback();
				play(gloss);
			},
		});

		return () => cleanup?.();
	}, [isLoaded]);
};
