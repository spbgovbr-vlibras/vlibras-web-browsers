import type { PlayerStatus } from "@/player/types";
import { PauseIcon, PlayIcon, RepeatIcon, WaitingIcon } from "@/widget/icons";
import type { IconElement } from "@/widget/icons/types";

export const statusMap: Record<PlayerStatus, { label: string; icon: IconElement }> = {
	idle: { label: "Repetir", icon: RepeatIcon },
	paused: { label: "Reproduzir", icon: PlayIcon },
	playing: { label: "Pausar", icon: PauseIcon },
	stopped: { label: "Em espera", icon: WaitingIcon },
};
