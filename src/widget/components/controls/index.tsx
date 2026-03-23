import { Fragment } from "preact/jsx-runtime";
import { cn } from "@/common/lib/utils";
import { usePlayer } from "@/player/use-player";
import { Button } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";
import {
	EmotionsIcon,
	GovBRIcon,
	PauseIcon,
	PlayIcon,
	ReplayIcon,
	SettingsIcon,
	SubtitleOffIcon,
} from "@/widget/icons";
import { SubtitleIcon } from "@/widget/icons/subtitle";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

export const WidgetControls = () => {
	const { open } = useScreensStore();
	const { play, pause, status, repeat, gloss, countGloss, showSubtitles, toggleSubtitles } = usePlayer();
	const { isOpen } = useWidgetStore();

	const progress = (countGloss.count / Math.max(countGloss.max, countGloss.count)) * 100;

	return (
		<Fragment>
			<div
				className={cn(
					"absolute inset-2 xs:inset-4 top-auto! mx-auto flex animate-move-up items-center gap-1 transition-[bottom] ease-in-out",
					"[&>div]:rounded-full [&>div]:p-1 [&_button]:animate-move-down [&_button]:rounded-full",
					!isOpen && "-bottom-20!",
				)}
			>
				<div
					// style={{ boxShadow: "0 0 15px -2px rgba(19, 81, 180, 0.3)" }}
					style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)" }}
					className={cn("flex w-full items-center gap-1 border bg-background")}
				>
					{status === "paused" && (
						<Tooltip
							className="text-xs **:data-[slot=arrow-container]:left-1"
							offset={2}
							variant="primary"
							content="Reproduzir"
							placement="top"
							align="start"
							arrow={{ position: "bottom-left" }}
						>
							<Button onClick={() => play()} variant="default" size="icon">
								<PlayIcon />
							</Button>
						</Tooltip>
					)}

					{status === "idle" && Boolean(gloss) && (
						<Tooltip
							className="text-xs **:data-[slot=arrow-container]:left-1"
							offset={2}
							content="Repetir"
							placement="top"
							align="start"
							arrow={{ position: "bottom-left" }}
						>
							<Button onClick={() => repeat()} variant="ghost-gov" size="icon" className="group">
								<ReplayIcon />
							</Button>
						</Tooltip>
					)}

					{status === "playing" && (
						<Tooltip
							className="text-xs **:data-[slot=arrow-container]:left-1"
							offset={2}
							content="Pausar"
							placement="top"
							align="start"
							arrow={{ position: "bottom-left" }}
						>
							<Button onClick={pause} variant="ghost-gov" size="icon">
								<PauseIcon />
							</Button>
						</Tooltip>
					)}

					<span className="mx-auto px-1">
						<GovBRIcon className="h-4 w-fit" />
					</span>

					<Tooltip className="text-xs" offset={2} content="Emoções" placement="top" arrow={{ position: "bottom" }}>
						<Button variant="ghost-gov" size="icon">
							<EmotionsIcon />
						</Button>
					</Tooltip>

					<Tooltip
						className="whitespace-nowrap text-xs"
						offset={2}
						align="end"
						content={showSubtitles ? "Desativar legendas" : "Ativar legendas"}
						placement="top"
						arrow={{ position: "bottom-right" }}
					>
						<Button onClick={() => toggleSubtitles()} variant="ghost-gov" size="icon">
							{showSubtitles ? <SubtitleIcon /> : <SubtitleOffIcon />}
						</Button>
					</Tooltip>

					<Button onClick={() => open("settings")} variant="ghost-gov" size="icon">
						<SettingsIcon />
					</Button>
				</div>
			</div>

			<div className="absolute inset-0 top-auto h-1.5 w-full rounded-full">
				<div
					role="progressbar"
					aria-valuenow={progress}
					className="h-full rounded-full bg-primary transition-[width]"
					style={{ width: `${progress}%` }}
				/>
			</div>
		</Fragment>
	);
};
