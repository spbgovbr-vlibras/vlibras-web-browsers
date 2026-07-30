import { QueryClientProvider } from "@tanstack/preact-query";
import type { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";
import { queryClient } from "@/common/lib/query-client";
import { setupWidgetStyles } from "@/common/utils/dom";
import { TextCaptureTooltip } from "@/widget/components/text-capture-tooltip";
import { ThemeProvider } from "@/widget/providers/theme";
import { SyncProvider } from "./sync";

type ProvidersProps = {
	children: ComponentChildren;
	root?: ShadowRoot | HTMLElement;
};

export const Providers = ({ children, root }: ProvidersProps) => {
	const [isReady, setReady] = useState(false);
	useEffect(() => void (root && setupWidgetStyles(root, () => setReady(true))), [root]);

	if (!isReady) return null;

	return (
		<ThemeProvider root={root}>
			<QueryClientProvider client={queryClient}>
				<TextCaptureTooltip />
				<SyncProvider />
				{children}
			</QueryClientProvider>
		</ThemeProvider>
	);
};
