import { useEffect } from "preact/hooks";
import { usePick } from "@/common/hooks";
import { config } from "@/core/config";
import { usePlayer } from "@/player/use-player";
import { usePlayerStore } from "@/player/use-player.store";

export const usePlayerSync = () => {
	const { playWelcome, setSpeed, setConfig, toggleSubtitles, toggleAvatar } = usePlayer();
	const { isLoaded, speed, showSubtitles, isWelcomeFinished, avatar } = usePlayerStore(
		usePick("isLoaded", "speed", "showSubtitles", "isWelcomeFinished", "avatar"),
	);

	useEffect(() => {
		if (!isLoaded) return;

		setConfig({ baseUrl: config.DICTIONARY_URL });
		toggleAvatar(avatar);
		setSpeed(speed);
		playWelcome();
	}, [isLoaded]);

	useEffect(() => void (isWelcomeFinished && toggleSubtitles(showSubtitles)), [isWelcomeFinished]);
};
