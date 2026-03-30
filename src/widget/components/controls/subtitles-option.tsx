import { useMobile } from "@/common/hooks";
import { posthogg } from "@/common/lib/posthog";
import { usePlayer } from "@/player/use-player";
import { Button } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";
import { SubtitleOffIcon } from "@/widget/icons";
import { SubtitleIcon } from "@/widget/icons/subtitle";

export const SubtitlesOptions = () => {
	const isMobile = useMobile();
	const { showSubtitles, toggleSubtitles, isPlayingWelcome } = usePlayer();

	const handleToggleSubtitles = () => {
		toggleSubtitles();
		posthogg.trackEvent("subtitles_toggled", { status: showSubtitles ? "disabled" : "enabled" });
	};

	return (
		<Tooltip
			className="whitespace-nowrap text-xs"
			offset={8}
			align="end"
			content={showSubtitles ? "Desativar legendas" : "Ativar legendas"}
			placement="top"
			arrow={{ position: "bottom-right" }}
			disabled={isPlayingWelcome}
		>
			<Button
				disabled={isPlayingWelcome}
				onClick={handleToggleSubtitles}
				variant="ghost-gov"
				size={isMobile ? "icon-sm" : "icon"}
			>
				{showSubtitles ? <SubtitleIcon /> : <SubtitleOffIcon />}
			</Button>
		</Tooltip>
	);
};
