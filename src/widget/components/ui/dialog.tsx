import { type ComponentChildren, type ComponentProps, createContext } from "preact";
import { createPortal } from "preact/compat";
import { useContext, useEffect, useState } from "preact/hooks";
import { useMobile } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { randomStr } from "@/common/utils";
import { $$ } from "@/common/utils/dom";
import { usePlayer } from "@/player/use-player";
import { playerStore, usePlayerStore } from "@/player/use-player.store";
import { XIcon } from "@/widget/icons";
import type { IconElement } from "@/widget/icons/types";
import { rootStore, useRootStore } from "@/widget/stores/use-root.store";
import { widgetStore } from "@/widget/stores/use-widget.store";
import { Button } from "./button";

type DialogContextProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	nested?: boolean;
	overlay?: boolean;
};

const DialogContext = createContext<DialogContextProps | null>(null);

const DialogWrapper = ({ children }: { children: ComponentChildren }) => {
	const id = randomStr();
	const context = useContext(DialogContext);
	const isPlaying = usePlayerStore((s) => s.status === "playing");

	const [closed, setClosed] = useState(true);

	useEffect(() => void (isPlaying && context?.onOpenChange(false)), [isPlaying]);
	useEffect(() => {
		const { appRoot, appContent } = rootStore.get();

		if (!context || !appContent || !appRoot) return;

		if (context.open) setClosed(false);
		else setTimeout(() => setClosed(true), 150);

		if (appContent && !context.nested && context.overlay === true) {
			appContent.inert = context.open;
			const otherDialogs = $$(`[data-slot='dialog-wrapper']:not([id='dialog-${id}'])`, appRoot);
			otherDialogs.forEach((dialog) => (dialog.inert = context.open));
		}
	}, [context?.open, context?.overlay]);

	if (!context || closed) return null;
	if (!context.overlay) return <div className="absolute inset-0 top-auto">{children}</div>;

	return (
		<div
			id={`dialog-${id}`}
			data-slot="dialog-wrapper"
			data-state={context.open ? "open" : "close"}
			className={cn("group absolute inset-0 z-99999 flex items-end bg-black/20", context.nested && "bg-transparent!")}
			{...{ onClick: () => context.onOpenChange(false) }}
		>
			{children}
		</div>
	);
};

type DialogProps = {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	children: ComponentChildren;
	/** Deve ser definido como `true` ao aninhar um Dialog dentro de outro para evitar efeitos colaterais. */
	nested?: boolean;
	overlay?: boolean;
};

export const Dialog = ({
	nested = false,
	overlay = true,
	open: _open,
	onOpenChange: _onOpenChange,
	children,
}: DialogProps) => {
	const [isOpen, setOpen] = useState(false);
	const { pause, play } = usePlayer();

	const open = _open ?? isOpen;
	const onOpenChange = _onOpenChange ?? setOpen;

	useEffect(() => {
		if (nested) return;
		const { isPausedByUser } = widgetStore.get();
		const { gloss, isWelcomeFinished, status } = playerStore.get();

		if (open && status === "playing") return pause();
		if (!open && !isPausedByUser && (gloss || !isWelcomeFinished)) setTimeout(play, 300);
	}, [open, nested]);

	return <DialogContext.Provider value={{ open, onOpenChange, nested, overlay }}>{children}</DialogContext.Provider>;
};

export const DialogTrigger = ({ children, ...props }: ComponentProps<"button">) => {
	const context = useContext(DialogContext);
	if (!context) throw new Error("DialogTrigger deve estar dentro de <Dialog />");

	return (
		<button type="button" onClick={() => context.onOpenChange(true)} {...props}>
			{children}
		</button>
	);
};

export const DialogHeader = ({ className, children, ...props }: ComponentProps<"div">) => {
	const context = useContext(DialogContext);
	const isMobile = useMobile();

	return (
		<div
			data-slot="dialog-header"
			className={cn("flex items-start gap-2 border-b p-2.5 mobile:py-2 pl-4", className)}
			{...props}
		>
			{children}

			<Button
				data-slot="dialog-close"
				onClick={() => context?.onOpenChange(false)}
				size={isMobile ? "icon-xs" : "icon-sm"}
				variant="ghost"
			>
				<XIcon />
			</Button>
		</div>
	);
};

type DialogTitleProps = ComponentProps<"h3"> & {
	icon?: IconElement;
};

export const DialogTitle = ({ children, icon: Icon, className, ...props }: DialogTitleProps) => {
	return (
		<h3
			data-slot="dialog-title"
			className={cn(
				"break-anywhere relative mt-0.75 mr-auto flex items-start gap-1.5 font-semibold mobile:text-sm text-base leading-normal",
				className,
			)}
			{...props}
		>
			{Icon && <Icon aria-hidden="true" className="relative -bottom-1 mobile:size-4.5 size-5 shrink-0" />}
			{children}
		</h3>
	);
};

export const DialogContent = ({
	children,
	className,
	showCloseButton = true,
	...props
}: Omit<ComponentProps<"div">, "children"> & {
	children?: ComponentChildren | ((props: DialogContextProps) => ComponentChildren);
	showCloseButton?: boolean;
}) => {
	const context = useContext(DialogContext);
	const appRoot = useRootStore((s) => s.appRoot);

	if (!context || !appRoot) return null;

	return createPortal(
		<DialogWrapper>
			<div
				data-slot="dialog-content"
				className={cn(
					"dialog-content relative flex max-h-full w-full animate-move-up flex-col rounded-lg border bg-background",
					"transition-[margin] duration-500 ease-in-out group-data-[state=close]:-mb-100",
					!showCloseButton && "**:data-[slot=dialog-close]:hidden",
					className,
				)}
				style={{ boxShadow: "0 -5px 10px -5px rgba(0, 0, 0, 0.15)" }}
				{...{ onClick: (e) => e.stopPropagation() }}
				{...props}
			>
				{typeof children === "function" ? children(context) : children}
			</div>
		</DialogWrapper>,
		appRoot,
	);
};
