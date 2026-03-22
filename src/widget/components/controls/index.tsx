import { cn } from "@/common/lib/utils";
import { usePlayer } from "@/player/use-player";
import { Button } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";
import { PauseIcon, PlayIcon, SettingsIcon } from "@/widget/icons";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

export const WidgetControls = () => {
	const { open } = useScreensStore();
	const { play, pause, status, repeat, gloss } = usePlayer();
	const { isOpen } = useWidgetStore();

	return (
		<div
			className={cn(
				"absolute inset-2 top-auto flex animate-move-up items-center justify-between gap-1 transition-[bottom] ease-in-out [&>div]:h-11.5 [&>div]:p-1",
				"[&_button>svg]:size-5 [&_button]:rounded-full [&_button]:text-primary",
				!isOpen && "-bottom-20!",
			)}
		>
			<div
				style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)" }}
				className={cn("flex w-full items-center gap-1 rounded-full border bg-background")}
			>
				{status === "idle" && !gloss && (
					<div className="w-full text-center text-foreground text-sm">Aguardando texto...</div>
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
						<Button onClick={() => play()} variant="ghost" size="icon" className="rounded-full text-primary-foreground">
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
						<Button onClick={() => repeat()} variant="ghost" size="icon">
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
						<Button onClick={pause} variant="ghost" size="icon">
							<PauseIcon />
						</Button>
					</Tooltip>
				)}
			</div>

			<div
				style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)" }}
				className="flex items-center gap-1 rounded-full border bg-background"
			>
				<Button onClick={() => open("settings")} variant="ghost" size="icon">
					<SettingsIcon className="text-foreground" />
				</Button>
			</div>
		</div>
	);
};
