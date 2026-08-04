import { useMobile, usePick } from "@/common/hooks";
import { posthogg } from "@/common/lib/posthog";
import { toggleSubtitles } from "@/player/actions";
import { usePlayerStore } from "@/player/stores/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";
import { Tooltip } from "@/widget/components/ui/tooltip";

export const SubtitlesOptions = () => {
	const isMobile = useMobile();
	const { showSubtitles } = usePlayerStore(usePick("showSubtitles", "isPlayingWelcome"));

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
			<Button onClick={handleToggleSubtitles} variant="ghost-gov" size={isMobile ? "icon-sm" : "icon"}>
				<Icon name={showSubtitles ? "subtitle" : "subtitle-off"} />
			</Button>
		</Tooltip>
	);
};
