import { usePlayerSync } from "./use-player-sync";
import { useRootStatusSync } from "./use-root-status-sync";
import { useScreenSync } from "./use-screen-sync";
import { useTextCaptureSync } from "./use-text-capture-sync";

export const SyncProvider = () => {
	useTextCaptureSync();
	usePlayerSync();
	useScreenSync();
	useRootStatusSync();

	return null;
};
