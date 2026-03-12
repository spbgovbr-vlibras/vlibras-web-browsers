import { useEffect } from "preact/hooks";
import { usePlayer } from "@/player/use-player";
import { usePlayerStore } from "@/player/use-player.store";
import { WidgetContent } from "./components/content";
import { DialogProvider } from "./providers/dialog";

export const WidgetApp = () => {
	const { progress, isLoaded } = usePlayerStore();
	const { playWelcome } = usePlayer();

	useEffect(() => void (isLoaded && playWelcome()), [isLoaded]);

	return (
		<div
			style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }}
			className="fixed top-1/2 right-2 z-2147483647 flex w-64 -translate-y-1/2 transform animate-move-right flex-col overflow-hidden rounded-3xl border border-foreground/20 bg-white sm:w-68"
		>
			{!isLoaded && (
				<div className="absolute inset-0 z-9999 grid place-content-center bg-background text-foreground">
					{`${progress}%`}
				</div>
			)}

			<WidgetContent />
			<DialogProvider />
		</div>
	);
};
