import { Screen, ScreenContent } from "../components";
import { SettingsHeader } from "./header";

export const SettingsScreen = () => {
	return (
		<Screen>
			<SettingsHeader />
			<ScreenContent>
				<div className="h-[1000px]">Content</div>
			</ScreenContent>
		</Screen>
	);
};
