import type { ComponentProps } from "preact";
import { useMobile } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { useDraggable } from "@/widget/components/draggable";
import { Button, type ButtonProps } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";
import { useScreensStore } from "@/widget/stores/use-screens.store";

export const Screen = ({ children, className, ...props }: ComponentProps<"div">) => {
	return (
		<div
			autofocus
			className={cn(
				"widget-radius absolute inset-0 z-999999 flex animate-move-right flex-col bg-background",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
};

export const ScreenHeader = ({ children, className, ...props }: ComponentProps<"div"> & { close?: boolean }) => {
	const { onPointerDown } = useDraggable();

	return (
		<div className="relative">
			<div className={cn("flex h-min items-center gap-3 border-b p-2 *:z-10", className)} {...props}>
				{props.close && <ScreenClose />}
				{children}
			</div>

			<div
				className={cn(
					"absolute inset-0 z-0 touch-none",
					!__IS_EXTENSION__ && "not-expanded:hover:cursor-move sm:hover:cursor-move",
				)}
				{...{ onPointerDown }}
			/>
		</div>
	);
};

export const ScreenClose = ({ className, ...props }: ButtonProps) => {
	const closeAll = useScreensStore((s) => s.closeAll);
	const isMobile = useMobile();

	return (
		<Button
			aria-labe="Fechar"
			onClick={closeAll}
			variant="outline"
			size={isMobile ? "icon-sm" : "icon"}
			className={className}
			{...props}
		>
			<Icon name="arrow-left" aria-hidden="true" />
		</Button>
	);
};

export const ScreenTitle = ({ children, className, ...props }: ComponentProps<"h3">) => {
	return (
		<h3 className={cn("pointer-events-none font-semibold mobile:text-sm text-base", className)} {...props}>
			{children}
		</h3>
	);
};

export const ScreenContent = ({ children, className, ...props }: ComponentProps<"div">) => {
	return (
		<div className={cn("flex h-full flex-col gap-4 overflow-y-auto p-4", className)} {...props}>
			{children}
		</div>
	);
};
