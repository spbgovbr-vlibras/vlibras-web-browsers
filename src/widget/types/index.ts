import type { ErrorCode } from "@/widget/actions/messages";

export type WidgetPosition =
	| "top"
	| "right"
	| "bottom"
	| "left"
	| "top-left"
	| "top-right"
	| "bottom-left"
	| "bottom-right";

export type RequestResponse = {
	success: boolean;
	error?: string;
	code?: ErrorCode;
};
