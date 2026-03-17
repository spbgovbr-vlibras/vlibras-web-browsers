import { Fragment } from "preact/jsx-runtime";
import { DialogProvider } from "./dialog";
import { ScreensProvider } from "./screens";

export const WidgetProviders = () => {
	return (
		<Fragment>
			<ScreensProvider />
			<DialogProvider />
		</Fragment>
	);
};
