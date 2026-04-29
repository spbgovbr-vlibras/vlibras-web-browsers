import { useAccessWrapperSync } from "./use-access-wrapper-sync";
import { usePlayerSync } from "./use-player-sync";
import { useRootStatusSync } from "./use-root-status-sync";
import { useScreenSync } from "./use-screen-sync";
import { useTextCaptureSync } from "./use-text-capture-sync";

export const SyncProvider = () => {
	useTextCaptureSync();
	usePlayerSync();
	useScreenSync();
	useRootStatusSync();
	useAccessWrapperSync();

	return null;
};
