import { usePick } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { useDraggable } from "../draggable";
import { EmotionsOption } from "./emotions-option";
import { MainAction } from "./main-action";
import { ProgressBar } from "./progress-bar";
import { SettingsOption } from "./settings-option";
import { SpeedOption } from "./speed-option";
import { SubtitlesOptions } from "./subtitles-option";
import { TranslatingBadge } from "./translating-badge";

export const WidgetControls = () => {
	const { onPointerDown } = useDraggable();
	const { isOpen, isTranslating } = useWidgetStore(usePick("isOpen", "isTranslating"));

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

			{isTranslating && <TranslatingBadge />}

			<ProgressBar />

			<MainAction />
			<SpeedOption />
			<EmotionsOption />
			<SubtitlesOptions />
			<SettingsOption />
		</div>
	);
};
