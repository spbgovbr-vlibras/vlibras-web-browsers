import { useEffect } from "preact/hooks";
import { createStyle, removeStyle } from "@/core/dom";
import { play, stop } from "@/player/actions";
import { usePlayerStore } from "@/player/stores/use-player.store";
import { useTranslate } from "@/widget/hooks/use-translate";
import { resetCallback } from "@/widget/stores/use-callback.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import css from "@/widget/styles/text-capture.css?inline";
import { textCapture } from "@/widget/utils/text-capture";

export const useTextCaptureSync = () => {
	const isLoaded = usePlayerStore((s) => s.isLoaded);
	const isOpen = useWidgetStore((s) => s.isOpen);

	const { mutateAsync: translate } = useTranslate();

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

		if (!isOpen) cleanup?.();

		return () => cleanup?.();
	}, [isLoaded, isOpen]);
};
