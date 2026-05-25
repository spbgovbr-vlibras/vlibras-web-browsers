import { Fragment } from "preact";
import { AboutScreen } from "@/widget/screens/about";
import { DictionaryScreen } from "@/widget/screens/dictionary";
import { useScreensStore } from "@/widget/stores/use-screens.store";

export const ScreensProvider = () => {
	const screen = useScreensStore((s) => s.screen);

	return (
		<Fragment>
			{screen === "dictionary" && <DictionaryScreen />}
			{screen === "about" && <AboutScreen />}
		</Fragment>
	);
};
