import { useEffect } from "preact/hooks";
import { createStyle } from "@/core/dom";
import { usePlayer } from "@/player/use-player";
import { translate } from "@/widget/actions";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import css from "@/widget/styles/text-capture.css?inline";
import { textCapture } from "@/widget/utils/text-capture";

export const SyncProvider = () => {
	const { isTranslating } = useWidgetStore();
	const { play, isLoaded, stop, playWelcome, speed, setSpeed, toggleSubtitles, showSubtitles, isWelcomeFinished } =
		usePlayer();

	useEffect(() => void (isLoaded && playWelcome()), [isLoaded]);
	useEffect(() => void (isLoaded && setSpeed(speed)), [isLoaded]);
	useEffect(() => void (isWelcomeFinished && toggleSubtitles(showSubtitles)), [isWelcomeFinished]);

	useEffect(() => {
		const root = document.documentElement;
		if (isTranslating) root.dataset.vlibrasStatus = "translating";
		else delete root.dataset.vlibrasStatus;
	}, [isTranslating]);

	useEffect(() => {
		if (!isLoaded) return;

		createStyle(css, "TEXT_CAPTURE");
		const cleanup = textCapture({
			hoverClss: "vlibras--hover",
			activeClass: "vlibras--active",
			callback: async ({ text, isGloss }) => {
				stop();

				if (isGloss) return play(text);

				useWidgetStore.setState({ isTranslating: true, text });
				const data = await translate(text);
				useWidgetStore.setState({ isTranslating: false });

				console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", text);
				play(data.gloss);
			},
		});
		return () => cleanup?.();
	}, [isLoaded]);

	return null;
};
