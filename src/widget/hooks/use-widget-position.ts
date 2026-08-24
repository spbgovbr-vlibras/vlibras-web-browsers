import { useMemo } from "preact/hooks";
import { usePlayerStore } from "@/player/stores/use-player.store";
import { widgetStore } from "../stores/use-widget.store";

export const useWidgetPosition = () => {
	const isLoaded = usePlayerStore((s) => s.isLoaded);

	const position = useMemo(() => {
		if (isLoaded) return widgetStore.get().position;
		return window.VLibrasWidget?.position?.toLowerCase() === "l" ? "left" : "right";
	}, [isLoaded]);

	return position;
};
