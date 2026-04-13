import type { ComponentProps } from "preact";
import { cn } from "@/common/lib/utils";
import { type ButtonVariants, buttonVariants } from "./button";

export type DropdownTriggerProps = ComponentProps<"div"> &
	ButtonVariants & {
		disabled?: boolean;
	};

export const DropdownTrigger = ({ variant, size, className, disabled, ...props }: DropdownTriggerProps) => {
	return (
		/* biome-ignore lint/a11y/useSemanticElements: Referência https://daisyui.com/components/dropdown/#method-3-css-focus */
		<div
			{...props}
			aria-disabled={disabled}
			inert={disabled}
			role="button"
			tabIndex={0}
			className={cn(buttonVariants({ variant, size }), className, disabled && "opacity-50")}
		/>
	);
};
