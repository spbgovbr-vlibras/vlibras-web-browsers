import type { ErrorCode } from "@/core/actions/messages";

export type RequestResponse<TData> = {
	data?: TData;
	success: boolean;
	error?: string;
	code?: ErrorCode;
};
