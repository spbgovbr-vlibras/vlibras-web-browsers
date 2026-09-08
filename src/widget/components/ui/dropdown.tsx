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
import { rootStore } from "@/widget/stores/use-root.store";

const MENU_ITEM_SELECTOR = '[role^="menuitem"]';

const getMenuItems = (container: HTMLElement) =>
	Array.from(container.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR)).filter(
		(el) => el.closest("[inert]") === null,
	);

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
		if (!open) return;

		if (event.key === "Escape") {
			event.stopPropagation();
			overlayStore.close();
			return;
		}

		if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Home" && event.key !== "End") return;

		const items = getMenuItems(event.currentTarget);
		if (!items.length) return;

		event.preventDefault();

		const { shadowRoot } = rootStore.get();
		const active = (shadowRoot?.activeElement ?? document.activeElement) as HTMLElement | null;
		const currentIndex = active ? items.indexOf(active) : -1;

		let nextIndex = currentIndex;
		if (event.key === "ArrowDown") nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
		else if (event.key === "ArrowUp") nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
		else if (event.key === "Home") nextIndex = 0;
		else if (event.key === "End") nextIndex = items.length - 1;

		items[nextIndex]?.focus();
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: só repassa blur/Escape/navegação por setas dos filhos focáveis, que já têm a própria semântica
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
	children: VNode<ComponentProps<"button">>;
	openOnFocus?: boolean;
	"aria-describedby"?: string;
}

export const DropdownTrigger = ({
	children,
	openOnFocus = false,
	"aria-describedby": describedBy,
}: DropdownTriggerProps) => {
	const { open, setOpen, triggerRef } = useDropdownContext();

	const wasFocusedRef = useRef(false);

	if (!isValidElement(children)) return children;

	return cloneElement(children, {
		ref: triggerRef,
		"aria-expanded": open,
		"aria-haspopup": "menu",
		"aria-describedby": describedBy,
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

	return <div tabIndex={-1} role="menu" className={cn("dropdown-content widget-radius", className)} {...props} />;
};
