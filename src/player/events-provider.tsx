import { useEffect } from "preact/hooks";
import { UNITY_EVENTS } from "./constants/unity";
import { usePlayerStore } from "./use-player.store";
import { playingStatesToBoolean } from "./utils/playing-states-to-boolean";

export const PlayerEventsProvider = () => {
	useEffect(() => {
		const handleMessage = (event: MessageEvent<{ type: string; event: UNITY_EVENTS; data: unknown }>) => {
			if (event.data?.type === "unity_event") {
				if (event.data.event === UNITY_EVENTS.FINISH_WELCOME) {
					const isFinished = event.data.data === "True";

					usePlayerStore.setState({
						isPlayingWelcome: !isFinished,
						isWelcomeFinished: isFinished,
						...(isFinished ? { countGloss: { count: 0, max: 0 } } : {}),
					});
				}

				if (event.data.event === UNITY_EVENTS.ON_LOAD_PLAYER) {
					usePlayerStore.setState({ isLoaded: true });
				}

				if (event.data.event === UNITY_EVENTS.UPDATE_PROGRESS) {
					const progress = Number(event.data.data);
					if (!Number.isNaN(progress)) usePlayerStore.setState({ progress: Number((progress * 100).toFixed(0)) });
				}

				if (event.data.event === UNITY_EVENTS.ON_PLAYING_STATE_CHANGE) {
					const { isPlaying, isPaused, isLoading } = playingStatesToBoolean(event.data.data as string[]);

					if (isPaused) usePlayerStore.setState({ status: "paused" });
					else if (isPlaying && !isPaused) usePlayerStore.setState({ status: "playing" });
					else if (!isPlaying && !isLoading) usePlayerStore.setState({ status: "idle" });
				}

				if (event.data.event === UNITY_EVENTS.COUNTER_GLOSS) {
					const [count, max] = event.data.data as [number, number];
					usePlayerStore.setState({ countGloss: { count, max } });
				}
			}
		};

		window.addEventListener("message", handleMessage);

		return () => window.removeEventListener("message", handleMessage);
	}, []);

	return null;
};
