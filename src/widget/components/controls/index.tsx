import { useMobile, usePick } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { Button } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";
import { SettingsIcon } from "@/widget/icons";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { useDraggable } from "../draggable";
import { CallbackScreen } from "./callback-screen";
import { EmotionsOption } from "./emotions-option";
import { MainAction } from "./main-action";
import { ProgressBar } from "./progress-bar";
import { SpeedOption } from "./speed-option";
import { SubtitlesOptions } from "./subtitles-option";
import { TranslatingBadge } from "./translating-badge";

export const WidgetControls = () => {
	const isMobile = useMobile();
	const open = useScreensStore((s) => s.open);

	const { onPointerDown } = useDraggable();
	const { isOpen, isTranslating } = useWidgetStore(usePick("isOpen", "isTranslating"));

	return (
		<div
			className={cn(
				"relative flex animate-move-up items-center justify-between gap-1 border-t bg-background p-2 transition-[bottom] ease-in-out",
				"[&_button]:z-1 [&_button]:not-hover:bg-transparent **:[[role=button]]:not-hover:bg-transparent",
				"-mt-13",
				!isOpen && "-bottom-20!",
			)}
		>
			<div {...{ onPointerDown }} className="absolute inset-0 z-0 hover:cursor-move" />

			{isTranslating && <TranslatingBadge />}

			<ProgressBar />

			<MainAction />
			<SpeedOption />
			<EmotionsOption />
			<SubtitlesOptions />

			<Tooltip
				className="whitespace-nowrap text-xs"
				offset={8}
				align="end"
				content="Configurações"
				placement="top"
				arrow={{ position: "bottom-right" }}
			>
				<Button onClick={() => open("settings")} variant="ghost-gov" size={isMobile ? "icon-sm" : "icon"}>
					<SettingsIcon />
				</Button>
			</Tooltip>

			<CallbackScreen />
		</div>
	);
};
