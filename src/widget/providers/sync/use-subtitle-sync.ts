import { useEffect } from "preact/hooks";
import { useTheme } from "@/common/hooks";
import type { Theme } from "@/common/hooks/use-theme";
import { setSubtitleColor, toggleSubtitles } from "@/player/actions";
import type { SubtitleColors } from "@/player/actions/types";
import { playerStore, usePlayerStore } from "@/player/use-player.store";

const themeSubtitleColors: Record<Theme, SubtitleColors> = {
	light: { color: "black", outline: "black", shadow: "black" },
	dark: { color: "white", outline: "white", shadow: "white" },
};

export const useSubtitleSync = () => {
	const theme = useTheme((s) => s.theme);
	const isLoaded = usePlayerStore((s) => s.isLoaded);

	useEffect(() => {
		if (!isLoaded) return;

		const colors = themeSubtitleColors[theme];
		setSubtitleColor(colors);
	}, [theme, isLoaded]);

	useEffect(() => {
		if (!isLoaded) return;

		const { showSubtitles } = playerStore.get();
		toggleSubtitles(showSubtitles);
	}, [isLoaded]);

	return null;
};
