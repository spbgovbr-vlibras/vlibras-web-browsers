import { render } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { SyncProvider } from "@/widget/providers/sync";

const useAccessWrapperSync = vi.fn();
const useMobileQuerySync = vi.fn();
const usePlayerIdleTeardown = vi.fn();
const useRootSync = vi.fn();
const useSubtitleSync = vi.fn();
const useTabVisibilitySync = vi.fn();
const useTextCaptureSync = vi.fn();
const useWindowSyncProvider = vi.fn();

vi.mock("../use-access-wrapper-sync", () => ({ useAccessWrapperSync: () => useAccessWrapperSync() }));
vi.mock("../use-mobile-query-sync", () => ({ useMobileQuerySync: () => useMobileQuerySync() }));
vi.mock("../use-player-idle-teardown", () => ({ usePlayerIdleTeardown: () => usePlayerIdleTeardown() }));
vi.mock("../use-root-sync", () => ({ useRootSync: () => useRootSync() }));
vi.mock("../use-subtitle-sync", () => ({ useSubtitleSync: () => useSubtitleSync() }));
vi.mock("../use-tab-visibility-sync", () => ({ useTabVisibilitySync: () => useTabVisibilitySync() }));
vi.mock("../use-text-capture-sync", () => ({ useTextCaptureSync: () => useTextCaptureSync() }));
vi.mock("../use-window-sync", () => ({ useWindowSyncProvider: () => useWindowSyncProvider() }));

describe("SyncProvider", () => {
	it("should invoke every sync hook exactly once", () => {
		render(<SyncProvider />);

		expect(useTextCaptureSync).toHaveBeenCalledOnce();
		expect(useAccessWrapperSync).toHaveBeenCalledOnce();
		expect(useWindowSyncProvider).toHaveBeenCalledOnce();
		expect(useTabVisibilitySync).toHaveBeenCalledOnce();
		expect(useMobileQuerySync).toHaveBeenCalledOnce();
		expect(useSubtitleSync).toHaveBeenCalledOnce();
		expect(useRootSync).toHaveBeenCalledOnce();
		expect(usePlayerIdleTeardown).toHaveBeenCalledOnce();
	});

	it("should render nothing", () => {
		const { container } = render(<SyncProvider />);
		expect(container.firstChild).toBeNull();
	});
});
