import type { ComponentProps } from "preact/compat";
import { cn } from "@/common/lib/utils";

export const Spacer = ({ className, ...props }: Omit<ComponentProps<"div">, "children">) => {
	return <div className={cn("h-4", className)} {...props} />;
};
