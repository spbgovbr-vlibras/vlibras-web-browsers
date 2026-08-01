import {
	type ComponentProps,
	cloneElement,
	createContext,
	isValidElement,
	type TargetedFocusEvent,
	type TargetedKeyboardEvent,
	type VNode,
} from "preact";
import { useContext, useId, useRef } from "preact/hooks";
import { cn } from "@/common/lib/utils";
import { overlayStore, useOverlayStore } from "@/widget/stores/use-overlay.store";

interface DropdownContextValue {
	open: boolean;
	setOpen: (next: boolean | ((prev: boolean) => boolean)) => void;
	triggerRef: { current: HTMLElement | null };
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

const useDropdownContext = () => {
	const context = useContext(DropdownContext);
	if (!context) throw new Error("Dropdown.Trigger e Dropdown.Content devem ser usados dentro de <Dropdown>");
	return context;
};

export const Dropdown = ({
	className,
	children,
	showOverlay = true,
	open: _open,
	...props
}: ComponentProps<"div"> & {
	showOverlay?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) => {
	const id = useId();
	const internalOpen = useOverlayStore((s) => s.openId === id);
	const open = _open ?? internalOpen;
	const triggerRef = useRef<HTMLElement>(null);

	const setOpen = (next: boolean | ((prev: boolean) => boolean)) => {
		const shouldOpen = typeof next === "function" ? next(overlayStore.get().openId === id) : next;

		if (shouldOpen) overlayStore.set({ openId: id, showOverlay, onClose: () => triggerRef.current?.focus() });
		else overlayStore.close();
	};

	const onBlurCapture = (event: TargetedFocusEvent<HTMLDivElement>) => {
		if (!open) return;

		const next = event.relatedTarget as Node | null;
		if (!next || !event.currentTarget.contains(next)) overlayStore.set({ openId: null, onClose: undefined });
	};

	const onKeyDown = (event: TargetedKeyboardEvent<HTMLDivElement>) => {
		if (open && event.key === "Escape") {
			event.stopPropagation();
			overlayStore.close();
		}
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: só repassa blur/Escape dos filhos focáveis, que já têm a própria semântica
		<div
			onBlurCapture={onBlurCapture}
			onKeyDown={onKeyDown}
			className={cn(
				"dropdown focus-within:**:data-[slot=tooltip-content]:hidden",
				open ? "dropdown-open" : "dropdown-close",
				className,
			)}
			{...props}
		>
			<DropdownContext.Provider value={{ open, setOpen, triggerRef }}>{children}</DropdownContext.Provider>
		</div>
	);
};

interface DropdownTriggerProps {
	children: VNode<Record<string, unknown>>;
	openOnFocus?: boolean;
}

export const DropdownTrigger = ({ children, openOnFocus = false }: DropdownTriggerProps) => {
	const { setOpen, triggerRef } = useDropdownContext();

	const wasFocusedRef = useRef(false);

	if (!isValidElement(children)) return children;

	return cloneElement(children, {
		ref: triggerRef,
		onMouseDown: (event: MouseEvent) => {
			(children.props.onMouseDown as ((event: MouseEvent) => void) | undefined)?.(event);

			const root = triggerRef.current?.getRootNode() as Document | ShadowRoot | undefined;
			wasFocusedRef.current = !!root && root.activeElement === triggerRef.current;
		},
		onClick: (event: MouseEvent) => {
			(children.props.onClick as ((event: MouseEvent) => void) | undefined)?.(event);
			if (openOnFocus && !wasFocusedRef.current) return;
			setOpen((prev) => !prev);
		},
		onFocus: (event: TargetedFocusEvent<HTMLElement>) => {
			(children.props.onFocus as ((event: TargetedFocusEvent<HTMLElement>) => void) | undefined)?.(event);
			if (openOnFocus) setOpen(true);
		},
	});
};

export const DropdownContent = ({ className, ...props }: ComponentProps<"div">) => {
	useDropdownContext();

	return <div tabIndex={-1} className={cn("dropdown-content widget-radius", className)} {...props} />;
};
