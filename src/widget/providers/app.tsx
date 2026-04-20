import { Fragment } from "preact/jsx-runtime";
import { WidgetCallback } from "../components/controls/callback";
import { UnityLoading } from "../components/unity-loading";
import { ScreensProvider } from "./screens";

export const WidgetProviders = () => {
	return (
		<Fragment>
			<WidgetCallback />
			<ScreensProvider />
			<UnityLoading />
		</Fragment>
	);
};
