import type { PostHog } from "posthog-js";
import { consentStore } from "@/widget/stores/use-consent.store";

const isDevelopmentHost = () => {
	if (typeof window === "undefined") return false;

	const hostname = location.hostname;
	return (
		hostname === "localhost" ||
		hostname === "127.0.0.1" ||
		hostname === "[::1]" ||
		hostname.endsWith(".local") ||
		hostname.endsWith(".localhost") ||
		hostname.startsWith("192.168.") ||
		hostname.startsWith("10.")
	);
};

const SAMPLING_RATE = 0.07;
const IS_ENABLED = import.meta.env.PROD && !isDevelopmentHost();
const IS_DEBUG = import.meta.env.VITE_PUBLIC_POSTHOG_DEBUG === "true" && !import.meta.env.PROD;

export const isTrackingAvailable = IS_ENABLED && !__IS_EXTENSION__;

const posthogPromise = (async () => {
	if (!IS_ENABLED || __IS_EXTENSION__ || typeof window === "undefined") return null;

	try {
		const modulePath = "https://cdn.jsdelivr.net/npm/posthog-js@1.404.0/+esm";
		const posthog: PostHog = (await import(/* @vite-ignore */ modulePath)).default;

		posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN, {
			api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
			autocapture: false,
			capture_pageview: false,
			capture_performance: false,
			persistence: "memory",
			debug: IS_DEBUG,
		});

		return posthog;
	} catch (e) {
		console.error("Erro ao carregar PostHog:", e);
		return null;
	}
})();

export const posthogg = {
	_getContext: () => ({
		host: location.hostname,
		origin: `${location.origin}${location.pathname}`,
	}),

	trackLoad: async () => {
		const posthog = await posthogPromise;
		if (!IS_ENABLED || !posthog) return;

		if (Math.random() < SAMPLING_RATE) {
			posthog.capture("widget_initialized", {
				...posthogg._getContext(),
				sampling_rate: SAMPLING_RATE,
			});
		}
	},

	trackEvent: async (name: string, properties?: Record<string, unknown>) => {
		if (consentStore.get().status !== "accepted") return;

		const posthog = await posthogPromise;
		if (!IS_ENABLED || !posthog) return;

		posthog.capture(name, {
			...posthogg._getContext(),
			...properties,
		});
	},
};
