import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentChildren, ComponentProps } from "preact";
import { useState } from "preact/hooks";
import { useTouchDevice } from "@/common/hooks";
import { cn } from "@/common/lib/utils";

const tooltipVariants = cva("border bg-popover", {
	variants: {
		variant: {
			default: "bg-background backdrop-blur-sm **:text-foreground",
			primary: "border-primary bg-primary *:text-primary-foreground",
			destructive: "border-destructive bg-destructive *:text-destructive-foreground",
			info: "border-blue-500 bg-blue-500 *:text-blue-50",
			warning: "border-orange-500 bg-orange-500 *:text-orange-50",
			success: "border-green-700 bg-green-700 *:text-green-50",
			reverse: "border-foreground/10 bg-foreground *:text-background",
		},
	},
});

type TooltipCustomProps = VariantProps<typeof tooltipVariants> & {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	content?: ComponentChildren;
	disabled?: boolean;
	placement?: "top" | "bottom" | "left" | "right";
	align?: "start" | "center" | "end";
	offset?: number;
	arrow?: {
		containerClassName?: string;
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
	offset = -4,
	align = "center",
	placement = "top",
	variant = "default",
	className,
	open,
	onOpenChange,
	...props
}: TooltipProps) => {
	const [visible, setVisible] = useState(false);

	const isTouchDevice = useTouchDevice();
	const tooltipId = "vlibras-tooltip";
	const isVisible = isTouchDevice ? false : (open ?? visible);

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

	const handleOpenChange = (_open: boolean) => {
		if (open === undefined) setVisible(_open);
		onOpenChange?.(_open);
	};

	return (
		<div
			role="tooltip"
			className="relative inline-block has-[>[role=button][aria-disabled=true]]:pointer-events-none has-[>button:disabled]:pointer-events-none"
			onMouseEnter={() => handleOpenChange(true)}
			onMouseLeave={() => handleOpenChange(false)}
			onFocus={() => handleOpenChange(true)}
			onBlur={() => handleOpenChange(false)}
		>
			{children}
			{isVisible && !disabled && (
				<div
					data-slot="tooltip-content"
					id={tooltipId}
					style={getStyleOffset()}
					className={cn(
						tooltipVariants({ variant }),
						"absolute z-99999 rounded-lg px-3 py-1.5 expanded:text-sm text-popover-foreground text-xs shadow-lg transition-opacity duration-200",
						placement === "bottom" && "-bottom-4 left-1/2 -translate-x-1/2 translate-y-full animate-move-down",
						placement === "top" && "-top-4 left-1/2 -translate-x-1/2 -translate-y-full animate-move-up",
						placement === "right" && "top-1/2 translate-x-1/2 -translate-y-1/2",
						placement === "left" && "top-1/2 -translate-y-1/2",
						align === "start" && "right-auto! left-0! translate-x-0",
						align === "end" && "right-0! left-auto! translate-x-0",
						className,
					)}
					{...props}
				>
					<div className="relative font-semibold">
						{content}
						{arrow && (
							<div
								data-slot="arrow-container"
								className={cn(
									"absolute left-1/2 -ml-2 flex max-h-2 items-center justify-center overflow-hidden",
									arrow.position.includes("top") && "-top-3.5",
									arrow.position.includes("bottom") && "-bottom-3.5",
									arrow.position.includes("left") && "left-2",
									arrow.position.includes("right") && "-right-1 left-auto",
									arrow.position === "right" && "top-1/2 -right-6 left-auto -translate-y-1/2 -rotate-90",
									arrow.position === "left" && "top-1/2 right-auto -left-4 -translate-y-1/2 rotate-90",
									arrow.containerClassName,
								)}
							>
								<span
									data-slot="arrow"
									className={cn(
										"-z-50 h-4 w-4 rotate-45",
										tooltipVariants({ variant }),
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
