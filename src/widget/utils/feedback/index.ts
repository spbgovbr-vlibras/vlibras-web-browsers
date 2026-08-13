import { appConfig } from "@/common/hooks/use-config";
import { toast } from "@/common/lib/toaster";
import { playStatic } from "@/player/actions";
import { widgetStore } from "@/widget/stores/use-widget.store";

export const onFeedbackSuccess = () => {
	playStatic("OBRIGADO", `${appConfig.getState().path}/assets/bundles/`);
	toast("Agradecemos sua contribuição!", { variant: "primary", className: "font-semibold" });

	widgetStore.set({ text: undefined });
};

export const onFeedbackError = (error: Error) => {
	if (error.message) toast(error.message, { variant: "destructive" });
};
