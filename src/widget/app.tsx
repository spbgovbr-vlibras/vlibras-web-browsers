import type { RefObject } from "preact";
import { useEffect } from "preact/hooks";
import { usePick } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { getWidgetPositionClasses } from "./app.styles";
import { WidgetContent } from "./components/content";
import { Draggable } from "./components/draggable";
import { AppBackground } from "./components/ui/app-background";
import { UnityLoading } from "./components/unity-loading";
import { WidgetProviders } from "./providers/app";
import { useRootStore } from "./stores/use-root.store";
import { useWidgetStore } from "./stores/use-widget.store";

export const WidgetApp = () => {
	const { isOpen, position } = useWidgetStore(usePick("isOpen", "position"));

	return (
		<Draggable<HTMLDivElement>>
			{({ ref: draggableRef, hasMoved, pos, isDragging, reset }) => {
				useEffect(() => void (!isOpen && reset()), [isOpen]);

				return (
					<div
						inert={!isOpen}
						id="vlibras-app"
						ref={(ref) => {
							if (ref) useRootStore.setState({ appRoot: ref });
							if (typeof draggableRef === "function") draggableRef(ref);
							else if (draggableRef && "current" in draggableRef) {
								(draggableRef as RefObject<HTMLDivElement | null>).current = ref;
							}
						}}
						style={{
							boxShadow: "0 0 15px -5px rgba(0, 0, 0, 0.15)",
							transform: hasMoved && isOpen ? `translate3d(${pos.x}px, ${pos.y}px, 0)` : undefined,
						}}
						className={cn(
							"fixed z-2147483647 flex h-fit w-(--widget-width) flex-col overflow-hidden rounded-xl bg-transparent!",
							"border dark:border-[#eee]",
							!isDragging && "transition-all",
							(!hasMoved || !isOpen) && getWidgetPositionClasses(position, isOpen),
							hasMoved && isOpen && "top-0 left-0",
						)}
					>
						<UnityLoading />

						<WidgetContent />
						<WidgetProviders />

						<AppBackground />
					</div>
				);
			}}
		</Draggable>
	);
};
