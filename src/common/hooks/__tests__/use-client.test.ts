import { renderHook } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { useClient } from "@/common/hooks/use-client";

describe("useClient", () => {
	it("should return true after the effect runs", async () => {
		const { result } = renderHook(() => useClient());
		await new Promise((resolve) => setTimeout(resolve, 0));
		expect(result.current).toBe(true);
	});
});
