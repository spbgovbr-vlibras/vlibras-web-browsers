import type { ErrorCode } from "@/core/actions/messages";

export type RequestResponse = {
	success: boolean;
	error?: string;
	code?: ErrorCode;
};
