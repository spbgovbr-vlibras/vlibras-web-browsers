import { useEffect } from "preact/hooks";
import { useTheme } from "@/common/hooks";
import type { Theme } from "@/common/hooks/use-theme";
import { setSubtitleColor } from "@/player/actions";
import type { SubtitleColors } from "@/player/actions/types";
import { usePlayerStore } from "@/player/use-player.store";

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
		console.log(colors);
		setSubtitleColor(colors);
	}, [theme, isLoaded]);

	return null;
};
