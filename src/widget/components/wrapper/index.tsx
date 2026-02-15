import type { ComponentPropsWithRef } from "preact/compat";

export const WidgetWrapper = (props: ComponentPropsWithRef<"div">) => {
	return <div {...props} />;
};
