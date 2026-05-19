import { useMobile } from "@/common/hooks";
import { posthogg } from "@/common/lib/posthog";
import { cn } from "@/common/lib/utils";
import { type Emotion, emotionsMap } from "@/data/emotions-map";
import { usePlayer } from "@/player/use-player";
import { usePlayerStore } from "@/player/use-player.store";
import { useGuideSelected } from "@/widget/components/guide/store";
import { DropdownTrigger } from "@/widget/components/ui/dropdown";
import { Tooltip } from "@/widget/components/ui/tooltip";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

export const EmotionsOption = () => {
	const isMobile = useMobile();
	const currentEmotion = usePlayerStore((s) => s.emotion);
	const isExpanded = useWidgetStore((s) => s.isExpanded);
	const isGuideSelected = useGuideSelected("#emotions-subtitles-options");

	const { setEmotion } = usePlayer();

	const handleEmotionChange = (emotion: Emotion) => {
		setEmotion(emotion);
		posthogg.trackEvent("change_emotion", { emotion: emotion.name });
	};

	const isDefaultEmotion = currentEmotion === emotionsMap.default;

	return (
		<div
			className={cn(
				"dropdown dropdown-center dropdown-top focus-within:**:data-[slot=tooltip-content]:hidden",
				isGuideSelected && !isExpanded && "dropdown-open [&_.dropdown-content]:scale-95",
			)}
		>
			<Tooltip className="text-xs" offset={8} content="Emoções" placement="top" arrow={{ position: "bottom" }}>
				<DropdownTrigger
					id="emotions-option-button"
					className="group relative"
					variant="ghost-gov"
					size={isMobile ? "icon-sm" : "icon"}
				>
					<currentEmotion.icon />
					{!isDefaultEmotion && <span className="absolute top-0.5 right-0.5 size-2 rounded-full bg-destructive" />}
				</DropdownTrigger>
			</Tooltip>

			<div
				tabIndex={-1}
				className="dropdown-content mb-4 w-[calc(var(--widget-width)-1rem)] rounded-lg border bg-background p-1 shadow-lg"
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
											"w-full cursor-pointer whitespace-nowrap rounded-sm px-2 py-1.5 text-center text-xs hover:bg-primary/10 sm:text-sm",
											isActive && "bg-primary! text-primary-foreground! outline-1 outline-primary outline-solid",
										)}
									>
										<div className="flex items-center justify-start gap-2">
											<emotion.icon className="size-4.5 sm:size-5" />
											<span>{emotion.name}</span>
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
