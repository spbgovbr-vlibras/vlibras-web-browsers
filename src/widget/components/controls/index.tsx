import { cn } from "@/common/lib/utils";
import { usePlayer } from "@/player/use-player";
import { Button } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";
import { PauseIcon, PlayIcon } from "@/widget/icons";
import { SubtitleIcon } from "@/widget/icons/subtitle";

export const WidgetControls = () => {
	const { play, pause, toggleSubtitles, showSubtitles, status, repeat, gloss } = usePlayer();

	return (
		<div
			className={cn(
				"absolute inset-2 top-auto flex animate-move-up items-center justify-between gap-1 transition-[bottom] ease-in-out [&>div]:h-11 [&>div]:p-1",
				"[&_button>svg]:size-5 [&_button>svg]:text-primary-foreground [&_button]:rounded-full [&_button]:hover:bg-primary",
				!open && "-bottom-20!",
			)}
		>
			<div
				// style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }}
				className={cn("flex w-full items-center gap-1 rounded-full bg-background")}
			>
				{status === "idle" && !gloss && <div className="w-full text-center text-sm">Aguardando texto...</div>}

				{status === "paused" && (
					<Tooltip
						variant="primary"
						className="text-xs **:data-[slot=arrow-container]:left-1"
						offset={2}
						content="Reproduzir"
						placement="top"
						align="start"
						arrow={{ position: "bottom-left" }}
					>
						<Button
							onClick={() => play()}
							variant="secondary"
							size="icon"
							className="rounded-full text-primary-foreground"
						>
							<PlayIcon />
						</Button>
					</Tooltip>
				)}

				{status === "idle" && Boolean(gloss) && (
					<Tooltip
						variant="primary"
						className="text-xs **:data-[slot=arrow-container]:left-1"
						offset={2}
						content="Repetir"
						placement="top"
						align="start"
						arrow={{ position: "bottom-left" }}
					>
						<Button
							onClick={() => repeat()}
							variant="secondary"
							size="icon"
							className="rounded-full text-primary-foreground"
						>
							r
						</Button>
					</Tooltip>
				)}

				{status === "playing" && (
					<Tooltip
						variant="primary"
						className="text-xs **:data-[slot=arrow-container]:left-1"
						offset={2}
						content="Pausar"
						placement="top"
						align="start"
						arrow={{ position: "bottom-left" }}
					>
						<Button onClick={pause} variant="secondary" size="icon">
							<PauseIcon />
						</Button>
					</Tooltip>
				)}
			</div>

			<div className="flex items-center gap-1 rounded-full bg-background">
				<Button
					onClick={() => toggleSubtitles()}
					variant="ghost"
					size="icon"
					className={cn("ml-auto bg-muted", showSubtitles ? "bg-primary!" : "hover:bg-accent!")}
				>
					<SubtitleIcon />
				</Button>
			</div>
		</div>
	);
};
