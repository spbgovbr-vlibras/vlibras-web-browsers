import { type ComponentPropsWithoutRef, Fragment } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";
import { useConfig } from "@/common/hooks";
import { sanitizeUrl } from "@/common/utils";
import type { UNITY_METHODS, UNITY_OBJECTS } from "./constants/unity";
import { PlayerEventsProvider } from "./events-provider";
import { playerOptionsStore } from "./stores/use-player-options.store";
import type { PlayerOptions } from "./types";
import { playerStore, usePlayerStore } from "./use-player.store";

type PlayerProps = ComponentPropsWithoutRef<"iframe"> & {
	options?: PlayerOptions;
};

export const Player = (props: PlayerProps) => {
	const { path } = useConfig();
	const { isLoaded } = usePlayerStore();

	const iframeRef = useRef<HTMLIFrameElement>(null);
	const iframeSrc = sanitizeUrl(`${path}/unity/index.html`);

	const send = (object: UNITY_OBJECTS, method: UNITY_METHODS, params?: unknown) => {
		if (!iframeRef.current) return;

		const { contentWindow } = iframeRef.current;
		const { instance } = playerStore.get();

		contentWindow?.postMessage({ type: "unity", object, method, params }, "*");

		if (!instance) playerStore.set({ instance: contentWindow?.getUnityInstance?.() });
	};

	useEffect(() => {
		if (!iframeRef.current) return;
		playerStore.set({ send });
	}, []);

	useEffect(() => {
		if (!props.options || playerOptionsStore.get().isInitialized) return;
		playerOptionsStore.set({ ...props.options, isInitialized: true });
	}, [props.options]);

	if (!path) return;

	return (
		<Fragment>
			<iframe
				tabindex={-1}
				ref={iframeRef}
				title="vlibras-player"
				sandbox="allow-scripts allow-same-origin allow-pointer-lock"
				src={iframeSrc}
				style={{ border: "none", overflow: "hidden", opacity: isLoaded ? 1 : 0 }}
				{...props}
			/>

			<PlayerEventsProvider path={path} />
		</Fragment>
	);
};
