import { useEffect } from "preact/hooks";
import { cn } from "@/common/lib/utils";
import { usePlayerStore } from "@/player/use-player.store";
import { getWidgetPositionClasses } from "./app.styles";
import { WidgetContent } from "./components/content";
import { Draggable } from "./components/draggable";
import { UnityLoading } from "./components/unity-loading";
import { WidgetProviders } from "./providers/app";
import { useWidgetStore } from "./stores/use-widget.store";

export const WidgetApp = () => {
	const { progress, isLoaded } = usePlayerStore();
	const { isOpen, position } = useWidgetStore();

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
							"fixed z-2147483647 flex h-fit w-(--widget-width) flex-col overflow-hidden rounded-[20px] border border-foreground/20 bg-background bg-white",
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
