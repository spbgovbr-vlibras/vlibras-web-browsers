import { useRef } from "preact/hooks";
import { posthogg } from "@/common/lib/posthog";
import { useWidgetStore, widgetStore } from "@/widget/stores/use-widget.store";

export const SettingsOpacityField = () => {
	const timeoutRef = useRef<NodeJS.Timeout>(null);
	const opacity = useWidgetStore((s) => s.opacity);

	const handleOpacityChange = (opacity: number) => {
		widgetStore.set({ opacity: opacity / 100 });

		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => posthogg.trackEvent("opacity_change", { opacity }), 2000);
	};

	return (
		<div>
			<div className="flex w-full items-center justify-between mobile:text-sm text-base">
				<p className="mobile:text-sm text-base">Opacidade</p>
				<span className="font-semibold">{Math.round(Number(opacity) * 100)}%</span>
			</div>

			<input
				type="range"
				min={0}
				max={100}
				step={5}
				value={Number(opacity) * 100}
				onChange={(e) => handleOpacityChange(Number(e.currentTarget.value))}
				className="range range-xs w-full text-primary [--range-bg:var(--muted)] [--range-thumb:var(--primary-foreground)]"
				onPointerDown={(e) => e.stopPropagation()}
			/>
		</div>
	);
};
