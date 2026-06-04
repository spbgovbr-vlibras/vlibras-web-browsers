import { useAccessWrapperSync } from "./use-access-wrapper-sync";
import { useMobileQuerySync } from "./use-mobile-query-sync";
import { useRootStatusSync } from "./use-root-status-sync";
import { useTextCaptureSync } from "./use-text-capture-sync";
import { useWindowSyncProvider } from "./use-window-sync";

export const SyncProvider = () => {
	useTextCaptureSync();
	useRootStatusSync();
	useAccessWrapperSync();
	useWindowSyncProvider();
	useMobileQuerySync();

	return null;
};
