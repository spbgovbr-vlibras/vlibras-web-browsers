import { cn } from "@/common/lib/utils";
import { usePlayer } from "@/player/use-player";
import { Button } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";
import { EmotionsIcon, SettingsIcon, SubtitleOffIcon } from "@/widget/icons";
import { SubtitleIcon } from "@/widget/icons/subtitle";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { MainAction } from "./main-action";
import { ProgressBar } from "./progress-bar";
import { SpeedOption } from "./speed-option";

export const WidgetControls = () => {
	const { open } = useScreensStore();
	const { isOpen, isTranslating } = useWidgetStore();
	const { isPlayingWelcome, showSubtitles, toggleSubtitles } = usePlayer();

	return (
		<div
			className={cn(
				"relative flex animate-move-up items-center justify-between gap-1 border-t bg-background p-2 transition-[bottom] ease-in-out",
				"[&_button]:not-hover:bg-transparent",
				!isOpen && "-bottom-20!",
			)}
		>
			{isTranslating && (
				<div className="absolute -top-8 left-1/2 grid -translate-x-1/2 animate-move-up place-content-center rounded-full border bg-background p-0.5 pr-2">
					<span className="flex items-center gap-1 font-semibold text-xs">
						<span className="loading loading-spinner loading-xs" />
						Traduzindo...
					</span>
				</div>
			)}

			<ProgressBar />

			<MainAction />

			<SpeedOption />

			<Tooltip className="text-xs" offset={8} content="Emoções" placement="top" arrow={{ position: "bottom" }}>
				<Button variant="ghost-gov" size="icon">
					<EmotionsIcon />
				</Button>
			</Tooltip>

			<Tooltip
				className="whitespace-nowrap text-xs"
				offset={8}
				align="end"
				content={showSubtitles ? "Desativar legendas" : "Ativar legendas"}
				placement="top"
				arrow={{ position: "bottom-right" }}
				disabled={isPlayingWelcome}
			>
				<Button disabled={isPlayingWelcome} onClick={() => toggleSubtitles()} variant="ghost-gov" size="icon">
					{showSubtitles ? <SubtitleIcon /> : <SubtitleOffIcon />}
				</Button>
			</Tooltip>

			<Button onClick={() => open("settings")} variant="ghost-gov" size="icon">
				<SettingsIcon />
			</Button>
		</div>
	);
};
