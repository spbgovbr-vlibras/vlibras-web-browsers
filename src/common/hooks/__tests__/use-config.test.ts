import { renderHook } from "@testing-library/preact";
import { beforeEach, describe, expect, it } from "vitest";
import { appConfig, useConfig } from "@/common/hooks/use-config";

describe("useConfig", () => {
	beforeEach(() => {
		appConfig.setState({ path: "", version: "" });
		delete (window as unknown as Record<string, unknown>).VLibrasWidget;
	});

	it("should fill the default path and version on mount", () => {
		const { result } = renderHook(() => useConfig());

		expect(result.current.path).toBe("./");
		expect(result.current.version).toBe("0.0.0-test");
		expect(appConfig.getState().path).toBe("./");
	});

	it("should use the host widget path when available", () => {
		(window as unknown as Record<string, unknown>).VLibrasWidget = { path: "https://cdn/" };

		const { result } = renderHook(() => useConfig());

		expect(result.current.path).toBe("https://cdn/");
	});

	it("should keep the state when it is already filled", () => {
		appConfig.setState({ path: "fixed/", version: "9.9.9" });

		const { result } = renderHook(() => useConfig());

		expect(result.current.path).toBe("fixed/");
		expect(result.current.version).toBe("9.9.9");
	});
});
