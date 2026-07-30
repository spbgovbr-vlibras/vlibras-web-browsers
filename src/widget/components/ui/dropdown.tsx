import type { ComponentProps } from "preact";
import { cn } from "@/common/lib/utils";
import { type ButtonVariants, buttonVariants } from "./button";

export type DropdownTriggerProps = ComponentProps<"button"> &
	ButtonVariants & {
		asChild?: boolean;
	};

export const DropdownTrigger = ({
	variant,
	size,
	className,
	disabled,
	type = "button",
	...props
}: DropdownTriggerProps) => {
	return (
		<button
			type={type}
			disabled={disabled}
			aria-disabled={disabled}
			className={cn(buttonVariants({ variant, size }), className)}
			{...props}
		/>
	);
};
