import { randomStr } from "@/common/utils/dom";

const UNITY_CONTAINER_ID = `vlibras-unity-container-${randomStr()}`;

export function ensureUnityContainer() {
	let container = document.getElementById(UNITY_CONTAINER_ID);

	if (!container) {
		container = document.createElement("div");
		container.id = UNITY_CONTAINER_ID;
		document.body.appendChild(container);
	}

	return container;
}

export function attachCanvas(container: HTMLElement, canvas: HTMLCanvasElement) {
	if (canvas.parentElement !== container) {
		container.appendChild(canvas);
	}
}
