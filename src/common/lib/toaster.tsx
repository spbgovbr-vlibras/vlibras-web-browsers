import type { ComponentChildren } from "preact";
import { randomStr } from "@/common/utils";

export type ToastData = ToastOptions & {
	id: string;
	message: string | ComponentChildren;
	isExiting?: boolean;
};

type Listener = (toasts: ToastData[]) => void;

type ToastOptions = {
	duration?: number;
	position?: "top" | "bottom";
	align?: "center" | "start" | "end";
	variant?: "success" | "destructive" | "default";
	className?: string;
};

let toasts: ToastData[] = [];
let listeners: Listener[] = [];

const notify = () => listeners.forEach((l) => l([...toasts]));

export const toast = (message: string | ComponentChildren, options?: ToastOptions) => {
	const id = randomStr();
	const duration = options?.duration || 3000;

	toasts.push({ id, message, duration, ...options });
	notify();

	setTimeout(() => {
		const toastIdx = toasts.findIndex((t) => t.id === id);
		if (toastIdx > -1) {
			toasts[toastIdx].isExiting = true;
			notify();
		}

		setTimeout(() => {
			toasts = toasts.filter((t) => t.id !== id);
			notify();
		}, 500);
	}, duration);
};

export const subscribe = (listener: Listener) => {
	listeners.push(listener);
	return () => {
		listeners = listeners.filter((l) => l !== listener);
	};
};
