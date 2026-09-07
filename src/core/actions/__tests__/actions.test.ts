import { afterEach, describe, expect, it, vi } from "vitest";
import { getSigns, sendFeedback, translate } from "@/core/actions";
import { ERROR_MESSAGES } from "@/core/actions/messages";
import { config } from "@/core/config";

function deferred<T>() {
	let resolve!: (value: T) => void;
	let reject!: (reason?: unknown) => void;
	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});
	return { promise, resolve, reject };
}

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe("translate", () => {
	it("should return the text when the API responds with plain text", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, text: async () => "glosa-exemplo" }));

		await expect(translate("casa")).resolves.toEqual({ data: "glosa-exemplo", success: true });
	});

	it("should extract the traducao field when the API responds with JSON", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ ok: true, text: async () => JSON.stringify({ traducao: "glosa" }) }),
		);

		await expect(translate("casa")).resolves.toEqual({ data: "glosa", success: true });
	});

	it("should send a POST with the text and configured timeout", async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => "x" });
		vi.stubGlobal("fetch", fetchMock);

		await translate("casa");

		expect(fetchMock).toHaveBeenCalledWith(
			config.TRANSLATE_URL,
			expect.objectContaining({ method: "POST", body: JSON.stringify({ text: "casa" }) }),
		);
	});

	it("should return a translation error when the API responds with a failure", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
		vi.spyOn(console, "error").mockImplementation(() => {});

		await expect(translate("casa")).resolves.toEqual({
			success: false,
			error: ERROR_MESSAGES.TRANSLATION_ERROR,
			code: "TRANSLATION_ERROR",
		});
	});

	it("should return a timeout error when the request is aborted", async () => {
		const abortError = new Error("abort");
		abortError.name = "AbortError";
		vi.stubGlobal("fetch", vi.fn().mockRejectedValue(abortError));
		vi.spyOn(console, "error").mockImplementation(() => {});

		await expect(translate("casa")).resolves.toEqual({
			success: false,
			error: ERROR_MESSAGES.TRANSLATION_TIMEOUT_ERROR,
			code: "TRANSLATION_TIMEOUT_ERROR",
		});
	});

	it("should invalidate the previous translation when a newer one arrives", async () => {
		const first = deferred<{ ok: boolean; text: () => Promise<string> }>();
		const fetchMock = vi
			.fn()
			.mockReturnValueOnce(first.promise)
			.mockResolvedValue({ ok: true, text: async () => "nova" });
		vi.stubGlobal("fetch", fetchMock);

		const pending = translate("primeira");
		const latest = translate("segunda");
		first.resolve({ ok: true, text: async () => "antiga" });

		await expect(pending).resolves.toEqual({
			success: false,
			error: ERROR_MESSAGES.TRANSLATION_SUPERSEDED_ERROR,
			code: "TRANSLATION_SUPERSEDED_ERROR",
		});
		await expect(latest).resolves.toEqual({ data: "nova", success: true });
	});
});

describe("getSigns", () => {
	it("should return the signs tree when the API responds ok", async () => {
		const root = { root: { children: {}, end: false } };
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => root }));

		await expect(getSigns()).resolves.toEqual({ data: root, success: true });
	});

	it("should return a signs error when the API fails", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
		vi.spyOn(console, "error").mockImplementation(() => {});

		await expect(getSigns()).resolves.toEqual({
			success: false,
			error: ERROR_MESSAGES.SIGNS_ERROR,
			code: "SIGNS_ERROR",
		});
	});

	it("should return a timeout error when the request is aborted", async () => {
		const abortError = new Error("abort");
		abortError.name = "AbortError";
		vi.stubGlobal("fetch", vi.fn().mockRejectedValue(abortError));
		vi.spyOn(console, "error").mockImplementation(() => {});

		await expect(getSigns()).resolves.toEqual({
			success: false,
			error: ERROR_MESSAGES.SIGNS_TIMEOUT_ERROR,
			code: "SIGNS_TIMEOUT_ERROR",
		});
	});
});

describe("sendFeedback", () => {
	const input = { text: "casa", translation: "glosa", review: "good", rating: "good" as const };

	it("should return success when the API responds ok", async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true });
		vi.stubGlobal("fetch", fetchMock);

		await expect(sendFeedback(input)).resolves.toEqual({ success: true });
		expect(fetchMock).toHaveBeenCalledWith(
			config.REVIEW_URL,
			expect.objectContaining({ method: "POST", body: JSON.stringify(input) }),
		);
	});

	it("should return a send error when the API fails", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
		vi.spyOn(console, "error").mockImplementation(() => {});

		await expect(sendFeedback(input)).resolves.toEqual({
			success: false,
			error: ERROR_MESSAGES.SEND_REVIEW_ERROR,
			code: "SEND_REVIEW_ERROR",
		});
	});

	it("should return a timeout error when the request is aborted", async () => {
		const abortError = new Error("abort");
		abortError.name = "AbortError";
		vi.stubGlobal("fetch", vi.fn().mockRejectedValue(abortError));
		vi.spyOn(console, "error").mockImplementation(() => {});

		await expect(sendFeedback(input)).resolves.toEqual({
			success: false,
			error: ERROR_MESSAGES.SEND_REVIEW_TIMEOUT_ERROR,
			code: "SEND_REVIEW_TIMEOUT_ERROR",
		});
	});
});
