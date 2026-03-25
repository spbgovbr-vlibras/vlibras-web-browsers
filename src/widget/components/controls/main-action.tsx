import type { PlayerStatus } from "@/player/types";
import { usePlayer } from "@/player/use-player";
import { Button } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";
import { PauseIcon, PlayIcon, RepeatIcon, WaitingIcon } from "@/widget/icons";
import type { IconElement } from "@/widget/icons/types";

type StatusDetail = { label: string; icon: IconElement };

const statusMap: Record<PlayerStatus, StatusDetail> = {
	idle: { label: "Repetir", icon: RepeatIcon },
	paused: { label: "Reproduzir", icon: PlayIcon },
	playing: { label: "Pausar", icon: PauseIcon },
	stopped: { label: "Em espera", icon: WaitingIcon },
};

export const MainAction = () => {
	const { play, repeat, pause, gloss, status: _status } = usePlayer();

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
			<Button data-slot="main-action" disabled={!gloss} onClick={onClick} variant="ghost-gov" size="icon">
				<status.icon />
			</Button>
		</Tooltip>
	);
};
