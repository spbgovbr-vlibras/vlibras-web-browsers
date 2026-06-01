import { useAccessWrapperSync } from "./use-access-wrapper-sync";
import { usePlayerSync } from "./use-player-sync";
import { useRootStatusSync } from "./use-root-status-sync";
import { useTextCaptureSync } from "./use-text-capture-sync";
import { useWindowSyncProvider } from "./use-window-sync";

export const SyncProvider = () => {
	useTextCaptureSync();
	usePlayerSync();
	useRootStatusSync();
	useAccessWrapperSync();
	useWindowSyncProvider();

	return null;
};
