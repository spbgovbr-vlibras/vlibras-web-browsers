import { useEffect } from "preact/hooks";
import { APP_INFO } from "@/common/constants";
import { omit } from "@/common/utils";
import * as actions from "@/player/actions";
import { playerStore, usePlayerStore } from "@/player/stores/use-player.store";
import { useTranslate } from "@/widget/hooks/use-translate";
import { widgetStore } from "@/widget/stores/use-widget.store";

export const useWindowSyncProvider = () => {
	const isLoaded = usePlayerStore((s) => s.isLoaded);
	const { mutateAsync: translate } = useTranslate(false);

	const translateAndPlay = async (text: string) => {
		const gloss = await translate(text);
		actions.play(gloss || text);
	};

	const translateText = async (text: string) => {
		const gloss = await translate(text);
		return gloss;
	};

	useEffect(() => {
		if (!isLoaded) return;
		window.plugin = window.plugin || {};

		const sync = () => {
			const globalAttributes = {
				project: APP_INFO,
				...omit(playerStore.get(), "send", "instance"),
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
		};

		sync();

		const unsubscribePlayer = playerStore.subscribe(sync);
		const unsubscribeWidget = widgetStore.subscribe(sync);

		return () => {
			unsubscribePlayer();
			unsubscribeWidget();
		};
	}, [isLoaded]);
};
