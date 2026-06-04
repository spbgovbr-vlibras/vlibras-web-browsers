import { useMobile, usePick } from "@/common/hooks";
import { posthogg } from "@/common/lib/posthog";
import { MaskIcon } from "@/common/utils/mask-icon";
import { toggleSubtitles } from "@/player/actions";
import { usePlayerStore } from "@/player/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";
import subtitleIcon from "@/widget/icons/subtitle.webp";
import subtitleOffIcon from "@/widget/icons/subtitle-off.webp";

export const SubtitlesOptions = () => {
	const isMobile = useMobile();
	const { showSubtitles, isPlayingWelcome } = usePlayerStore(usePick("showSubtitles", "isPlayingWelcome"));

	const handleToggleSubtitles = () => {
		toggleSubtitles();
		posthogg.trackEvent("subtitles_toggled", { status: showSubtitles ? "disabled" : "enabled" });
	};

	return (
		<Tooltip
			className="whitespace-nowrap"
			offset={8}
			align="end"
			content={showSubtitles ? "Desativar legendas" : "Ativar legendas"}
			placement="top"
			arrow={{ position: "bottom-right" }}
		>
			<Button
				disabled={isPlayingWelcome}
				onClick={handleToggleSubtitles}
				variant="ghost-gov"
				size={isMobile ? "icon-sm" : "icon"}
			>
				{showSubtitles ? <MaskIcon src={subtitleIcon} /> : <MaskIcon src={subtitleOffIcon} />}
			</Button>
		</Tooltip>
	);
};
