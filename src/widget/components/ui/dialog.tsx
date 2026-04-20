import { type ComponentChildren, type ComponentProps, createContext } from "preact";
import { createPortal } from "preact/compat";
import { useContext, useEffect, useState } from "preact/hooks";
import { useMobile, usePick } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { randomStr } from "@/common/utils";
import { $$ } from "@/common/utils/dom";
import { usePlayer } from "@/player/use-player";
import { playerStore, usePlayerStore } from "@/player/use-player.store";
import { XIcon } from "@/widget/icons";
import { useRootStore } from "@/widget/stores/use-root.store";
import { widgetStore } from "@/widget/stores/use-widget.store";
import { Button } from "./button";

type DialogContextProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	nested?: boolean;
};

const DialogContext = createContext<DialogContextProps | null>(null);

const DialogWrapper = ({ children }: { children: ComponentChildren }) => {
	const id = randomStr();
	const context = useContext(DialogContext);
	const isPlaying = usePlayerStore((s) => s.status === "playing");

	const { appContent, appRoot } = useRootStore(usePick("appRoot", "appContent"));
	const [closed, setClosed] = useState(true);

	useEffect(() => void (isPlaying && context?.onOpenChange(false)), [isPlaying]);
	useEffect(() => {
		if (!context || !appContent) return;

		if (context.open) setClosed(false);
		else setTimeout(() => setClosed(true), 150);

		if (appContent && !context.nested) {
			appContent.inert = context.open;
			const otherDialogs = $$(`[data-slot='dialog-wrapper']:not([id='dialog-${id}'])`, appRoot);
			otherDialogs.forEach((dialog) => (dialog.inert = context.open));
		}
	}, [context?.open]);

	if (!context || closed) return null;

	return (
		<div
			id={`dialog-${id}`}
			data-slot="dialog-wrapper"
			data-state={context.open ? "open" : "close"}
			className={cn("group absolute inset-0 z-99999 flex items-end bg-black/30", context.nested && "bg-transparent!")}
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
};

export const Dialog = ({ nested = false, open: _open, onOpenChange: _onOpenChange, children }: DialogProps) => {
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

	return <DialogContext.Provider value={{ open, onOpenChange, nested }}>{children}</DialogContext.Provider>;
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
			className={cn("flex items-center gap-2 border-b p-2.5 mobile:py-2 pl-4", className)}
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

export const DialogTitle = ({ children, className, ...props }: ComponentProps<"h3">) => {
	return (
		<h3
			data-slot="dialog-title"
			className={cn(
				"break-anywhere -mt-px mr-auto gap-2 font-semibold mobile:text-sm text-base leading-normal",
				className,
			)}
			{...props}
		>
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
