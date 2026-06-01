import { useEffect } from "preact/hooks";
import { UNITY_EVENTS } from "./constants/unity";
import { playerOptionsStore } from "./stores/use-player-options.store";
import { playerStore } from "./use-player.store";
import { playingStatesToBoolean } from "./utils";

type Props = {
	path: string;
};

export const PlayerEventsProvider = ({ path }: Props) => {
	useEffect(() => {
		if (!path) return;

		const handleMessage = (event: MessageEvent<{ type: string; event: UNITY_EVENTS; data: unknown }>) => {
			if (event.data?.type === "unity_event") {
				if (event.data.event === UNITY_EVENTS.FINISH_WELCOME) {
					const isFinished = event.data.data === "True";

					if (playerStore.get().isWelcomeFinished) return;

					playerStore.set({
						isPlayingWelcome: !isFinished,
						isWelcomeFinished: isFinished,
						...(isFinished ? { countGloss: { count: 0, max: 0 } } : {}),
					});

					if (isFinished) playerOptionsStore.get().onWelcomeFinish?.();
				}

				if (event.data.event === UNITY_EVENTS.ON_LOAD_PLAYER) {
					playerStore.set({ isLoaded: true });
					playerOptionsStore.get().onLoaded?.();
				}

				if (event.data.event === UNITY_EVENTS.UPDATE_PROGRESS) {
					const progress = Number(event.data.data);
					if (!Number.isNaN(progress)) playerStore.set({ progress: Number((progress * 100).toFixed(0)) });
				}

				if (event.data.event === UNITY_EVENTS.ON_PLAYING_STATE_CHANGE) {
					const { isPlaying, isPaused, isLoading } = playingStatesToBoolean(event.data.data as string[]);

					if (isPaused) playerStore.set({ status: "paused" });
					else if (isPlaying && !isPaused) playerStore.set({ status: "playing" });
					else if (!isPlaying && !isLoading) playerStore.set({ status: "idle" });
				}

				if (event.data.event === UNITY_EVENTS.COUNTER_GLOSS) {
					const [count, max] = event.data.data as [number, number];
					playerStore.set({ countGloss: { count, max } });
				}
			}
		};

		window.addEventListener("message", handleMessage);

		return () => window.removeEventListener("message", handleMessage);
	}, [path]);

	return null;
};
