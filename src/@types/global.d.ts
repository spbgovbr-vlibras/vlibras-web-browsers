// biome-ignore-all lint/correctness/noUnusedVariables: ...

declare const __APP_VERSION__: string;

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
