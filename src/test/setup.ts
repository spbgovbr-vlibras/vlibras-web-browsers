import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

if (typeof window.matchMedia === "undefined") {
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		value: vi.fn().mockReturnValue({
			matches: false,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		}),
	});
}
