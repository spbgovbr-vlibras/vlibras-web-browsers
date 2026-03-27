import posthog from "posthog-js";
import { config } from "@/core/config";

const SAMPLING_RATE = 0.1;
const IS_ENABLED = import.meta.env.VITE_PUBLIC_POSTHOG_ENABLED === "true";

if (typeof window !== "undefined") {
	posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN, {
		api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
		autocapture: false,
		capture_pageview: false,
		persistence: "memory",
		debug: config.mode !== "production",
	});
}

export const posthogg = {
	_getContext: () => ({
		host: window.location.hostname,
		origin_url: window.location.href,
	}),

	trackLoad: () => {
		if (!IS_ENABLED) return;

		if (Math.random() < SAMPLING_RATE) {
			posthog.capture("widget_initialized", {
				...posthogg._getContext(),
				sampling_rate: SAMPLING_RATE,
			});
		}
	},

	trackEvent: (name: string, properties?: Record<string, unknown>) => {
		if (!IS_ENABLED) return;

		posthog.capture(name, {
			...posthogg._getContext(),
			...properties,
		});
	},
};
