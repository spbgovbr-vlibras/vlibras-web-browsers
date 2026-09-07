import { beforeEach, describe, expect, it } from "vitest";
import { consentStore, useConsentStore } from "@/widget/stores/use-consent.store";

describe("useConsentStore", () => {
	beforeEach(() => {
		localStorage.clear();
		useConsentStore.setState({ status: "pending" });
	});

	it("should start with a pending status", () => {
		expect(consentStore.get().status).toBe("pending");
	});

	it("should accept the consent", () => {
		consentStore.get().accept();
		expect(consentStore.get().status).toBe("accepted");
	});

	it("should decline the consent", () => {
		consentStore.get().decline();
		expect(consentStore.get().status).toBe("declined");
	});

	it("should persist the status in localStorage", () => {
		consentStore.get().accept();
		expect(localStorage.getItem("@vlibras-consent")).toContain("accepted");
	});
});
