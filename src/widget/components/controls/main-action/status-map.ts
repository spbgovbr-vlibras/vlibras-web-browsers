import type { PlayerStatus } from "@/player/types";
import pauseIcon from "@/widget/icons/pause.webp";
import playIcon from "@/widget/icons/play.webp";
import repeatIcon from "@/widget/icons/repeat.webp";
import waitingIcon from "@/widget/icons/waiting.webp";

export const statusMap: Record<PlayerStatus, { label: string; icon: string }> = {
	idle: { label: "Repetir", icon: repeatIcon },
	paused: { label: "Reproduzir", icon: playIcon },
	playing: { label: "Pausar", icon: pauseIcon },
	stopped: { label: "Em espera", icon: waitingIcon },
};
