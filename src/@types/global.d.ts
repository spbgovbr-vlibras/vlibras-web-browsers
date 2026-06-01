// biome-ignore-all lint/correctness/noUnusedVariables: ...

declare const __VLIBRAS_APP_NAME__: string;
declare const __VLIBRAS_APP_VERSION__: string;
declare const __IS_EXTENSION__: boolean;

interface Window {
	VLibrasWidget?: {
		path: string;
		isOpen: boolean;
		initBtn?: Element;
		open: () => void;
	};

	plugin?: any;
	vlibras?: any;
}

interface UnityInstance {
	SendMessage<T>(objectName: string, methodName: string, params?: T): void;
}

interface UnityConfig {
	dataUrl: string;
	frameworkUrl: string;
	codeUrl: string;
	streamingAssetsUrl: string;
	companyName: string;
	productName: string;
	productVersion: string;
}
