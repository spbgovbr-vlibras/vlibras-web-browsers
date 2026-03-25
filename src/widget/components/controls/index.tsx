import { useMemo } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { cn } from "@/common/lib/utils";
import { usePlayer } from "@/player/use-player";
import { Button, buttonVariants } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";
import {
	EmotionsIcon,
	PauseIcon,
	PlayIcon,
	ReplayIcon,
	SettingsIcon,
	SubtitleOffIcon,
	WaitingIcon,
} from "@/widget/icons";
import { SubtitleIcon } from "@/widget/icons/subtitle";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

export const WidgetControls = () => {
	const { open } = useScreensStore();
	const { isOpen, isTranslating } = useWidgetStore();
	const { play, pause, status, repeat, isPlayingWelcome, gloss, countGloss, showSubtitles, toggleSubtitles } =
		usePlayer();

	const progress = useMemo(() => {
		if (countGloss.max === 0) return 0;
		return (countGloss.count / Math.max(countGloss.max, countGloss.count)) * 100;
	}, [countGloss]);

	return (
		<Fragment>
			<div
				className={cn(
					"absolute inset-4 top-auto! mx-auto flex animate-move-up items-center gap-1 transition-[bottom] ease-in-out",
					"[&>div]:rounded-full [&>div]:p-1 [&_button]:animate-move-down [&_button]:rounded-full",
					!isOpen && "-bottom-20!",
				)}
			>
				<div
					style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)" }}
					className={cn("relative mx-auto flex items-center justify-center gap-1 border bg-background")}
				>
					{status === "idle" && !gloss && (
						<div className={cn(buttonVariants({ size: "icon", variant: "ghost-gov" }), "w-16 rounded-full")}>
							<WaitingIcon className="size-5 opacity-50" />
						</div>
					)}

					{isTranslating && (
						<div className="absolute -top-8 grid animate-move-up place-content-center rounded-full border bg-background p-0.5 pr-2">
							<span className="flex items-center gap-1 font-semibold text-xs">
								<span className="loading loading-spinner loading-xs" />
								Traduzindo...
							</span>
						</div>
					)}

					{status === "paused" && (
						<Tooltip
							className="text-xs"
							offset={2}
							variant="primary"
							content="Reproduzir"
							disabled={!gloss}
							placement="top"
							arrow={{ position: "bottom" }}
						>
							<Button disabled={!gloss} className="w-16" onClick={() => play()} variant="default" size="icon">
								<PlayIcon />
							</Button>
						</Tooltip>
					)}

					{status === "idle" && Boolean(gloss) && (
						<Tooltip className="text-xs" offset={2} content="Repetir" placement="top" arrow={{ position: "bottom" }}>
							<Button onClick={() => repeat()} variant="ghost-gov" size="icon" className="group w-16">
								<ReplayIcon />
							</Button>
						</Tooltip>
					)}

					{status === "playing" && (
						<Tooltip className="text-xs" offset={2} content="Pausar" placement="top" arrow={{ position: "bottom" }}>
							<Button className="w-16" onClick={pause} variant="ghost-gov" size="icon">
								<PauseIcon />
							</Button>
						</Tooltip>
					)}

					<div className="mx-2 -my-4 h-6 w-0.5 rounded-full bg-border" />

					<div className="ml-auto">
						<Tooltip className="text-xs" offset={2} content="Emoções" placement="top" arrow={{ position: "bottom" }}>
							<Button variant="ghost-gov" size="icon">
								<EmotionsIcon />
							</Button>
						</Tooltip>
					</div>

					<Tooltip
						className="whitespace-nowrap text-xs"
						offset={2}
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
