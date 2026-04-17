import { Fragment } from "preact/jsx-runtime";
import { ScreensProvider } from "./screens";

export const WidgetProviders = () => {
	return (
		<Fragment>
			<ScreensProvider />
		</Fragment>
	);
};
