import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "preact/compat";
import { cn } from "@/common/lib/utils";

const buttonVariants = cva("flex cursor-pointer items-center justify-center gap-x-2 rounded-md text-foreground", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground outline-primary-foreground hover:brightness-110",
			outline: "border border-foreground/20 hover:bg-foreground/5",
			ghost: "hover:bg-foreground/10",
			secondary: "bg-secondary text-secondary-foreground hover:brightness-110",
			muted: "bg-accent text-foreground hover:brightness-95",
			destructive: "bg-destructive text-destructive-foreground outline-destructive-foreground hover:brightness-125",
		},
		size: {
			default: "h-9 px-3.5 py-2",
			sm: "h-8 px-3 py-1.5 text-sm",
			xs: "h-7 px-2.5 py-1 text-xs",
			icon: "h-9 w-9 min-w-9",
			"icon-sm": "h-8 w-8 min-w-8",
			"icon-xs": "h-7 w-7 min-w-7",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

export type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

export const Button = ({ children, disabled, className, variant, size, ref, ...props }: ButtonProps) => {
	return (
		<button
			tabIndex={disabled ? -1 : 0}
			disabled={disabled}
			ref={ref}
			className={cn(
				buttonVariants({ variant, size }),
				disabled && "*:pointer-events-none! pointer-events-none opacity-50",
				className,
			)}
			type={props.type || "button"}
			{...props}
		>
			{children}
		</button>
	);
};
