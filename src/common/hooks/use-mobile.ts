import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { useMediaQuery } from "./use-media-query";

export const useMobile = () => {
	const isExpanded = useWidgetStore((s) => s.isExpanded);
	return useMediaQuery("(max-width: 640px)") && !isExpanded;
};
