import type { ComponentPropsWithoutRef } from "preact/compat";
import { cn } from "@/common/lib/utils";

export const Screen = ({ children, className, ...props }: ComponentPropsWithoutRef<"div">) => {
	return (
		<div className={cn("flex h-full animate-move-right flex-col bg-background", className)} {...props}>
			{children}
		</div>
	);
};

export const ScreenHeader = ({ children, className, ...props }: ComponentPropsWithoutRef<"div">) => {
	return (
		<div className={cn("flex items-center gap-2 border-b p-4", className)} {...props}>
			{children}
		</div>
	);
};

export const ScreenTitle = ({ children, className, ...props }: ComponentPropsWithoutRef<"h3">) => {
	return (
		<h3 className={cn("font-semibold text-lg", className)} {...props}>
			{children}
		</h3>
	);
};

export const ScreenContent = ({ children, className, ...props }: ComponentPropsWithoutRef<"div">) => {
	return (
		<div className={cn("h-full overflow-y-auto p-4", className)} {...props}>
			{children}
		</div>
	);
};
