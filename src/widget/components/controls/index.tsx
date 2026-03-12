import { cn } from "@/common/lib/utils";
import { usePlayer } from "@/player/use-player";
import { Button } from "@/widget/components/ui/button";
import { PauseIcon, PlayIcon } from "@/widget/icons";
import { SubtitleIcon } from "@/widget/icons/subtitle";

export const WidgetControls = () => {
	const { play, pause, toggleAvatar, status } = usePlayer();

	console.log(status);

	return (
		<div
			// style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }}
			className={cn(
				"absolute inset-2 top-auto flex animate-move-up items-center gap-1 rounded-full border bg-background p-1 transition-[bottom] ease-in-out",
				"[&_button>svg]:size-5 [&_button>svg]:text-primary-foreground [&_button]:rounded-full [&_button]:hover:bg-primary",
				!open && "-bottom-20!",
			)}
		>
			{status !== "playing" && (
				<Button
					onClick={() => play("testando")}
					variant="secondary"
					size="icon"
					className="rounded-full text-primary-foreground"
				>
					<PlayIcon />
				</Button>
			)}

			{status === "playing" && (
				<Button onClick={pause} variant="secondary" size="icon">
					<PauseIcon />
				</Button>
			)}

			<Button onClick={() => toggleAvatar()} variant="secondary" size="icon" className="ml-auto">
				<SubtitleIcon />
			</Button>
		</div>
	);
};
