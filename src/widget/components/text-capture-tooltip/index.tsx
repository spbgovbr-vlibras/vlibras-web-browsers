import { Fragment, useEffect, useRef, useState } from "preact/compat";
import { cn } from "@/common/lib/utils";
import { Button } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";
import { tooltipStore, useTooltipStore } from "@/widget/stores/use-tooltip.store";
import { normalizePosition } from "./utils";

export const TextCaptureTooltip = () => {
	const tooltipRef = useRef<HTMLButtonElement>(null);

	const { type, event, onClick, isActive, render } = useTooltipStore();
	const [position, setPosition] = useState({ x: 0, y: 0, arrow: "bottom" });

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
				tooltipStore.set({ isActive: false });
			}
		};

		if (isActive) document.addEventListener("click", handleClickOutside);
		else document.removeEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [isActive]);

	useEffect(() => {
		if (event && tooltipRef.current) {
			setPosition(normalizePosition({ event, tooltip: tooltipRef.current }));

			const btn = tooltipRef.current;
			if (btn) {
				btn.classList.remove("animate-scale");
				btn.offsetWidth;
				btn.classList.add("animate-scale");
			}
		}
	}, [event]);

	return (
		<Button
			ref={tooltipRef}
			onClick={onClick}
			style={{ left: position.x, top: position.y }}
			className={cn(
				"group absolute z-2147483647 h-9 -translate-x-6 -translate-y-full animate-scale rounded-lg px-3 text-primary-foreground shadow-lg",
				!isActive && "hidden",
			)}
		>
			{render || (
				<Fragment>
					<Icon name={type === "button" ? "touch" : "link"} className="size-5" />
					<span className="relative bottom-0.5 whitespace-nowrap font-medium text-sm">
						{type === "button" ? "Interagir" : "Acessar link"}
					</span>
				</Fragment>
			)}

			<span className="absolute inset-0 -z-1 rounded-lg bg-primary group-hover:brightness-85" />
			<span
				className={cn(
					"absolute -z-2 size-4 -translate-x-1/2 rotate-45 bg-primary brightness-85",
					["bottom", "bottom-left", "bottom-right"].includes(position.arrow) ? "-bottom-1.5" : "-top-1.5",
					["bottom-left", "top-left", "bottom", "top"].includes(position.arrow) ? "left-5" : "right-2",
				)}
			/>
		</Button>
	);
};
