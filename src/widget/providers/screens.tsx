import { Fragment } from "preact";
import { AboutScreen } from "@/widget/screens/about";
import { SettingsScreen } from "@/widget/screens/settings";
import { useScreensStore } from "@/widget/stores/use-screens.store";

export const ScreensProvider = () => {
	const { screen } = useScreensStore();

	return (
		<Fragment>
			{screen === "settings" && <SettingsScreen />}
			{screen === "about" && <AboutScreen />}
		</Fragment>
	);
};
