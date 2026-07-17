import { useAccessWrapperSync } from "./use-access-wrapper-sync";
import { useMobileQuerySync } from "./use-mobile-query-sync";
import { useRootSync } from "./use-root-sync";
import { useSubtitleSync } from "./use-subtitle-sync";
import { useTextCaptureSync } from "./use-text-capture-sync";
import { useWindowSyncProvider } from "./use-window-sync";

export const SyncProvider = () => {
	useTextCaptureSync();
	useAccessWrapperSync();
	useWindowSyncProvider();
	useMobileQuerySync();
	useSubtitleSync();
	useRootSync();

	return null;
};
