import { useMobile, usePick } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { usePlayerStore } from "@/player/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { SettingsIcon } from "@/widget/icons";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { CallbackScreen } from "./callback-screen";
import { EmotionsOption } from "./emotions-option";
import { MainAction } from "./main-action";
import { ProgressBar } from "./progress-bar";
import { SpeedOption } from "./speed-option";
import { SubtitlesOptions } from "./subtitles-option";
import { TranslatingBadge } from "./translating-badge";

export const WidgetControls = () => {
	const isMobile = useMobile();
	const status = usePlayerStore((s) => s.status);

	const { callbackScreen, open } = useScreensStore(usePick("callbackScreen", "open"));
	const { isOpen, isTranslating } = useWidgetStore(usePick("isOpen", "isTranslating"));

	return (
		<div
			className={cn(
				"relative flex animate-move-up items-center justify-between gap-1 border-t bg-background p-2 transition-[bottom] ease-in-out",
				"[&_button]:not-hover:bg-transparent",
				"-mt-13",
				!isOpen && "-bottom-20!",
			)}
		>
			{isTranslating && <TranslatingBadge />}

			<ProgressBar />

			<MainAction />
			<SpeedOption />
			<EmotionsOption />
			<SubtitlesOptions />

			<Button onClick={() => open("settings")} variant="ghost-gov" size={isMobile ? "icon-sm" : "icon"}>
				<SettingsIcon />
			</Button>

			{status === "idle" && !!callbackScreen && <Button className="absolute left-2">Teste</Button>}

			<CallbackScreen />
		</div>
	);
};
