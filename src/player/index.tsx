import { type ComponentProps, Fragment } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { useConfig } from "@/common/hooks";
import { sanitizeUrl } from "@/common/utils";
import type { UNITY_METHODS, UNITY_OBJECTS } from "./constants/unity";
import { PlayerEventsProvider } from "./providers/events";
import { playerStore, usePlayerStore } from "./stores/use-player.store";
import { playerOptionsStore } from "./stores/use-player-options.store";
import type { PlayerOptions } from "./types";

type PlayerProps = ComponentProps<"iframe"> & {
	options?: PlayerOptions;
};

export const Player = (props: PlayerProps) => {
	const { path } = useConfig();

	const isLoaded = usePlayerStore((s) => s.isLoaded);
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const iframeSrc = sanitizeUrl(`${path}/unity/index.html`);

	const send = (object: UNITY_OBJECTS, method: UNITY_METHODS, params?: unknown) => {
		if (!iframeRef.current) return;

		const { contentWindow } = iframeRef.current;
		const { instance } = playerStore.get();

		if (!contentWindow) return;

		contentWindow.postMessage({ type: "unity", object, method, params }, "*");

		if (!instance && !__IS_EXTENSION__) {
			try {
				const _instance = contentWindow.postMessage({ type: "get_unity_instance" }, "*") as UnityInstance | undefined;
				if (_instance) playerStore.set({ instance: _instance });
			} catch (error) {
				console.error("Error setting instance:", error);
			}
		}
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

			<PlayerEventsProvider path={path} iframeRef={iframeRef} />
		</Fragment>
	);
};
