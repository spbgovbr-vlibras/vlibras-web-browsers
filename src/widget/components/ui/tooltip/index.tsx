import type { ComponentChildren, ComponentProps } from "preact";
import { useState } from "preact/hooks";
import { cn } from "@/common/lib/utils";

type TooltipCustomProps = {
	content?: ComponentChildren;
	disabled?: boolean;
	placement?: "top" | "bottom" | "left" | "right";
	align?: "start" | "center" | "end";
	offset?: number;
	arrow?: {
		className?: string;
		position: "top" | "bottom" | "right" | "left" | "top-left" | "bottom-left" | "top-right" | "bottom-right";
	};
};

export type TooltipProps = ComponentProps<"div"> & TooltipCustomProps;

export const Tooltip = ({
	children,
	disabled,
	content,
	arrow,
	offset = 0,
	align = "center",
	placement = "top",
	className,
	...props
}: TooltipProps) => {
	const [visible, setVisible] = useState(false);
	const tooltipId = "vwp-tooltip";

	if (!content) return children;

	const getStyleOffset = () => {
		switch (placement) {
			case "top":
				return { marginTop: offset * -1 };
			case "bottom":
				return { marginBottom: offset * -1 };
			case "left":
				return { marginRight: offset };
			case "right":
				return { marginLeft: offset };
			default:
				return { top: `calc((-100% + 8px) - ${offset}px)` };
		}
	};

	return (
		<div
			role="tooltip"
			className="relative inline-block"
			onMouseEnter={() => setVisible(true)}
			onMouseLeave={() => setVisible(false)}
			onFocus={() => setVisible(true)}
			onBlur={() => setVisible(false)}
		>
			<span aria-describedby={tooltipId} className={cn(disabled && "pointer-events-none opacity-50")}>
				{children}
			</span>

			{visible && !disabled && (
				<div
					id={tooltipId}
					role="tooltip"
					style={{ boxShadow: "2px 2px 15px -5px rgba(0, 0, 0, .2)", ...getStyleOffset() }}
					className={cn(
						"absolute z-2147483647 rounded-md border bg-popover px-3 py-1.5 text-popover-foreground text-sm shadow-lg transition-opacity duration-200",
						placement === "bottom" && "-bottom-4 left-1/2 -translate-x-1/2 translate-y-full",
						placement === "top" && "-top-4 left-1/2 -translate-x-1/2 -translate-y-full",
						placement === "right" && "top-1/2 translate-x-1/2 -translate-y-1/2",
						placement === "left" && "top-1/2 -translate-y-1/2",
						align === "start" && "right-auto! left-0! translate-x-0",
						align === "end" && "right-0! left-auto! translate-x-0",
						className,
					)}
					{...props}
				>
					<div className="relative">
						{content}
						{arrow && (
							<div
								className={cn(
									"absolute left-1/2 -ml-2 flex max-h-2 items-center justify-center overflow-hidden",
									arrow.position.includes("top") && "-top-[13.444px]",
									arrow.position.includes("bottom") && "-bottom-[13.444px]",
									arrow.position.includes("left") && "left-2",
									arrow.position.includes("right") && "right-0 left-auto",
									arrow.position === "right" && "top-1/2 -right-6 left-auto -translate-y-1/2 -rotate-90",
									arrow.position === "left" && "top-1/2 right-auto -left-4 -translate-y-1/2 rotate-90",
								)}
							>
								<span
									className={cn(
										"-z-50 h-4 w-4 rotate-45 border bg-popover",
										arrow.position.includes("top") ? "mt-3.5" : "mb-3.5",
										arrow.className,
									)}
								/>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
