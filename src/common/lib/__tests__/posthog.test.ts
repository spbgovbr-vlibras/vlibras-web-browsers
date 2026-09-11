import { beforeEach, describe, expect, it, vi } from "vitest";
import { consentStore } from "@/widget/stores/use-consent.store";

describe("posthog - sampling & consent gating (non-PROD)", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		consentStore.set({ status: "pending" });
	});

	it("isTrackingAvailable should be false in test (non-PROD)", async () => {
		const mod = await import("@/common/lib/posthog");
		expect(mod.isTrackingAvailable).toBe(false);
	});

	it("trackEvent should noop when consent not accepted", async () => {
		const { posthogg } = await import("@/common/lib/posthog");
		consentStore.set({ status: "pending" });
		await expect(posthogg.trackEvent("test_event")).resolves.toBeUndefined();
		consentStore.set({ status: "declined" });
		await expect(posthogg.trackEvent("test_event")).resolves.toBeUndefined();
	});

	it("trackEvent should not throw when consent accepted but not enabled", async () => {
		const { posthogg } = await import("@/common/lib/posthog");
		consentStore.set({ status: "accepted" });
		await expect(posthogg.trackEvent("test_event", { foo: "bar" })).resolves.toBeUndefined();
	});

	it("trackLoad should noop when not enabled", async () => {
		const { posthogg } = await import("@/common/lib/posthog");
		await expect(posthogg.trackLoad()).resolves.toBeUndefined();
	});

	it("_getContext should return host and origin", async () => {
		const { posthogg } = await import("@/common/lib/posthog");
		const ctx = posthogg._getContext();
		expect(ctx).toHaveProperty("host");
		expect(ctx).toHaveProperty("origin");
		expect(typeof ctx.host).toBe("string");
	});
});

describe("posthog - isDevelopmentHost", () => {
	it("should treat current test host as non-PROD so tracking disabled", async () => {
		const mod = await import("@/common/lib/posthog");
		expect(mod.isTrackingAvailable).toBe(false);
	});
});
