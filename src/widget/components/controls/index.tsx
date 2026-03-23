import { Fragment } from "preact/jsx-runtime";
import { cn } from "@/common/lib/utils";
import { usePlayer } from "@/player/use-player";
import { Button } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";
import { PauseIcon, PlayIcon, SettingsIcon } from "@/widget/icons";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

export const WidgetControls = () => {
	const { open } = useScreensStore();
	const { play, pause, status, repeat, gloss, countGloss } = usePlayer();
	const { isOpen } = useWidgetStore();

	const progress = (countGloss.count / Math.max(countGloss.max, countGloss.count)) * 100;

	return (
		<Fragment>
			<div
				className={cn(
					"absolute inset-x-0 bottom-2 mx-auto w-fit animate-move-up gap-1 transition-[bottom] ease-in-out [&>div]:p-0.75",
					"flex items-center [&_button>svg]:size-5",
					!isOpen && "-bottom-20!",
				)}
			>
				<div
					style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)" }}
					className={cn("flex w-full items-center gap-1 rounded-lg border bg-background")}
				>
					{status === "idle" && !gloss && (
						<div className="ml-2 w-full text-center text-foreground text-sm">Aguardando texto...</div>
					)}

					{status === "paused" && (
						<Tooltip
							className="text-xs **:data-[slot=arrow-container]:left-1"
							offset={2}
							content="Reproduzir"
							placement="top"
							align="start"
							arrow={{ position: "bottom-left" }}
						>
							<Button onClick={() => play()} variant="ghost-gov" size="icon" className="text-primary-foreground">
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
							<Button onClick={() => repeat()} variant="ghost-gov" size="icon">
								R
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

					<Button onClick={() => open("settings")} variant="ghost-gov" size="icon">
						<SettingsIcon />
					</Button>
				</div>
			</div>

			<div
				role="progressbar"
				aria-valuenow={progress}
				className="absolute inset-x-0 bottom-0 mx-auto h-1.5 rounded-full bg-primary transition-[width]"
				style={{ width: `${progress}%` }}
			/>
		</Fragment>
	);
};
