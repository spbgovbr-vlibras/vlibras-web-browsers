import { POSTHOG_EVENT } from "@/common/lib/posthog/types";

export const LOAD_SAMPLING_RATE = 0.03;

const SAMPLING_RATES: Partial<Record<POSTHOG_EVENT, number>> = {
	[POSTHOG_EVENT.AVATAR_SELECTED]: 0.3,
	[POSTHOG_EVENT.CHANGE_EMOTION]: 0.3,
	[POSTHOG_EVENT.CHANGE_SPEED]: 0.5,
	[POSTHOG_EVENT.SUBTITLES_TOGGLED]: 0.5,
};

export const getSamplingRate = (event: POSTHOG_EVENT) => {
	return SAMPLING_RATES[event] ?? 1;
};
