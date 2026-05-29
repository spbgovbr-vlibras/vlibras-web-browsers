declare module "@cdn/posthog-js" {
	import type { PostHog } from "posthog-js";
	const posthog: PostHog;
	export default posthog;
}
