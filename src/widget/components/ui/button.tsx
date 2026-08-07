import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "preact";
import { cn } from "@/common/lib/utils";

export const buttonVariants = cva(
	"flex cursor-pointer items-center justify-center [&>svg]:shrink-0 [&>i:not([class*='size-'])]:size-5.25 gap-x-2 rounded-lg text-foreground",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground outline-primary-foreground hover:brightness-115",
				outline: "border border-foreground/20 hover:bg-foreground/5",
				ghost: "bg-transparent hover:bg-muted",
				muted: "bg-muted text-foreground hover:bg-accent",
				secondary: "bg-secondary text-secondary-foreground hover:brightness-110",
				destructive: "bg-destructive text-destructive-foreground outline-destructive-foreground hover:brightness-125",
				"outline-gov": "border border-primary hover:bg-primary/15 text-primary active:bg-primary/20",
				"muted-gov": "bg-primary/15 text-primary hover:bg-primary/20",
				"ghost-gov": "bg-primary/10 text-primary hover:bg-primary/15 active:bg-primary/20",
			},
			size: {
				default: "h-9 px-3.5 py-2",
				xl: "h-12 px-4.5 py-2",
				lg: "h-10 px-4 py-1.25",
				sm: "h-8 gap-1.5 px-3 py-1.25 text-sm [&>i:not([class*='size-'])]:size-5",
				xs: "h-7 gap-1 px-2.5 py-1 text-xs [&>i:not([class*='size-'])]:size-4",
				icon: "size-9 shrink-0 [&>i:not([class*='size-'])]:size-5.25",
				"icon-xl": "size-12 shrink-0 [&>i:not([class*='size-'])]:size-6.5",
				"icon-lg": "size-10 shrink-0 [&>i:not([class*='size-'])]:size-6",
				"icon-sm": "size-8 shrink-0 text-sm [&>i:not([class*='size-'])]:size-4.5",
				"icon-xs": "size-7 shrink-0 [&>i:not([class*='size-'])]:size-4",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
export type ButtonProps = ComponentProps<"button"> & ButtonVariants;

export const Button = ({ children, disabled, className, variant, size, ref, ...props }: ButtonProps) => {
	return (
		<button
			inert={disabled}
			tabIndex={disabled ? -1 : 0}
			disabled={disabled}
			ref={ref}
			className={cn(buttonVariants({ variant, size }), disabled && "opacity-50", className)}
			type={props.type || "button"}
			{...props}
		>
			{children}
		</button>
	);
};
