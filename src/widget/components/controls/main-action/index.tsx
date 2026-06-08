import { useMobile, usePick } from "@/common/hooks";
import { pause, play, repeat } from "@/player/actions";
import { playerStore, usePlayerStore } from "@/player/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";
import { Tooltip } from "@/widget/components/ui/tooltip";
import { widgetStore } from "@/widget/stores/use-widget.store";
import { statusMap } from "./status-map";

export const MainAction = () => {
	const isMobile = useMobile();
	const { gloss, status: _status } = usePlayerStore(usePick("gloss", "status"));

	const onClick = () => {
		const { status } = playerStore.get();

		if (status === "idle") repeat();
		else if (status === "paused") play();
		else if (status === "playing") {
			pause();
			widgetStore.set({ isPausedByUser: true });
		}
	};

	const status = statusMap[_status];

	return (
		<Tooltip
			offset={8}
			content={status.label}
			disabled={!gloss}
			placement="top"
			align="start"
			arrow={{ position: "bottom-left" }}
		>
			<Button
				aria-label={status.label}
				data-slot="main-action"
				disabled={!gloss}
				onClick={onClick}
				variant="ghost-gov"
				size={isMobile ? "icon-sm" : "icon"}
			>
				<Icon name={status.icon} />
			</Button>
		</Tooltip>
	);
};
