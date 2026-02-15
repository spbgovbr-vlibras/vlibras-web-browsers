import type { ComponentProps } from "preact/compat";
import { cn } from "@/common/lib/utils";

export type ButtonProps = ComponentProps<"button"> & {
	variant?: "primary" | "outline" | "ghost" | "destructive" | "secondary";
};

export const Button = ({ children, disabled, className, variant, ref, ...props }: ButtonProps) => {
	return (
		<button
			tabIndex={disabled ? -1 : 0}
			disabled={disabled}
			ref={ref}
			className={cn(
				"flex cursor-pointer items-center justify-center gap-x-2 rounded-md text-foreground",
				disabled && "*:pointer-events-none! pointer-events-none opacity-50",
				Boolean(variant) && "h-9 px-4",
				variant === "primary" && "bg-primary text-primary-foreground outline-primary-foreground hover:brightness-110",
				variant === "outline" && "border border-foreground/20 hover:bg-foreground/5",
				variant === "ghost" && "hover:bg-foreground/10",
				variant === "secondary" && "bg-accent text-foreground hover:brightness-110",
				variant === "destructive" &&
					"bg-destructive text-destructive-foreground outline-destructive-foreground hover:brightness-125",
				className,
			)}
			type={props.type || "button"}
			{...props}
		>
			{children}
		</button>
	);
};
