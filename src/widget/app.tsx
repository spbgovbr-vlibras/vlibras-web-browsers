import { useEffect } from "preact/hooks";
import { useShallow } from "zustand/shallow";
import { cn } from "@/common/lib/utils";
import { pickKeys } from "@/common/utils";
import { usePlayer } from "@/player/use-player";
import { getWidgetPositionClasses } from "./app.styles";
import { WidgetContent } from "./components/content";
import { Draggable } from "./components/draggable";
import { UnityLoading } from "./components/unity-loading";
import { WidgetProviders } from "./providers/app";
import { useWidgetStore } from "./stores/use-widget.store";

export const WidgetApp = () => {
	const { isOpen, position } = useWidgetStore(useShallow((s) => pickKeys(s, "isOpen", "position")));
	const { progress, isLoaded } = usePlayer();

	return (
		<Draggable<HTMLDivElement>>
			{({ ref, hasMoved, pos, isDragging, reset }) => {
				useEffect(() => void (!isOpen && reset()), [isOpen]);

				return (
					<div
						ref={ref}
						style={{
							boxShadow: "0 0 15px -5px rgba(0, 0, 0, 0.15)",
							transform: hasMoved && isOpen ? `translate3d(${pos.x}px, ${pos.y}px, 0)` : undefined,
							touchAction: "none",
						}}
						className={cn(
							"fixed z-2147483647 flex h-fit w-(--widget-width) flex-col overflow-hidden rounded-xl",
							"border bg-background dark:border-[#eee]",
							!isDragging && "transition-all",
							(!hasMoved || !isOpen) && getWidgetPositionClasses(position, isOpen),
							hasMoved && isOpen && "top-0 left-0",
						)}
					>
						{!isLoaded && <UnityLoading progress={progress} />}

						<WidgetContent />
						<WidgetProviders />
					</div>
				);
			}}
		</Draggable>
	);
};
