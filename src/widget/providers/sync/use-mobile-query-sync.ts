import { useEffect } from "preact/hooks";
import { mobileQueryStore } from "@/common/hooks/use-mobile";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

export const useMobileQuerySync = () => {
	const isExpanded = useWidgetStore((s) => s.isExpanded);
	useEffect(() => mobileQueryStore.set({ isExpanded }), [isExpanded]);
};
