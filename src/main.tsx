import { render } from "preact";
import { useEffect } from "preact/hooks";
import { useConfig } from "@/common/hooks";
import { StyleProvider } from "@/common/providers/style";
import { createRoot } from "@/core/dom";
import { loadDefaultFont } from "@/core/fonts";
import { WidgetApp } from "@/widget/app";
import { Providers } from "@/widget/providers";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

const { root, shadowRoot, isRootActive } = createRoot();

function App() {
	const { setOpenWidget, isLoaded, setLoaded } = useWidgetStore();
	const { path } = useConfig();

	useEffect(() => {
		(async () => {
			await loadDefaultFont(path, shadowRoot);
			setLoaded(true);
		})();

		if (!isLoaded) return;

		setOpenWidget(isRootActive());

		if (import.meta.env.MODE === "development") setOpenWidget(true);

		const observer = new MutationObserver(() => setOpenWidget(isRootActive()));
		observer.observe(root as HTMLElement, {
			attributes: true,
			attributeFilter: ["data-active"],
		});

		return () => observer.disconnect();
	}, [path, setOpenWidget, isLoaded, setLoaded]);

	return (
		<StyleProvider>
			<Providers root={shadowRoot}>
				<WidgetApp />
			</Providers>
		</StyleProvider>
	);
}

render(<App />, shadowRoot);
