/// <reference types="vite/client" />

declare namespace YT {
	interface Player {
		mute(): void;
		unMute(): void;
	}
}

declare global {
	interface Window {
		VLibrasWidgetPlus?: {
			path: string;
			isOpen: boolean;
			initBtn?: Element;
			open: () => void;
		};

		SpeechRecognition?: {
			prototype: SpeechRecognition;
			new (): SpeechRecognition;
		};

		webkitSpeechRecognition?: {
			prototype: SpeechRecognition;
			new (): SpeechRecognition;
		};

		onYouTubeIframeAPIReady?: () => void;

		YT?: {
			Player: {
				prototype: YT.Player;
				new (
					element: Element,
					options: {
						events?: {
							onReady?: (event: { target: { mute: () => void; unMute: () => void } }) => void;
						};
					},
				): YT.Player;
			};
		};
	}
}

export {};
