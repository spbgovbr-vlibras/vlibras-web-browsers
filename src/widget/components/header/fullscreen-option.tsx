import { useMobile } from "@/common/hooks";
import { posthogg } from "@/common/lib/posthog";
import { FullscreenIcon } from "@/widget/icons";
import { useRootStore } from "@/widget/stores/use-root.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { Button } from "../ui/button";
import { Tooltip } from "../ui/tooltip";

export const FullscreenOption = () => {
	const isMobile = useMobile();
	const isFullscreen = useWidgetStore((s) => s.isFullscreen);

	const toggleFullscreen = () => {
		const { appRoot } = useRootStore.getState();
		const { isFullscreen } = useWidgetStore.getState();
		const nextState = !isFullscreen;

		useWidgetStore.setState({ isFullscreen: nextState });

		if (!nextState) return delete appRoot.dataset.fullscreen;

		appRoot.dataset.fullscreen = "true";
		posthogg.trackEvent("fullscreen");
	};

	const fullscreenLabel = isFullscreen ? "Sair da tela cheia" : "Tela cheia";

	return (
		<Tooltip
			className="whitespace-nowrap text-xs"
			offset={2}
			content={fullscreenLabel}
			placement="bottom"
			align="end"
			arrow={{ position: "top-right" }}
		>
			<Button
				disabled
				onClick={toggleFullscreen}
				className="z-1"
				aria-label={fullscreenLabel}
				size={isMobile ? "icon-sm" : "icon"}
				variant="default"
			>
				<FullscreenIcon />
			</Button>
		</Tooltip>
	);
};
