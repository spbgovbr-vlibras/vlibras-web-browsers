import { useMobile } from "@/common/hooks";
import { posthogg } from "@/common/lib/posthog";
import { cn } from "@/common/lib/utils";
import { type Emotion, emotionsMap } from "@/data/emotions-map";
import { setEmotion } from "@/player/actions";
import { usePlayerStore } from "@/player/use-player.store";
import { DropdownTrigger } from "@/widget/components/ui/dropdown";
import { Icon } from "@/widget/components/ui/icon";
import { Tooltip } from "@/widget/components/ui/tooltip";

export const EmotionsOption = () => {
	const isMobile = useMobile();
	const currentEmotion = usePlayerStore((s) => s.emotion);

	const handleEmotionChange = (emotion: Emotion) => {
		setEmotion(emotion);
		posthogg.trackEvent("change_emotion", { emotion: emotion.name });
	};

	const isDefaultEmotion = currentEmotion === emotionsMap.default;

	return (
		<div className="dropdown dropdown-center dropdown-top focus-within:**:data-[slot=tooltip-content]:hidden">
			<Tooltip offset={8} content="Emoções" placement="top" arrow={{ position: "bottom" }}>
				<DropdownTrigger
					aria-label="Alterar emoção"
					className="group relative"
					variant="ghost-gov"
					size={isMobile ? "icon-sm" : "icon"}
				>
					<Icon name={currentEmotion.icon} aria-hidden="true" />
					{!isDefaultEmotion && <span className="absolute top-0.5 right-0.5 size-2 rounded-full bg-destructive" />}
				</DropdownTrigger>
			</Tooltip>

			<div
				tabIndex={-1}
				className="dropdown-content mb-4 w-[calc(var(--widget-width)-1rem)] rounded-xl border bg-background p-1 shadow-lg"
			>
				<div className="relative flex items-center justify-center">
					<span className="absolute -inset-y-1 w-px bg-border" />

					<ul className={cn("relative grid w-full grid-cols-2 gap-x-2 gap-y-1 font-semibold text-primary text-sm")}>
						{Object.values(emotionsMap).map((emotion) => {
							const isActive = emotion === currentEmotion;

							return (
								<li key={emotion.action}>
									<button
										type="button"
										inert={isActive}
										onClick={() => handleEmotionChange(emotion)}
										className={cn(
											"w-full cursor-pointer whitespace-nowrap rounded-md px-2 py-1.5 text-center text-sm hover:bg-primary/10",
											isActive && "bg-primary! text-primary-foreground! outline-1 outline-primary outline-solid",
										)}
									>
										<div className="flex items-center justify-start gap-2">
											<Icon name={emotion.icon} className="size-4.5" />
											<span className="mobile:text-xs text-sm">{emotion.name}</span>
										</div>
									</button>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</div>
	);
};
