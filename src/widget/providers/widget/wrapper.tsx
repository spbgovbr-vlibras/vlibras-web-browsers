import { Fragment } from "preact/jsx-runtime";
import { Guide } from "@/widget/components/guide";
import { useGuideStore } from "@/widget/components/guide/store";

export const WidgetWrapperProviders = () => {
	const isGuideOpen = useGuideStore((s) => s.open);

	return <Fragment>{isGuideOpen && <Guide />}</Fragment>;
};
