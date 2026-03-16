import { useEffect } from "preact/hooks";
import type { UNITY_EVENTS } from "./constants/unity";
import { usePlayerStore } from "./use-player.store";

export const PlayerEventsProvider = () => {
	useEffect(() => {
		const handleMessage = (event: MessageEvent<{ type: string; event: UNITY_EVENTS; data: unknown }>) => {
			if (event.data?.type === "unity_event") {
				if (event.data.event === "finish_welcome") {
					const isFinish = event.data.data as boolean;
					usePlayerStore.setState({ isPlayingWelcome: !isFinish });
				}

				if (event.data.event === "on_load_player") {
					usePlayerStore.setState({ isLoaded: true });
				}

				if (event.data.event === "update_progress") {
					const progress = Number(event.data.data);
					if (!Number.isNaN(progress)) usePlayerStore.setState({ progress: Number((progress * 100).toFixed(0)) });
				}

				if (event.data.event === "on_playing_state_change") {
					const [isPlaying, isPaused] = event.data.data as string[];

					if (isPlaying === "True") usePlayerStore.setState({ status: "playing" });
					else if (isPaused === "True") usePlayerStore.setState({ status: "paused" });
				}
			}
		};

		window.addEventListener("message", handleMessage);

		return () => window.removeEventListener("message", handleMessage);
	}, []);

	return null;
};
