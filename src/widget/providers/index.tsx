import { QueryClientProvider } from "@tanstack/preact-query";
import type { ComponentChildren } from "preact";
import { useEffect } from "preact/hooks";
import { queryClient } from "@/common/lib/query-client";
import global from "@/common/styles/global.css?inline";
import { injectShadowStyles } from "@/common/utils/dom";
import { TextCaptureTooltip } from "@/widget/components/text-capture-tooltip";
import { ThemeProvider } from "@/widget/providers/theme";
import { SyncProvider } from "./sync";

type ProvidersProps = {
	children: ComponentChildren;
	root?: ShadowRoot | HTMLElement;
};

export const Providers = ({ children, root }: ProvidersProps) => {
	useEffect(() => void (root && injectShadowStyles(root, [global])), [root]);

	return (
		<ThemeProvider root={root}>
			<style>{global}</style>

			<QueryClientProvider client={queryClient}>
				<TextCaptureTooltip />
				<SyncProvider />
				{children}
			</QueryClientProvider>
		</ThemeProvider>
	);
};
