import type { ComponentProps } from "preact";
import { cn } from "@/common/lib/utils";
import { type ButtonVariants, buttonVariants } from "./button";

export type DropdownTriggerProps = ComponentProps<"div"> & ButtonVariants;

export const DropdownTrigger = ({ variant, size, className, ...props }: DropdownTriggerProps) => {
	/* biome-ignore lint/a11y/useSemanticElements: Referência https://daisyui.com/components/dropdown/#method-3-css-focus */
	return <div {...props} role="button" tabIndex={0} className={cn(buttonVariants({ variant, size }), className)} />;
};
