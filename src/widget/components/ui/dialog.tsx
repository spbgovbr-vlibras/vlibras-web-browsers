import { type ComponentChildren, type ComponentProps, createContext } from "preact";
import { createPortal } from "preact/compat";
import { useContext, useEffect, useState } from "preact/hooks";
import { cn } from "@/common/lib/utils";
import { XIcon } from "@/widget/icons";
import { useRootStore } from "@/widget/stores/use-root.store";
import { Button } from "./button";

type DialogContextProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

const DialogContext = createContext<DialogContextProps | null>(null);

const DialogOverlay = ({ children }: { children: ComponentChildren }) => {
	const context = useContext(DialogContext);
	const appContent = useRootStore((s) => s.appContent);

	const [closed, setClosed] = useState(true);

	useEffect(() => {
		if (!context || !appContent) return;

		if (context.open) setClosed(false);
		else setTimeout(() => setClosed(true), 150);

		if (appContent) appContent.inert = context.open;
	}, [context?.open]);

	if (!context || closed) return null;

	return (
		<div
			data-slot="dialog-overlay"
			data-state={context.open ? "open" : "close"}
			className={cn("group absolute inset-0 z-99999 flex items-end overflow-hidden bg-black/30")}
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
};

export const Dialog = ({ open: _open, onOpenChange: _onOpenChange, children }: DialogProps) => {
	const [isOpen, setOpen] = useState(false);

	return (
		<DialogContext.Provider
			value={{
				open: _open ?? isOpen,
				onOpenChange: _onOpenChange ?? setOpen,
			}}
		>
			{children}
		</DialogContext.Provider>
	);
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
	return (
		<div data-slot="dialog-header" className={cn("flex items-center gap-2 border-b px-4 py-3", className)} {...props}>
			{children}
		</div>
	);
};

export const DialogTitle = ({ children, className, ...props }: ComponentProps<"h3">) => {
	return (
		<h3
			className={cn("flex items-center gap-2 font-semibold mobile:text-sm text-base leading-normal", className)}
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
		<DialogOverlay>
			<div
				className={cn(
					"dialog-content relative flex max-h-full w-full animate-move-up flex-col overflow-hidden rounded-lg border bg-background",
					"transition-[margin] duration-500 group-data-[state=close]:-mb-100",
					className,
				)}
				style={{ boxShadow: "0 -5px 10px -5px rgba(0, 0, 0, 0.15)" }}
				{...{ onClick: (e) => e.stopPropagation() }}
				{...props}
			>
				<Button
					onClick={() => context.onOpenChange(false)}
					size="icon-xs"
					className="absolute top-2 right-2"
					variant="ghost"
				>
					<XIcon />
				</Button>

				{typeof children === "function" ? children(context) : children}
			</div>
		</DialogOverlay>,
		appRoot,
	);
};
