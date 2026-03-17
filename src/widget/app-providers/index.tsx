import { Fragment } from "preact/jsx-runtime";
import { DialogProvider } from "./dialog";
import { ScreensProvider } from "./screens";

export const WidgetAppProviders = () => {
	return (
		<Fragment>
			<ScreensProvider />
			<DialogProvider />
		</Fragment>
	);
};
