declare const __APP_VERSION__: string;

// biome-ignore lint/correctness/noUnusedVariables: ...
interface Window {
	createUnityInstance: (
		canvas: HTMLCanvasElement,
		config: UnityConfig,
		onProgress?: (progress: number) => void,
	) => Promise<UnityInstance>;
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
