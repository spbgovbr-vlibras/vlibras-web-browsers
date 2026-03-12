/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

declare namespace YT {
	interface Player {
		mute(): void;
		unMute(): void;
	}
}

declare global {
	interface Window {
		VLibrasWidget?: {
			path: string;
			isOpen: boolean;
			initBtn?: Element;
			open: () => void;
		};

		createUnityInstance: (
			canvas: HTMLCanvasElement,
			config: Record<string, unknown>,
			progress: (progress: number) => void,
		) => Promise<unknown>;
	}
}

export {};
