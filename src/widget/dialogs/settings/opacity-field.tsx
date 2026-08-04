import { useEffect, useRef } from "preact/hooks";
import { posthogg } from "@/common/lib/posthog";
import { InlineTranslatorButton } from "@/widget/components/inline-translator-button";
import { useWidgetStore, widgetStore } from "@/widget/stores/use-widget.store";
import { useSettingsCtx } from "./context";

export const SettingsOpacityField = () => {
	const timeoutRef = useRef<NodeJS.Timeout>(null);
	const opacity = useWidgetStore((s) => s.opacity);
	const onOpen = useSettingsCtx((s) => s.onOpen);
	const progress = Number(opacity) * 100;

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	const handleOpacityChange = (opacity: number) => {
		widgetStore.set({ opacity: opacity / 100 });

		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => posthogg.trackEvent("opacity_change", { opacity }), 2000);
	};

	return (
		<div>
			<div className="flex w-full items-center justify-between mobile:text-sm text-base">
				<p className="mobile:text-sm text-base">
					Opacidade
					<InlineTranslatorButton gloss="OPACIDADE" onFinish={onOpen} />
				</p>

				<span className="font-semibold">{Math.round(Number(opacity) * 100)}%</span>
			</div>
			<input
				type="range"
				min={0}
				max={100}
				step={5}
				value={progress}
				onChange={(e) => handleOpacityChange(Number(e.currentTarget.value))}
				onPointerDown={(e) => e.stopPropagation()}
				className="range-slider"
				style={{
					background: `linear-gradient(to right, var(--color-primary, #3b82f6) ${progress}%, var(--color-muted, #e2e8f0) ${progress}%)`,
				}}
			/>
		</div>
	);
};
