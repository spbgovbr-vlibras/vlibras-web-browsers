// biome-ignore-all lint/correctness/noUnusedVariables: ...

declare const __VLIBRAS_APP_NAME__: string;
declare const __VLIBRAS_APP_VERSION__: string;

interface Window {
	VLibrasWidget?: {
		path: string;
		isOpen: boolean;
		initBtn?: Element;
		open: () => void;
	};
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
