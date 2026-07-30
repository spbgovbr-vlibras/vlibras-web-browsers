/* biome-ignore-all lint/a11y/useSemanticElements: Referência https://daisyui.com/components/dropdown/#method-3-css-focus */

import type { ComponentProps } from "preact";
import { cn } from "@/common/lib/utils";
import { type ButtonVariants, buttonVariants } from "./button";

export type DropdownTriggerProps = ComponentProps<"div"> &
	ButtonVariants & {
		disabled?: boolean;
		asChild?: boolean;
	};

export const DropdownTrigger = ({ variant, asChild, size, className, disabled, ...props }: DropdownTriggerProps) => {
	if (asChild) {
		return (
			<div inert={disabled} role="button" tabIndex={0} className={className} {...props}>
				{props.children}
			</div>
		);
	}

	return (
		<div
			aria-disabled={disabled}
			inert={disabled}
			role="button"
			tabIndex={0}
			className={cn(buttonVariants({ variant, size }), className, disabled && "opacity-50")}
			{...props}
		/>
	);
};
