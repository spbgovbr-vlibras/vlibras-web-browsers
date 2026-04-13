import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "preact/compat";
import { cn } from "@/common/lib/utils";

export const buttonVariants = cva(
	"flex cursor-pointer items-center justify-center [&_svg:not([class*='size-'])]:size-5.25 gap-x-2 rounded-lg text-foreground",
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
				sm: "h-8 gap-1.5 px-3 py-1.25 text-sm [&_svg:not([class*='size-'])]:size-5",
				xs: "h-7 gap-1 px-2.5 py-1 text-xs [&_svg:not([class*='size-'])]:size-4",
				icon: "h-9 w-9 min-w-9 [&_svg:not([class*='size-'])]:size-5.25",
				"icon-xl": "h-12 w-12 min-w-12 [&_svg:not([class*='size-'])]:size-6.5",
				"icon-lg": "h-10 w-10 min-w-10 [&_svg:not([class*='size-'])]:size-6",
				"icon-sm": "h-8 w-8 min-w-8 text-sm [&_svg:not([class*='size-'])]:size-4.5",
				"icon-xs": "h-7 w-7 min-w-7 [&_svg:not([class*='size-'])]:size-4",
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
