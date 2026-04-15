import { useScreensStore } from "@/widget/stores/use-screens.store";
import { ScreenClose, ScreenHeader, ScreenTitle } from "../components";

export const RegionalismHeader = () => {
	const open = useScreensStore((s) => s.open);

	return (
		<ScreenHeader>
			<ScreenClose onClick={() => open("settings")} />
			<ScreenTitle>Regionalismo</ScreenTitle>
		</ScreenHeader>
	);
};
