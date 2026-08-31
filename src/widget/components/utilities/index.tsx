import { useEffect } from "preact/hooks";
import { useMobile, usePick } from "@/common/hooks";
import { stop } from "@/player/actions";
import { usePlayerStore } from "@/player/stores/use-player.store";
import { useGuideStore } from "@/widget/components/guide/store";
import { Button } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";
import { callbackStore, resetCallback, useCallbackStore } from "@/widget/stores/use-callback.store";
import { useWidgetStore, widgetStore } from "@/widget/stores/use-widget.store";
import { FeedbackTrigger } from "./components/feedback-trigger";
import { ToggleAvatarButton } from "./components/toggle-avatar-button";

export const Utilities = () => {
	const isMobile = useMobile();
	const isGuideOpen = useGuideStore((s) => s.open);

	const { status, isGlossTranslated, ...states } = usePlayerStore(
		usePick("status", "isGlossTranslated", "isPlayingWelcome", "isWelcomeFinished"),
	);
	const { isExpanded, isTranslating, text } = useWidgetStore(usePick("isExpanded", "text", "isTranslating"));
	const { action, content } = useCallbackStore(usePick("action", "content"));

	const isPlaying = status === "playing";
	const isPaused = status === "paused";
	const isIdle = status === "idle";

	useEffect(() => {
		if (!isIdle) return;
		const { auto, action } = callbackStore.get();

		if (auto && action) {
			action();
			resetCallback();
		}
	}, [isIdle]);

	const handleClick = () => {
		callbackStore.get().action?.();
		resetCallback();
	};

	const handleSkip = () => {
		widgetStore.set({ text: undefined });
		stop();
	};

	const showCallback = action && content && status === "idle";
	const showFeedback = Boolean(status === "idle" && isGlossTranslated && text);
	const showSkip = states.isPlayingWelcome ? true : (isPlaying || isPaused) && !isGuideOpen;
	const showToggleAvatar = states.isWelcomeFinished && (status === "idle" || isGuideOpen);

	if (isTranslating) return null;

	return (
		<div className="absolute expanded:inset-x-4! inset-x-3 mobile:inset-x-2 bottom-15 expanded:bottom-16! mobile:bottom-13 flex animate-move-up items-end justify-end gap-1.5 [&_button]:dark:text-secondary-foreground">
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
						<Icon name="skip" />
						Pular
					</Button>
				)}

				{showToggleAvatar && <ToggleAvatarButton />}
			</div>
		</div>
	);
};
