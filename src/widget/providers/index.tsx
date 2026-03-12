import type { ComponentChildren } from "preact";
import global from "@/common/styles/global.css?inline";
import { ThemeProvider } from "@/widget/providers/theme";

type ProvidersProps = {
	children: ComponentChildren;
	root?: ShadowRoot | HTMLElement;
};

export const Providers = ({ children, root }: ProvidersProps) => {
	return (
		<ThemeProvider root={root}>
			<style>{global}</style>
			{children}
		</ThemeProvider>
	);
};
