import type { ComponentProps } from "preact/compat";
import { cn } from "@/common/lib/utils";

type BadgeCustomProps = {
	variant?: "primary" | "secondary" | "danger" | "success" | "warning" | "info" | "outline" | "solid";
	size?: "xs" | "sm" | "md";
	disabled?: boolean;
};

export type BadgeProps = ComponentProps<"span"> & BadgeCustomProps;

export const Badge = ({ className, variant, size, disabled, children, ...props }: BadgeProps) => {
	return (
		<span
			className={cn(
				"rounded-sm border-border text-foreground text-sm",
				className,
				disabled && "pointer-events-none opacity-50",
				size === "xs" && "px-1 text-xs",
				size === "sm" && "px-1.5 text-sm",
				size === "md" && "px-2 text-sm",
				variant === "outline" && "border bg-transparent",
				variant === "solid" && "bg-foreground text-background",
				variant === "primary" && "bg-primary text-primary-foreground",
				variant === "secondary" && "bg-secondary text-secondary-foreground",
				variant === "danger" && "bg-destructive text-destructive-foreground",
				variant === "success" && "bg-green-600 text-green-50",
				variant === "warning" && "bg-orange-600 text-orange-50",
				variant === "info" && "bg-blue-600 text-blue-50",
			)}
			{...props}
		>
			{children}
		</span>
	);
};
