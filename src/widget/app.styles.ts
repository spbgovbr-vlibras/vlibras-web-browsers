import { cn } from "@/common/lib/utils";
import type { WidgetPosition } from "./types";

export const getWidgetPositionClasses = (position: WidgetPosition, open: boolean) => {
	return cn(
		!open && "opacity-0",

		position === "right" && "top-1/2 right-2 -translate-y-1/2 animate-move-right",
		position === "left" && "top-1/2 left-2 -translate-y-1/2 animate-move-left",
		position === "top" && "top-2 left-1/2 -translate-x-1/2 animate-move-top",
		position === "bottom" && "bottom-2 left-1/2 -translate-x-1/2 animate-move-bottom",

		position === "top-left" && "top-2 left-2 animate-move-left",
		position === "top-right" && "top-2 right-2 animate-move-right",
		position === "bottom-left" && "bottom-2 left-2 animate-move-left",
		position === "bottom-right" && "right-2 bottom-2 animate-move-right",

		!open && position.includes("right") && "-right-200",
		!open && position.includes("left") && "-left-200",
		!open && position === "top" && "-top-200",
		!open && position === "bottom" && "-bottom-200",
	);
};
