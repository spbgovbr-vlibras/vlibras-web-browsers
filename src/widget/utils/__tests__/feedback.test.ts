import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/player/actions", () => ({ playStatic: vi.fn() }));
vi.mock("@/common/lib/toaster", () => ({ toast: vi.fn() }));
vi.mock("@/common/hooks/use-config", () => ({
	appConfig: { getState: () => ({ path: "https://cdn.example.com" }) },
}));

import { toast } from "@/common/lib/toaster";
import { playStatic } from "@/player/actions";
import type { WidgetStoreState } from "@/widget/stores/use-widget.store";
import { widgetStore } from "@/widget/stores/use-widget.store";
import { onFeedbackSuccess } from "@/widget/utils/feedback";

describe("onFeedbackSuccess", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		widgetStore.set({ text: "algo para traduzir" } as Partial<WidgetStoreState>);
	});

	it("should play OBRIGADO with bundle path, toast primary, clear text", () => {
		onFeedbackSuccess();
		expect(playStatic).toHaveBeenCalledWith("OBRIGADO", "https://cdn.example.com/assets/bundles/");
		expect(toast).toHaveBeenCalledWith(
			"Agradecemos sua contribuição!",
			expect.objectContaining({ variant: "primary" }),
		);
		expect(widgetStore.get().text).toBeUndefined();
	});
});
