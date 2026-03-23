import { useEffect } from "preact/hooks";
import { createStyle } from "@/core/dom";
import { usePlayer } from "@/player/use-player";
import { translate } from "@/widget/actions";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import css from "@/widget/styles/text-capture.css?inline";
import { textCapture } from "@/widget/utils/text-capture";

export const ManagerProvider = () => {
	const { play, isLoaded, stop } = usePlayer();

	useEffect(() => {
		if (!isLoaded) return;

		createStyle(css, "TEXT_CAPTURE");
		const cleanup = textCapture({
			hoverClss: "vlb--hover",
			activeClass: "vlb--active",
			callback: async (text) => {
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
