import { useMobile, usePick } from "@/common/hooks";
import { usePlayer } from "@/player/use-player";
import { usePlayerStore } from "@/player/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";
import { statusMap } from "./status-map";

export const MainAction = () => {
	const isMobile = useMobile();
	const { play, repeat, pause } = usePlayer();
	const { gloss, status: _status } = usePlayerStore(usePick("gloss", "status"));

	const onClick = () => {
		if (_status === "idle") repeat();
		else if (_status === "paused") play();
		else if (_status === "playing") pause();
	};

	const status = statusMap[_status];

	return (
		<Tooltip
			className="text-xs"
			offset={8}
			content={status.label}
			disabled={!gloss}
			placement="top"
			align="start"
			arrow={{ position: "bottom-left" }}
		>
			<Button
				data-slot="main-action"
				disabled={!gloss}
				onClick={onClick}
				variant="ghost-gov"
				size={isMobile ? "icon-sm" : "icon"}
			>
				<status.icon />
			</Button>
		</Tooltip>
	);
};
