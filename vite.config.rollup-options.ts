export const rollupOptions = {
	external: ["@cdn/posthog-js"],
	output: {
		globals: {
			"@cdn/posthog-js": "PostHog",
		},
		paths: {
			"@cdn/posthog-js": "https://cdn.jsdelivr.net/npm/posthog-js@1.376.4/+esm",
		},
	},
};
