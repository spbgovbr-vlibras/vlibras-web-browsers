import { renderHook, waitFor } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import * as actions from "@/core/actions";
import { useSendFeedback, useTranslateRequest } from "@/core/actions/hooks";

describe("core/actions/hooks", () => {
	it("useSendFeedback should return true on success", async () => {
		vi.spyOn(actions, "sendFeedback").mockResolvedValue({ success: true });
		const { result } = renderHook(() => useSendFeedback());
		const val = await result.current.mutateAsync({ text: "a", translation: "b", review: "c", rating: "good" });
		expect(val).toBe(true);
		vi.mocked(actions.sendFeedback).mockRestore();
	});

	it("useSendFeedback should throw on error", async () => {
		vi.spyOn(actions, "sendFeedback").mockResolvedValue({
			success: false,
			error: "fail",
		});
		const { result } = renderHook(() => useSendFeedback());
		await expect(
			result.current.mutateAsync({ text: "a", translation: "b", review: "c", rating: "good" }),
		).rejects.toThrow("fail");
		vi.mocked(actions.sendFeedback).mockRestore();
	});

	it("useTranslateRequest should return undefined for superseded", async () => {
		vi.spyOn(actions, "translate").mockResolvedValue({
			success: false,
			code: "TRANSLATION_SUPERSEDED_ERROR",
		});
		const { result } = renderHook(() => useTranslateRequest());
		const val = await result.current.mutateAsync("ola");
		expect(val).toBeUndefined();
		vi.mocked(actions.translate).mockRestore();
	});

	it("useTranslateRequest should log and return undefined on error", async () => {
		const spy = vi.spyOn(console, "error").mockImplementation(() => {});
		vi.spyOn(actions, "translate").mockResolvedValue({
			success: false,
			error: "some error",
			data: undefined,
		});
		const { result } = renderHook(() => useTranslateRequest());
		const val = await result.current.mutateAsync("ola");
		expect(val).toBeUndefined();
		expect(spy).toHaveBeenCalled();
		spy.mockRestore();
		vi.mocked(actions.translate).mockRestore();
	});

	it("useTranslateRequest should call onMutate/onSettled passthrough", async () => {
		vi.spyOn(actions, "translate").mockResolvedValue({ success: true, data: "GLOSS" });
		const onMutate = vi.fn();
		const onSettled = vi.fn();
		const { result } = renderHook(() => useTranslateRequest({ onMutate, onSettled }));
		await result.current.mutateAsync("ola");
		expect(onMutate).toHaveBeenCalledWith("ola");
		await waitFor(() => expect(onSettled).toHaveBeenCalled(), { timeout: 1000 });
		vi.mocked(actions.translate).mockRestore();
	});
});
