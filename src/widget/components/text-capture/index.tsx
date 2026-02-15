import { Fragment, useEffect, useRef, useState } from "preact/compat";
import { cn } from "@/common/lib/utils";
import { Button } from "@/widget/components/ui/button";
import { LinkIcon, TouchIcon } from "@/widget/icons";
import { useTooltipStore } from "@/widget/stores/useTooltipStore";
import { normalizePosition } from "./utils";

export const TextCapture = () => {
	const tooltipRef = useRef<HTMLButtonElement>(null);

	const { type, event, onClick, isActive, render } = useTooltipStore();
	const [position, setPosition] = useState({ x: 0, y: 0, arrow: "bottom" });

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
				useTooltipStore.setState({ isActive: false });
			}
		};

		if (isActive) document.addEventListener("click", handleClickOutside);
		else document.removeEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [isActive]);

	useEffect(() => {
		if (event) {
			const { pageX, pageY } = event;
			setPosition(normalizePosition({ x: pageX, y: pageY, tooltip: tooltipRef.current }));

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
			style={{
				left: position.x,
				top: position.y,
				boxShadow: "2px 2px 10px 4px rgba(0, 0, 0, .2)",
			}}
			className={cn(
				"group absolute z-2147483647 h-9 -translate-x-6 -translate-y-full animate-scale rounded-md px-3 text-primary-foreground",
			)}
		>
			{render || (
				<Fragment>
					{type === "button" && <TouchIcon size={20} iconTitle="Interagir" />}
					{type === "link" && <LinkIcon size={20} iconTitle="Acessar link" />}

					<span className="relative bottom-0.5 whitespace-nowrap font-medium text-base">
						{type === "button" ? "Interagir" : "Acessar link"}
					</span>
				</Fragment>
			)}

			<span className="absolute inset-0 -z-1 rounded-md bg-primary group-hover:brightness-85" />
			<span
				className={cn(
					"absolute -z-2 size-4 -translate-x-1/2 rotate-45 bg-primary brightness-85",
					["bottom", "bottom-left", "bottom-right"].includes(position.arrow) ? "-bottom-5" : "top-3",
					["bottom-left", "top-left", "bottom", "top"].includes(position.arrow) ? "left-5" : "right-2",
				)}
			/>
		</Button>
	);
};
