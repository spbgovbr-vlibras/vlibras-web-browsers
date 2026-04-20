import { useEffect } from "preact/hooks";
import { usePick } from "@/common/hooks";
import { useTranslate } from "@/core/actions/hooks";
import { config } from "@/core/config";
import { createStyle } from "@/core/dom";
import { usePlayer } from "@/player/use-player";
import { usePlayerStore } from "@/player/use-player.store";
import { resetCallback } from "@/widget/stores/use-callback.store";
import { useRootStore } from "@/widget/stores/use-root.store";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import css from "@/widget/styles/text-capture.css?inline";
import { textCapture } from "@/widget/utils/text-capture";

export const SyncProvider = () => {
	const root = useRootStore((s) => s.root);
	const screen = useScreensStore((s) => s.screen);

	const { mutateAsync: translate, isPending: isTranslating } = useTranslate();
	const { play, stop, pause, setConfig, playWelcome, setSpeed, toggleSubtitles } = usePlayer();
	const { isLoaded, speed, showSubtitles, isWelcomeFinished, status } = usePlayerStore(
		usePick("isLoaded", "speed", "showSubtitles", "isWelcomeFinished", "status"),
	);

	useEffect(() => void (isLoaded && playWelcome()), [isLoaded]);
	useEffect(() => void (isLoaded && setSpeed(speed)), [isLoaded]);
	useEffect(() => void (isWelcomeFinished && toggleSubtitles(showSubtitles)), [isWelcomeFinished]);
	useEffect(() => void (isLoaded && setConfig({ baseUrl: config.DICTIONARY_URL })), [isLoaded]);
	useEffect(() => void useWidgetStore.setState({ isTranslating }), [isTranslating]);

	useEffect(() => {
		const { isPausedByUser } = useWidgetStore.getState();
		if (!isPausedByUser) return;
		if (status === "playing") useWidgetStore.setState({ isPausedByUser: false });
	}, [status]);

	useEffect(() => {
		if (screen !== "main") pause();
	}, [screen]);

	useEffect(() => {
		const { open } = useScreensStore.getState();
		if (status === "playing") open("main");
	}, [status]);

	useEffect(() => {
		if (root) root.dataset.status = status;
	}, [status, root]);

	useEffect(() => {
		const root = document.documentElement;
		if (isTranslating) root.dataset.vlibrasStatus = "translating";
		else delete root.dataset.vlibrasStatus;
	}, [isTranslating]);

	useEffect(() => {
		if (!isLoaded) return;

		createStyle(css, "@text-capture.style");
		const cleanup = textCapture({
			hoverClss: "vlibras--hover",
			activeClass: "vlibras--active",
			callback: async ({ text, isGloss }) => {
				stop();

				if (isGloss) return play(text);

				useWidgetStore.setState({ isTranslating: true, text });
				const gloss = await translate(text);
				useWidgetStore.setState({ isTranslating: false });

				resetCallback();
				play(gloss);
			},
		});
		return () => cleanup?.();
	}, [isLoaded]);

	return null;
};
