/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

declare global {
	interface Window {
		VLibrasWidget?: {
			path: string;
			isOpen: boolean;
			initBtn?: Element;
			open: () => void;
		};
	}
}

export {};
