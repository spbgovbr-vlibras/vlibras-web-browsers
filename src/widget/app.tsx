import type { RefObject } from "preact";
import { useEffect } from "preact/hooks";
import { usePick } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { WidgetAppProviders } from "@/widget/providers/widget/app";
import { WidgetWrapperProviders } from "@/widget/providers/widget/wrapper";
import { appVariants } from "./app-variants";
import { WidgetContent } from "./components/content";
import { Draggable } from "./components/draggable";
import { AppBackground } from "./components/ui/app-background";
import { rootStore } from "./stores/use-root.store";
import { useScreensStore } from "./stores/use-screens.store";
import { useWidgetStore } from "./stores/use-widget.store";

export const WidgetApp = () => {
	const screen = useScreensStore((s) => s.screen);
	const { isOpen, position, isExpanded } = useWidgetStore(usePick("isOpen", "position", "isExpanded"));

	return (
		<Draggable<HTMLDivElement>>
			{({ ref: draggableRef, hasMoved, pos, isDragging, reset }) => {
				useEffect(() => void (!isOpen && reset()), [isOpen]);

				return (
					<div
						id="vlibras-app"
						inert={!isOpen}
						style={{ transform: hasMoved && isOpen ? `translate3d(${pos.x}px, ${pos.y}px, 0)` : undefined }}
						className={cn(
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
						<div
							ref={(ref) => {
								if (ref) rootStore.set({ appRoot: ref });
								if (typeof draggableRef === "function") draggableRef(ref);
								else if (draggableRef && "current" in draggableRef) {
									(draggableRef as RefObject<HTMLDivElement | null>).current = ref;
								}
							}}
							className={cn(
								"widget-radius relative z-2147483647 h-fit expanded:w-full w-(--widget-width) overflow-hidden shadow-lg expanded:max-sm:rounded-none!",
								screen !== "main" && "outline-2 outline-border outline-solid",
								__IS_EXTENSION__ && "h-screen w-screen shrink-0 rounded-none! [--player-height:calc(100dvh-52px)]",
							)}
						>
							<WidgetContent />
							<WidgetAppProviders />

							<AppBackground />
						</div>

						<WidgetWrapperProviders />
					</div>
				);
			}}
		</Draggable>
	);
};
