import { type ComponentPropsWithoutRef, Fragment } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";
import { useConfig } from "@/common/hooks";
import { sanitizeUrl } from "@/common/utils";
import type { UNITY_METHODS, UNITY_OBJECTS } from "./constants/unity";
import { PlayerEventsProvider } from "./events-provider";
import { playerStore, usePlayerStore } from "./use-player.store";

export const Player = (props: ComponentPropsWithoutRef<"iframe">) => {
	const { path } = useConfig();
	const { isLoaded } = usePlayerStore();

	const iframeRef = useRef<HTMLIFrameElement>(null);
	const iframeSrc = sanitizeUrl(`${path}/unity/index.html`);

	const send = (object: UNITY_OBJECTS, method: UNITY_METHODS, params?: unknown) => {
		iframeRef.current?.contentWindow?.postMessage({ type: "unity", object, method, params }, "*");
	};

	useEffect(() => {
		if (!iframeRef.current) return;
		playerStore.set({ send });
	}, []);

	return (
		<Fragment>
			<iframe
				tabindex={-1}
				ref={iframeRef}
				title="vlibras-player"
				src={iframeSrc}
				style={{ border: "none", overflow: "hidden", opacity: isLoaded ? 1 : 0 }}
				{...props}
			/>

			<PlayerEventsProvider />
		</Fragment>
	);
};
