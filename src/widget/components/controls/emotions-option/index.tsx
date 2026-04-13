import { useMobile } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { emotionsMap } from "@/data/emotionsMap";
import { usePlayer } from "@/player/use-player";
import { usePlayerStore } from "@/player/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";

export const EmotionsOption = () => {
	const isMobile = useMobile();
	const { setEmotion } = usePlayer();
	const currentEmotion = usePlayerStore((s) => s.emotion);
	return (
		<Tooltip className="text-xs" offset={8} content="Emoções" placement="top" arrow={{ position: "bottom" }}>
			<div className="dropdown dropdown-center dropdown-top">
				<Button variant="ghost-gov" size={isMobile ? "icon-sm" : "icon"}>
					<currentEmotion.icon />
				</Button>
				<ul
					tabIndex={-1}
					style={{ boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.15)" }}
					className={cn(
						"dropdown-content mb-4 grid w-60 grid-cols-2 space-y-1 rounded-lg border bg-background p-1 font-semibold text-primary text-sm md:w-75",
					)}
				>
					{Object.values(emotionsMap).map((emotion) => {
						const isActive = emotion === currentEmotion;
						return (
							<li key={emotion.action}>
								<button
									type="button"
									inert={isActive}
									onClick={() => setEmotion(emotion)}
									className={cn(
										"w-full cursor-pointer whitespace-nowrap rounded-sm px-2 py-1 text-center text-xs hover:bg-primary/10 sm:text-sm",
										isActive && "bg-primary! text-primary-foreground! outline-1 outline-primary outline-solid",
									)}
								>
									<div className="flex items-center justify-start gap-2">
										<emotion.icon />
										<span>{emotion.name}</span>
									</div>
								</button>
							</li>
						);
					})}
				</ul>
			</div>
		</Tooltip>
	);
};
