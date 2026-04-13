import type { ComponentProps } from "preact/compat";
import { cn } from "@/common/lib/utils";

export const Separator = ({
	className,
	orientation = "horizontal",
	...props
}: Omit<ComponentProps<"div">, "children"> & {
	orientation?: "horizontal" | "vertical";
}) => {
	return (
		<div className={cn("bg-border", orientation === "horizontal" ? "min-h-px" : "min-w-px", className)} {...props} />
	);
};
