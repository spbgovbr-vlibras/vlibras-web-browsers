import { useEffect } from "preact/hooks";
import { usePick } from "@/common/hooks";
import { config } from "@/core/config";
import { usePlayer } from "@/player/use-player";
import { usePlayerStore } from "@/player/use-player.store";

export const usePlayerSync = () => {
	const { playWelcome, setSpeed, setConfig, toggleSubtitles } = usePlayer();
	const { isLoaded, speed, showSubtitles, isWelcomeFinished } = usePlayerStore(
		usePick("isLoaded", "speed", "showSubtitles", "isWelcomeFinished"),
	);

	useEffect(() => {
		if (!isLoaded) return;

		playWelcome();
		setSpeed(speed);
		setConfig({ baseUrl: config.DICTIONARY_URL });
	}, [isLoaded]);

	useEffect(() => void (isWelcomeFinished && toggleSubtitles(showSubtitles)), [isWelcomeFinished]);
};
