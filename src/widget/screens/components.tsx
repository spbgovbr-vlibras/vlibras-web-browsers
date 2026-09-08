import { type ComponentProps, createContext } from "preact";
import { useContext, useEffect, useId, useRef } from "preact/hooks";
import { useMobile } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { DragHandle } from "@/widget/components/draggable";
import { Button, type ButtonProps } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";
import { rootStore } from "@/widget/stores/use-root.store";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { trapTabFocus } from "@/widget/utils/focus";

const ScreenContext = createContext<string>("");

export const Screen = ({ children, className, ...props }: ComponentProps<"div">) => {
	const ref = useRef<HTMLDivElement | null>(null);
	const triggerRef = useRef<HTMLElement | null>(null);
	const titleId = useId();
	const closeAll = useScreensStore((s) => s.closeAll);

	useEffect(() => {
		const { shadowRoot } = rootStore.get();
		const active = (shadowRoot?.activeElement ?? document.activeElement) as HTMLElement | null;
		if (active && active !== document.body) triggerRef.current = active;

		const frame = requestAnimationFrame(() => ref.current?.focus({ preventScroll: true }));

		return () => {
			cancelAnimationFrame(frame);
			const trigger = triggerRef.current;
			triggerRef.current = null;

			if (trigger?.isConnected) {
				trigger.focus({ preventScroll: true });
				return;
			}

			rootStore.get().appRoot?.querySelector<HTMLElement>("#header-menu-button")?.focus({ preventScroll: true });
		};
	}, []);

	return (
		<ScreenContext.Provider value={titleId}>
			<div
				ref={ref}
				tabIndex={-1}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				onKeyDown={(e) => {
					if (e.key === "Escape") {
						e.stopPropagation();
						closeAll();
						return;
					}
					trapTabFocus(ref.current, e);
				}}
				className={cn(
					"widget-radius absolute inset-0 z-999999 flex animate-move-right flex-col bg-background",
					className,
				)}
				{...props}
			>
				{children}
			</div>
		</ScreenContext.Provider>
	);
};

export const ScreenHeader = ({ children, className, ...props }: ComponentProps<"div"> & { close?: boolean }) => {
	return (
		<div className="relative">
			<div className={cn("flex h-min items-center gap-3 border-b p-2 *:z-10", className)} {...props}>
				{props.close && <ScreenClose />}
				{children}
			</div>

			<DragHandle />
		</div>
	);
};

export const ScreenClose = ({ className, ...props }: ButtonProps) => {
	const closeAll = useScreensStore((s) => s.closeAll);
	const isMobile = useMobile();

	return (
		<Button
			aria-label="Voltar"
			onClick={closeAll}
			variant="outline"
			size={isMobile ? "icon-sm" : "icon"}
			className={className}
			{...props}
		>
			<Icon name="arrow-left" />
		</Button>
	);
};

export const ScreenTitle = ({ children, className, ...props }: ComponentProps<"h2">) => {
	const titleId = useContext(ScreenContext);

	return (
		<h2 id={titleId} className={cn("pointer-events-none font-semibold mobile:text-sm text-base", className)} {...props}>
			{children}
		</h2>
	);
};

export const ScreenContent = ({ children, className, ...props }: ComponentProps<"div">) => {
	return (
		<div className={cn("flex h-full flex-col gap-4 overflow-y-auto p-4", className)} {...props}>
			{children}
		</div>
	);
};
