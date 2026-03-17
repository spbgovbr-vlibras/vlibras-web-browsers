import { type ComponentChildren, type ComponentProps, Fragment } from "preact";
import { useEffect, useImperativeHandle, useRef } from "preact/hooks";
import { cn } from "@/common/lib/utils";
import { useDialog } from "@/widget/app-providers/dialog";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

type DialogProps = {
	children: ComponentChildren;
};

export const Dialog = ({ children }: DialogProps) => {
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				useDialog.getState().setDialog(undefined);
			}
		};

		window.addEventListener("keydown", handleEscape);

		return () => window.removeEventListener("keydown", handleEscape);
	}, []);

	return <Fragment>{children}</Fragment>;
};

export const DialogContent = ({
	children,
	showOverlay,
	...props
}: ComponentProps<"div"> & {
	showOverlay?: boolean;
}) => {
	const { isExpanded } = useWidgetStore();
	const contentRef = useRef<HTMLDivElement>(null);

	if (props.ref) useImperativeHandle(props.ref, () => contentRef.current as HTMLDivElement, []);

	useEffect(() => {
		requestAnimationFrame(() => {
			if (!contentRef.current) return;

			const firstElement = contentRef.current.children[0] as HTMLElement;

			firstElement.tabIndex = 0;
			firstElement.focus({ preventScroll: true });
			firstElement.removeAttribute("tabindex");
		});
	}, []);

	return (
		<dialog
			className={cn(
				"modal modal-open absolute inset-0! bg-transparent! p-0! outline-none!",
				!showOverlay && "pointer-events-none!",
			)}
		>
			<div
				ref={contentRef}
				className={cn(
					"fixed xs:absolute inset-2 xs:inset-0! top-auto! xs:w-[calc(30rem-34px)]!",
					isExpanded && "md:w-2xl!",
				)}
				{...props}
			>
				<div
					className={cn(
						"absolute inset-2 top-auto! z-20 animate-move-up rounded-lg border bg-popover",
						props.className,
					)}
				>
					{children}
				</div>
				<DialogOverlay />
			</div>
		</dialog>
	);
};

export const DialogHeader = ({ children, className, ...props }: ComponentProps<"div">) => {
	return (
		<div className={cn("relative flex flex-col border-b p-4 leading-snug", className)} {...props}>
			{children}
		</div>
	);
};

export const DialogTitle = ({ children, className, ...props }: ComponentProps<"p">) => {
	return (
		<p className={cn("font-semibold text-base text-foreground", className)} {...props}>
			{children}
		</p>
	);
};

export const DialogDescription = ({ children, className, ...props }: ComponentProps<"span">) => {
	return (
		<span className={cn("font-normal text-muted-foreground text-sm sm:text-base", className)} {...props}>
			{children}
		</span>
	);
};

export const DialogScrollArea = ({ children, className, ...props }: ComponentProps<"div">) => {
	return (
		<div
			className={cn(
				"max-h-[calc(75dvh-74px)] xs:max-h-[calc(90dvh-74px)] w-full overflow-y-auto p-4 font-normal text-foreground leading-relaxed",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
};

export const DialogOverlay = () => {
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: ...
		<div
			onKeyDown={undefined}
			onClick={() => useDialog.getState().setDialog(undefined)}
			className="modal-backdrop absolute inset-0 z-10 bg-black/15! dark:bg-black/50!"
		/>
	);
};
