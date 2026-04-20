import { cn } from "@/common/lib/utils";
import { useDraggable } from "@/widget/components/draggable";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { EmotionsOption } from "./emotions-option";
import { MainAction } from "./main-action";
import { ProgressBar } from "./progress-bar";
import { SettingsOption } from "./settings-option";
import { SpeedOption } from "./speed-option";
import { SubtitlesOptions } from "./subtitles-option";

export const WidgetControls = () => {
	const isOpen = useWidgetStore((s) => s.isOpen);
	const { onPointerDown } = useDraggable();

	return (
		<div
			className={cn(
				"relative flex animate-move-up items-center justify-between gap-1 border-t bg-background px-2 py-1.5 transition-[bottom] ease-in-out",
				"[&_button]:z-1 [&_button]:not-hover:bg-transparent **:[[role=button]]:not-hover:bg-transparent",
				"-mt-13",
				!isOpen && "-bottom-20!",
			)}
		>
			<div
				{...{ onPointerDown }}
				className="absolute inset-0 z-0 not-expanded:hover:cursor-move sm:hover:cursor-move"
			/>

			<ProgressBar />

			<MainAction />
			<SpeedOption />
			<EmotionsOption />
			<SubtitlesOptions />
			<SettingsOption />
		</div>
	);
};
