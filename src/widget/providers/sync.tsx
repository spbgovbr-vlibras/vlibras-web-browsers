import { useEffect } from "preact/hooks";
import { createStyle } from "@/core/dom";
import { usePlayer } from "@/player/use-player";
import { translate } from "@/widget/actions";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import css from "@/widget/styles/text-capture.css?inline";
import { textCapture } from "@/widget/utils/text-capture";

export const SyncProvider = () => {
	const { play, isLoaded, stop, playWelcome, speed, setSpeed, toggleSubtitles, showSubtitles, isWelcomeFinished } =
		usePlayer();

	useEffect(() => void (isLoaded && playWelcome()), [isLoaded]);
	useEffect(() => void (isLoaded && setSpeed(speed)), [isLoaded]);
	useEffect(() => void (isWelcomeFinished && toggleSubtitles(showSubtitles)), [isWelcomeFinished]);

	useEffect(() => {
		if (!isLoaded) return;

		createStyle(css, "TEXT_CAPTURE");
		const cleanup = textCapture({
			hoverClss: "vlb--hover",
			activeClass: "vlb--active",
			callback: async ({ text, element }) => {
				console.log(element);
				stop();
				useWidgetStore.setState({ isTranslating: true });
				const data = await translate(text);
				useWidgetStore.setState({ isTranslating: false });

				play(data.gloss);
			},
		});
		return () => cleanup?.();
	}, [isLoaded]);

	return null;
};
