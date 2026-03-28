import { Fragment } from "preact";
import { AboutScreen } from "@/widget/screens/about";
import { SettingsScreen } from "@/widget/screens/settings";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { DictionaryScreen } from "../screens/dictionary";

export const ScreensProvider = () => {
	const screen = useScreensStore((s) => s.screen);

	return (
		<Fragment>
			{screen === "settings" && <SettingsScreen />}
			{screen === "dictionary" && <DictionaryScreen />}
			{screen === "about" && <AboutScreen />}
		</Fragment>
	);
};
