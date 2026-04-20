import { useDialogSync } from "./use-dialog-sync";
import { usePlayerSync } from "./use-player-sync";
import { useRootStatusSync } from "./use-root-status-sync";
import { useScreenSync } from "./use-screen-sync";
import { useTextCapture } from "./use-text-capture";

export const SyncProvider = () => {
	useTextCapture();
	usePlayerSync();
	useScreenSync();
	useRootStatusSync();
	useDialogSync();

	return null;
};
