import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { useMediaQuery } from "./use-media-query";

export const useMobile = () => {
	const { isFullscreen } = useWidgetStore();
	return useMediaQuery("(max-width: 640px)") && !isFullscreen;
};
