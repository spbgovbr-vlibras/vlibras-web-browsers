import type { ComponentChildren } from "preact";
import { ThemeProvider } from "@/widget/providers/theme";

import global from "./styles/global.css?inline";

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
