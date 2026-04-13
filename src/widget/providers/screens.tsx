import { Fragment } from "preact";
import { AboutScreen } from "@/widget/screens/about";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { DictionaryScreen } from "../screens/dictionary";
import { RegionalismScreen } from "../screens/regionalism";
import { SettingsScreen } from "../screens/settings";

export const ScreensProvider = () => {
	const screen = useScreensStore((s) => s.screen);

	return (
		<Fragment>
			{screen === "settings" && <SettingsScreen />}
			{screen === "dictionary" && <DictionaryScreen />}
			{screen === "about" && <AboutScreen />}
			{screen === "regionalism" && <RegionalismScreen />}
		</Fragment>
	);
};
