import { WidgetWrapper } from "./components/wrapper";
import { DialogProvider } from "./providers/dialog";

export const WidgetApp = () => {
	return (
		<WidgetWrapper>
			<DialogProvider />
		</WidgetWrapper>
	);
};
