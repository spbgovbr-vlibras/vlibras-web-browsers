import { zusContext } from "@/common/lib/zus-context";

export const { Provider: SettingsProvider, useCtx: useSettingsCtx } = zusContext<{
	onOpen: () => void;
	onClose: () => void;
}>();
