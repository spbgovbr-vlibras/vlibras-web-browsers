import { Fragment } from "preact/jsx-runtime";
import { posthogg } from "@/common/lib/posthog";
import { play } from "@/player/actions";
import { Icon } from "@/widget/components/ui/icon";
import { createCallback } from "@/widget/stores/use-callback.store";
import { screenStore } from "@/widget/stores/use-screens.store";
import { dictionaryHistoryStore } from "../stores/use-dictionary-history.store";

export const useHandlePlay = () => {
	return (sign: string) => {
		play(sign);

		const signs = dictionaryHistoryStore.get().signs;
		const newSigns = [sign, ...signs.filter((s) => s !== sign)];

		dictionaryHistoryStore.set({ signs: newSigns });
		screenStore.set({ screen: "main" });

		createCallback({
			action: () => screenStore.set({ screen: "dictionary" }),
			content: (
				<Fragment>
					<Icon name="dictionary" />
					Reabrir Dicionário
				</Fragment>
			),
		});

		posthogg.trackEvent("dictionary_gloss", { sign });
	};
};
