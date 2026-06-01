import { useMobile, usePick } from "@/common/hooks";
import { stop } from "@/player/actions";
import { usePlayerStore } from "@/player/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { SkipIcon } from "@/widget/icons";
import { resetCallback, useCallbackButtonStore } from "@/widget/stores/use-callback.store";
import { useWidgetStore, widgetStore } from "@/widget/stores/use-widget.store";
import { useGuideStore } from "../guide/store";
import { FeedbackTrigger } from "./feedback-trigger";
import { ToggleAvatarButton } from "./toggle-avatar-button";

export const Utilities = () => {
	const isMobile = useMobile();
	const isGuideOpen = useGuideStore((s) => s.open);

	const { status, gloss, isPlayingWelcome } = usePlayerStore(usePick("status", "gloss", "isPlayingWelcome"));
	const { isExpanded, isTranslating, text } = useWidgetStore(usePick("isExpanded", "text", "isTranslating"));

	const isPlaying = status === "playing";
	const isPaused = status === "paused";

	const { action, content } = useCallbackButtonStore(usePick("action", "content"));

	const handleClick = () => {
		action?.();
		resetCallback();
	};

	const handleSkip = () => {
		widgetStore.set({ text: undefined });
		stop();
	};

	const showCallback = action && content && status === "idle";
	const showFeedback = Boolean(status === "idle" && !isTranslating && gloss && text);
	const showSkip = isPlayingWelcome ? true : (isPlaying || isPaused) && !!gloss && !isGuideOpen;
	const showToggleAvatar = status === "idle" || isGuideOpen;

	return (
		<div className="absolute inset-x-3 mobile:inset-x-2 bottom-15 mobile:bottom-13 flex animate-move-up items-end justify-end gap-1.5">
			<div className="mr-auto flex flex-wrap-reverse items-center gap-1.5">
				{showCallback && (
					<Button
						onClick={handleClick}
						variant="outline"
						className="animate-move-up rounded-full bg-background! font-semibold text-primary hover:bg-muted!"
						size={isExpanded ? "default" : isMobile ? "xs" : "sm"}
					>
						{content}
					</Button>
				)}

				{showFeedback && <FeedbackTrigger />}
			</div>

			<div className="ml-auto flex items-center gap-2">
				{showSkip && (
					<Button
						onClick={handleSkip}
						className="animate-move-up rounded-full bg-background! font-semibold text-primary hover:bg-muted!"
						variant="outline"
						size={isExpanded ? "default" : isMobile ? "xs" : "sm"}
					>
						<SkipIcon />
						Pular
					</Button>
				)}

				{showToggleAvatar && <ToggleAvatarButton />}
			</div>
		</div>
	);
};
