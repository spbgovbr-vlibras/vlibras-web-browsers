import type { ComponentPropsWithoutRef } from "preact/compat";
import { cn } from "@/common/lib/utils";

export const Separator = ({
	className,
	orientation = "horizontal",
	...props
}: Omit<ComponentPropsWithoutRef<"div">, "class" | "children"> & {
	orientation?: "horizontal" | "vertical";
}) => {
	return (
		<div className={cn("bg-border", orientation === "horizontal" ? "min-h-px" : "min-w-px", className)} {...props} />
	);
};
