import type { ComponentProps } from "preact/compat";
import { cn } from "@/common/lib/utils";

export const Screen = ({ children, className, ...props }: ComponentProps<"div">) => {
	return (
		<div
			autofocus
			className={cn("absolute inset-0 flex animate-move-right flex-col rounded-2xl bg-background", className)}
			{...props}
		>
			{children}
		</div>
	);
};

export const ScreenHeader = ({ children, className, ...props }: ComponentProps<"div">) => {
	return (
		<div className={cn("flex items-center gap-1.5 border-b p-4", className)} {...props}>
			{children}
		</div>
	);
};

export const ScreenTitle = ({ children, className, ...props }: ComponentProps<"h3">) => {
	return (
		<h3 className={cn("font-semibold", className)} {...props}>
			{children}
		</h3>
	);
};

export const ScreenContent = ({ children, className, ...props }: ComponentProps<"div">) => {
	return (
		<div className={cn("h-full overflow-y-auto p-4", className)} {...props}>
			{children}
		</div>
	);
};
