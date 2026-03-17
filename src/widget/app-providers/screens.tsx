import { Fragment } from "preact";
import { AboutScreen } from "../screens/about";
import { SettingsScreen } from "../screens/settings";
import { useScreensStore } from "../stores/use-screens.store";

export const ScreensProvider = () => {
	const { screen } = useScreensStore();

	return (
		<Fragment>
			{screen === "settings" && <SettingsScreen />}
			{screen === "about" && <AboutScreen />}
		</Fragment>
	);
};
