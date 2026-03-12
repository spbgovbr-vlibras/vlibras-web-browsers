const UNITY_LOADER_SRC = "/unity/webgl.loader.js";

export function loadUnityLoader() {
	return new Promise<void>((resolve, reject) => {
		const script = document.createElement("script");
		script.src = UNITY_LOADER_SRC;
		script.async = true;

		script.onload = () => resolve();
		script.onerror = reject;

		document.head.appendChild(script);
	});
}
