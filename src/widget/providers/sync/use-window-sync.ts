import { useEffect } from "preact/hooks";
import { omit } from "@/common/utils";
import { useTranslate } from "@/core/actions/hooks";
import * as actions from "@/player/actions";
import { playerStore, usePlayerStore } from "@/player/use-player.store";
import { widgetStore } from "@/widget/stores/use-widget.store";

export const useWindowSyncProvider = () => {
	const isLoaded = usePlayerStore((s) => s.isLoaded);

	const { mutateAsync: translate } = useTranslate();

	const translateAndPlay = async (text: string) => {
		const gloss = await translate(text);
		actions.play(gloss);
	};

	const translateText = async (text: string) => {
		const gloss = await translate(text);
		return gloss;
	};

	useEffect(() => {
		if (typeof window === "undefined" || !isLoaded) return;
		window.plugin = window.plugin || {};

		const globalAttributes = {
			...omit(playerStore.get(), "send"),
			...omit(widgetStore.get(), "reset", "setLoaded"),
			...omit(actions, "setConfig"),
		};

		window.vlibras = {
			...globalAttributes,
			translate: translateText,
			translateAndPlay,
		};

		// Definições legadas
		window.plugin.translate = translateAndPlay;
		window.plugin.player = {
			...globalAttributes,
			changeAvatar: actions.toggleAvatar,
		};
	}, [isLoaded]);
};
