import { cn } from "@/common/lib/utils";
import type { WidgetPosition } from "./types";

export const getWidgetPositionClasses = (position: WidgetPosition, open: boolean) => {
	return cn(
		!open && "opacity-0",

		position === "right" && "top-1/2 right-2 -translate-y-1/2 animate-move-right",
		position === "left" && "top-1/2 left-2 -translate-y-1/2 animate-move-left",

		!open && position === "right" && "-right-200",
		!open && position === "left" && "-left-200",
	);
};
