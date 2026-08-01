import { cn } from "@/common/lib/utils";
import { useDraggable } from "@/widget/components/draggable";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { useGuideStore } from "../guide/store";
import { AppOverlay } from "../ui/app-overlay";
import { EmotionsOption } from "./emotions-option";
import { MainAction } from "./main-action";
import { ProgressBar } from "./progress-bar";
import { SettingsOption } from "./settings-option";
import { SpeedOption } from "./speed-option";
import { SubtitlesOptions } from "./subtitles-option";

export const WidgetControls = () => {
	const isOpen = useWidgetStore((s) => s.isOpen);
	const isGuideOpen = useGuideStore((s) => s.open);

	const { onPointerDown } = useDraggable();

	return (
		<div
			className={cn(
				!isOpen && "-bottom-20!",
				"relative z-50 animate-move-up border-t bg-background px-2 py-1.5 transition-[bottom] ease-in-out",
				"[&_button]:z-1 [&_button]:not-hover:bg-transparent [&_button]:dark:text-secondary-foreground **:[[role=button]]:not-hover:bg-transparent **:[[role=button]]:dark:text-secondary-foreground",
				"-mt-13 **:data-[highlight=true]:animate-highlight-primary",
			)}
		>
			<div
				{...{ onPointerDown }}
				className={cn(
					"absolute inset-0 z-0 touch-none",
					!__IS_EXTENSION__ && "not-expanded:hover:cursor-move sm:hover:cursor-move",
				)}
			/>
			<ProgressBar />

			<div
				inert={isGuideOpen}
				className={cn(
					"grid w-full grid-cols-5 items-center gap-1",
					"[&>div]:col-span-2 [&>div]:grid [&>div]:grid-cols-subgrid [&>div]:justify-items-center [&>div]:rounded",
				)}
			>
				<div id="main-action-speed-options">
					<MainAction />
					<SpeedOption />
				</div>

				<div id="emotions-subtitles-options">
					<EmotionsOption />
					<SubtitlesOptions />
				</div>

				<div id="settings-option" className="col-span-1!">
					<SettingsOption />
				</div>
			</div>

			<AppOverlay className="z-50" />
		</div>
	);
};
