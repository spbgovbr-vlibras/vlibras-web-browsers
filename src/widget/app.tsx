import type { RefObject } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { usePick } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { pause } from "@/player/actions";
import { WidgetAppProviders } from "@/widget/providers/widget/app";
import { WidgetWrapperProviders } from "@/widget/providers/widget/wrapper";
import { appVariants } from "./app-variants";
import { WidgetContent } from "./components/content";
import { Draggable, DragHint } from "./components/draggable";
import { AppBackground } from "./components/ui/app-background";
import { AppOverlay } from "./components/ui/app-overlay";
import { useWidgetPosition } from "./hooks/use-widget-position";
import { rootStore } from "./stores/use-root.store";
import { useScreensStore } from "./stores/use-screens.store";
import { useWidgetStore } from "./stores/use-widget.store";
import { focusAccessButton, trapTabFocus } from "./utils/focus";

export const WidgetApp = () => {
	const screen = useScreensStore((s) => s.screen);
	const position = useWidgetPosition();

	const { isOpen, isExpanded } = useWidgetStore(usePick("isOpen", "isExpanded"));
	const setOpen = useWidgetStore((s) => s.setOpen);

	return (
		<Draggable<HTMLElement>>
			{({ ref: draggableRef, hasMoved, pos, isDragging, reset }) => {
				const panelRef = useRef<HTMLElement | null>(null);
				const prevOpenRef = useRef(isOpen);

				useEffect(() => void (!isOpen && reset()), [isOpen]);

				useEffect(() => {
					const wasOpen = prevOpenRef.current;
					prevOpenRef.current = isOpen;

					if (isOpen && !wasOpen) {
						requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true }));
					} else if (!isOpen && wasOpen) {
						focusAccessButton();
					}
				}, [isOpen]);

				return (
					<div
						id="vlibras-app"
						inert={!isOpen}
						{...{
							onKeyDown: (e: KeyboardEvent) => {
								if (e.key !== "Escape") return;
								setOpen(false);
								pause();
							},
						}}
						style={{ transform: hasMoved && isOpen ? `translate3d(${pos.x}px, ${pos.y}px, 0)` : undefined }}
						className={cn(
							"group/widget",
							appVariants({
								isDragging,
								isOpen,
								position,
								isExpanded,
								hasMoved,
							}),
							__IS_EXTENSION__ && "translate-none! inset-0! transition-none!",
						)}
					>
						<section
							id="vlibras-app-panel"
							tabIndex={-1}
							aria-label="Painel VLibras"
							onKeyDown={(e) => trapTabFocus(panelRef.current, e)}
							ref={(ref) => {
								panelRef.current = ref;
								if (ref) rootStore.set({ appRoot: ref as unknown as HTMLDivElement });
								if (typeof draggableRef === "function")
									(draggableRef as unknown as (ref: HTMLElement | null) => void)(ref);
								else if (draggableRef && "current" in draggableRef) {
									(draggableRef as RefObject<HTMLElement | null>).current = ref;
								}
							}}
							className={cn(
								"widget-radius relative z-2147483647 h-fit expanded:w-full w-(--widget-width) overflow-hidden shadow-lg expanded:max-sm:rounded-none!",
								"group-has-[[data-slot=drag-handle]:focus-visible]/widget:outline-4 group-has-[[data-slot=drag-handle]:focus-visible]/widget:outline-primary",
								screen !== "main" && "outline-2 outline-border outline-solid",
								__IS_EXTENSION__ && "h-screen w-screen shrink-0 rounded-none! [--player-height:calc(100dvh-52px)]",
							)}
						>
							<WidgetContent />
							<WidgetAppProviders />

							<AppBackground />
							<AppOverlay />
						</section>

						<DragHint />
						<WidgetWrapperProviders />
					</div>
				);
			}}
		</Draggable>
	);
};
