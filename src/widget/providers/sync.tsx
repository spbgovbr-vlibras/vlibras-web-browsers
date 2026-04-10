import { useEffect } from "preact/hooks";
import { usePick } from "@/common/hooks";
import { useTranslate } from "@/core/actions/hooks";
import { config } from "@/core/config";
import { createStyle } from "@/core/dom";
import { usePlayer } from "@/player/use-player";
import { usePlayerStore } from "@/player/use-player.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import css from "@/widget/styles/text-capture.css?inline";
import { textCapture } from "@/widget/utils/text-capture";

export const SyncProvider = () => {
	const { mutateAsync: translate, isPending: isTranslating } = useTranslate();
	const { play, stop, setConfig, playWelcome, setSpeed, toggleSubtitles } = usePlayer();
	const { isLoaded, speed, showSubtitles, isWelcomeFinished } = usePlayerStore(
		usePick("isLoaded", "speed", "showSubtitles", "isWelcomeFinished"),
	);

	useEffect(() => void (isLoaded && playWelcome()), [isLoaded]);
	useEffect(() => void (isLoaded && setSpeed(speed)), [isLoaded]);
	useEffect(() => void (isWelcomeFinished && toggleSubtitles(showSubtitles)), [isWelcomeFinished]);
	useEffect(() => void (isLoaded && setConfig({ baseUrl: config.DICTIONARY_URL })), [isLoaded]);
	useEffect(() => void useWidgetStore.setState({ isTranslating }), [isTranslating]);

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
				const gloss = await translate(text);
				useWidgetStore.setState({ isTranslating: false });

				play(gloss);
			},
		});
		return () => cleanup?.();
	}, [isLoaded]);

	return null;
};
