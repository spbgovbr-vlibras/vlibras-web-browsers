import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "@/common/hooks/use-theme";

describe("useTheme", () => {
	beforeEach(() => {
		localStorage.clear();
		useTheme.setState({ theme: "light" });
	});

	it("should start with the light theme", () => {
		expect(useTheme.getState().theme).toBe("light");
	});

	it("should toggle between light and dark", () => {
		useTheme.getState().toggleTheme();
		expect(useTheme.getState().theme).toBe("dark");

		useTheme.getState().toggleTheme();
		expect(useTheme.getState().theme).toBe("light");
	});

	it("should set the theme and persist it in localStorage", () => {
		useTheme.getState().setTheme("dark");

		expect(useTheme.getState().theme).toBe("dark");
		expect(localStorage.getItem("@vlibras-theme")).toBe("dark");
	});

	it("should ignore an invalid stored theme", async () => {
		localStorage.setItem("@vlibras-theme", "rosa");
		vi.resetModules();
		const { useTheme: fresh } = await import("@/common/hooks/use-theme");

		expect(fresh.getState().theme).toBe("light");
	});
});
