import { Fragment } from "preact/jsx-runtime";
import { posthogg } from "@/common/lib/posthog";
import { play } from "@/player/actions";
import { DictionaryIcon } from "@/widget/icons/dictionary";
import { createCallback } from "@/widget/stores/use-callback.store";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { useDictionaryHistoryStore } from "../stores/use-dictionary-history.store";

export const useHandlePlay = () => {
	const signs = useDictionaryHistoryStore((s) => s.signs);

	return (sign: string) => {
		play(sign);

		const newSigns = [sign, ...signs.filter((s) => s !== sign)];

		useDictionaryHistoryStore.setState({ signs: newSigns });
		useScreensStore.setState({ screen: "main" });

		createCallback({
			action: () => useScreensStore.setState({ screen: "dictionary" }),
			content: (
				<Fragment>
					<DictionaryIcon />
					Reabrir Dicionário
				</Fragment>
			),
		});

		posthogg.trackEvent("dictionary_gloss", { sign });
	};
};
