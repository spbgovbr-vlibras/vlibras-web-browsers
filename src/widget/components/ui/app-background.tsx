import { useWidgetStore } from "@/widget/stores/use-widget.store";

export const AppBackground = () => {
	const opacity = useWidgetStore((s) => Number(s.opacity || 0) * 100);
	return <div style={{ opacity: `${opacity}%` }} className="absolute inset-0 -z-50 bg-[#eee] dark:bg-[#111]" />;
};
