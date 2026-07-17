import { useWidgetStore } from "@/widget/stores/use-widget.store";

export const AppBackground = () => {
	const opacity = useWidgetStore((s) => Number(s.opacity || 0) * 100);
	return (
		<div
			style={{ opacity: `${opacity}%` }}
			className="sm:widget-radius absolute inset-0 -z-50 bg-[#f8f8f8] dark:bg-[#0a0a0a]"
		/>
	);
};
