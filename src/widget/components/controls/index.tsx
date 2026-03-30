import { useShallow } from "zustand/shallow";
import { useMobile } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { pickKeys } from "@/common/utils";
import { Button } from "@/widget/components/ui/button";
import { SettingsIcon } from "@/widget/icons";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { EmotionsOption } from "./emotions-option";
import { MainAction } from "./main-action";
import { ProgressBar } from "./progress-bar";
import { SpeedOption } from "./speed-option";
import { SubtitlesOptions } from "./subtitles-option";
import { TranslatingBadge } from "./translating-badge";

export const WidgetControls = () => {
	const open = useScreensStore((s) => s.open);
	const isMobile = useMobile();

	const { isOpen, isTranslating } = useWidgetStore(useShallow((s) => pickKeys(s, "isOpen", "isTranslating")));

	return (
		<div
			className={cn(
				"relative flex animate-move-up items-center justify-between gap-1 border-t bg-background p-2 transition-[bottom] ease-in-out",
				"[&_button]:not-hover:bg-transparent",
				"-mt-12",
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
		</div>
	);
};
