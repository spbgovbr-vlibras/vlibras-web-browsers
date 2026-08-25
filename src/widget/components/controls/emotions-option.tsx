import { useMobile } from "@/common/hooks";
import { posthogg } from "@/common/lib/posthog";
import { cn } from "@/common/lib/utils";
import { availableEmotions, type EmotionKey, emotionsMap } from "@/data/emotions";
import { setEmotion } from "@/player/actions";
import { usePlayerStore } from "@/player/stores/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { Dropdown, DropdownContent, DropdownTrigger } from "@/widget/components/ui/dropdown";
import { Icon } from "@/widget/components/ui/icon";
import { Tooltip } from "@/widget/components/ui/tooltip";

export const EmotionsOption = () => {
	const isMobile = useMobile();
	const currentEmotion = usePlayerStore((s) => s.emotion);

	const handleEmotionChange = (emotionKey: EmotionKey) => {
		const emotion = emotionsMap[emotionKey];
		setEmotion(emotionKey);
		posthogg.trackEvent("change_emotion", { emotion: emotion.name });
	};

	const isDefaultEmotion = currentEmotion === emotionsMap.default;

	return (
		<Dropdown className="dropdown-center dropdown-top">
			<Tooltip offset={8} content="Emoções" placement="top" arrow={{ position: "bottom" }}>
				<DropdownTrigger openOnFocus>
					<Button
						aria-label="Alterar emoção"
						className="group relative"
						variant="ghost-gov"
						size={isMobile ? "icon-sm" : "icon"}
					>
						<Icon name={currentEmotion.icon} aria-hidden="true" />
						{!isDefaultEmotion && <span className="absolute top-0.5 right-0.5 size-2 rounded-full bg-destructive" />}
					</Button>
				</DropdownTrigger>
			</Tooltip>

			<DropdownContent className="mb-4 w-[calc(var(--widget-width)-1em)] border bg-background p-1 shadow-lg">
				<div className="relative flex items-center justify-center">
					<span className="absolute -inset-y-1 w-px bg-border" />

					<ul
						className={cn(
							"relative grid w-full grid-cols-2 gap-x-2 gap-y-1 mobile:gap-y-0! font-semibold text-primary text-sm",
						)}
					>
						{availableEmotions.map((key) => {
							const emotion = emotionsMap[key];
							const isActive = emotion === currentEmotion;

							return (
								<li key={key}>
									<button
										aria-label={`Aplicar emoção "${emotion.name}"`}
										type="button"
										inert={isActive}
										onClick={() => handleEmotionChange(key)}
										className={cn(
											"w-full cursor-pointer whitespace-nowrap rounded-md px-2 py-1.5 text-center text-sm hover:bg-primary/10",
											isActive && "bg-primary! text-primary-foreground! outline-1 outline-primary outline-solid",
										)}
									>
										<div className="flex items-center justify-start gap-1.5">
											<Icon name={emotion.icon} className="mobile:size-4.5 size-5" />
											<span className="mobile:text-xs text-sm">{emotion.name}</span>
										</div>
									</button>
								</li>
							);
						})}
					</ul>
				</div>
			</DropdownContent>
		</Dropdown>
	);
};
