import type { PlayerStatus } from "@/player/types";
import type { IconName } from "@/widget/icons/types";

export const statusMap: Record<PlayerStatus, { label: string; icon: IconName }> = {
	idle: { label: "Repetir", icon: "repeat" },
	paused: { label: "Reproduzir", icon: "play" },
	playing: { label: "Pausar", icon: "pause" },
	stopped: { label: "Em espera", icon: "waiting" },
};
