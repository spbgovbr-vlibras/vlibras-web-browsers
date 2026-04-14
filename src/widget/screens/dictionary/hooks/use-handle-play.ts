import { posthogg } from "@/common/lib/posthog";
import { usePlayer } from "@/player/use-player";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { useDictionaryHistoryStore } from "../stores/use-dictionary-history.store";

export const useHandlePlay = () => {
	const { play } = usePlayer();
	const signs = useDictionaryHistoryStore((s) => s.signs);

	return (sign: string) => {
		play(sign);

		const newSigns = [sign, ...signs.filter((s) => s !== sign)];

		useDictionaryHistoryStore.setState({ signs: newSigns });
		useScreensStore.setState({ screen: "main" });
		setTimeout(() => useScreensStore.setState({ callbackScreen: "dictionary" }), 300);

		posthogg.trackEvent("dictionary_gloss", { sign });
	};
};
