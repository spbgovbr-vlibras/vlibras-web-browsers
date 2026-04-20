import { render } from "preact";
import { useEffect } from "preact/hooks";
import { useConfig, usePick } from "@/common/hooks";
import { createRoot } from "@/core/dom";
import { loadDefaultFont } from "@/core/fonts";
import { WidgetApp } from "@/widget/app";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { posthogg } from "./common/lib/posthog";
import { Providers } from "./widget/providers";
import { rootStore } from "./widget/stores/use-root.store";

const { root, shadowRoot, isRootActive } = createRoot();

function App() {
	const { setOpen, isLoaded, setLoaded } = useWidgetStore(usePick("setOpen", "isLoaded", "setLoaded"));
	const { path } = useConfig();

	useEffect(() => rootStore.set({ root, shadowRoot }), [root, shadowRoot]);
	useEffect(() => posthogg.trackLoad(), []);

	useEffect(() => {
		if (!path) return;

		(async () => {
			await loadDefaultFont(path, shadowRoot);
			setLoaded(true);
		})();

		if (!isLoaded) return;

		setOpen(isRootActive());

		if (import.meta.env.MODE === "development") setOpen(true);

		const observer = new MutationObserver(() => setOpen(isRootActive()));
		observer.observe(root as HTMLElement, {
			attributes: true,
			attributeFilter: ["data-active"],
		});

		return () => observer.disconnect();
	}, [path, setOpen, isLoaded, setLoaded]);

	if (!isLoaded) return null;

	return (
		<Providers root={shadowRoot}>
			<WidgetApp />
		</Providers>
	);
}

render(<App />, shadowRoot);
