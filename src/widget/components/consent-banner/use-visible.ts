import { isTrackingAvailable } from "@/common/lib/posthog";
import { useConsentStore } from "@/common/stores/use-consent.store";
import { usePlayerStore } from "@/player/stores/use-player.store";
import { useGuideStore } from "@/widget/components/guide/store";

export const useConsentBannerVisible = () => {
	const status = useConsentStore((s) => s.status);
	const isGuideOpen = useGuideStore((s) => s.open);
	const isPlaying = usePlayerStore((s) => s.status === "playing" && !!s.gloss);

	return isTrackingAvailable && status === "pending" && !isGuideOpen && !isPlaying;
};
