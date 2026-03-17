import { useEffect } from "preact/hooks";
import { cn } from "@/common/lib/utils";
import { usePlayer } from "@/player/use-player";
import { usePlayerStore } from "@/player/use-player.store";
import { getWidgetPositionClasses } from "./app.styles";
import { WidgetAppProviders } from "./app-providers";
import { WidgetContent } from "./components/content";
import { useWidgetStore } from "./stores/use-widget.store";

export const WidgetApp = () => {
	const { progress, isLoaded } = usePlayerStore();
	const { isOpenWidget, position } = useWidgetStore();
	const { playWelcome } = usePlayer();

	useEffect(() => void (isLoaded && playWelcome()), [isLoaded]);

	return (
		<div
			style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }}
			className={cn(
				"fixed z-2147483647 flex h-fit w-(--widget-width) transform flex-col overflow-hidden rounded-3xl border border-foreground/20 bg-white transition-all duration-500",
				getWidgetPositionClasses(position, isOpenWidget),
			)}
		>
			{!isLoaded && (
				<div className="absolute inset-0 z-9999 grid place-content-center bg-background text-foreground">
					{`${progress}%`}
				</div>
			)}

			<WidgetContent />
			<WidgetAppProviders />
		</div>
	);
};
