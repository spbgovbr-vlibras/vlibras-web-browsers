import type { ComponentChildren } from "preact";
import global from "@/common/styles/global.css?inline";
import { TextCaptureTooltip } from "@/widget/components/text-capture-tooltip";
import { ThemeProvider } from "@/widget/providers/theme";
import { SyncProvider } from "./sync";

type ProvidersProps = {
	children: ComponentChildren;
	root?: ShadowRoot | HTMLElement;
};

export const Providers = ({ children, root }: ProvidersProps) => {
	return (
		<ThemeProvider root={root}>
			<style>{global}</style>
			<TextCaptureTooltip />
			<SyncProvider />

			{children}
		</ThemeProvider>
	);
};
