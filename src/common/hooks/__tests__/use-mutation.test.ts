import { act, renderHook } from "@testing-library/preact";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useMutation } from "@/common/hooks/use-mutation";

describe("useMutation", () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it("should execute mutationFn when mutateAsync is called", async () => {
		const mutationFn = vi.fn().mockResolvedValue({ data: "result" });
		const { result } = renderHook(() => useMutation({ mutationFn }));

		let returnedData: unknown;
		let returnedError: Error | null = null;

		await act(async () => {
			try {
				returnedData = await result.current.mutateAsync("input");
			} catch (err) {
				returnedError = err as Error;
			}
		});

		expect(mutationFn).toHaveBeenCalledWith("input");
		expect(returnedData).toEqual({ data: "result" });
		expect(returnedError).toBeNull();
	});

	it("should return an error when the mutation fails", async () => {
		const mutationFn = vi.fn().mockRejectedValue(new Error("falha"));
		const { result } = renderHook(() => useMutation({ mutationFn }));

		let thrownError: Error | null = null;
		await act(async () => {
			try {
				await result.current.mutateAsync("input");
			} catch (err) {
				thrownError = err as Error;
			}
		});

		expect(thrownError).toBeInstanceOf(Error);
		expect((thrownError as Error | null)?.message).toBe("falha");
		expect(result.current.error).toBeInstanceOf(Error);
	});

	it("should call onMutate before execution", async () => {
		const onMutate = vi.fn();
		const mutationFn = vi.fn().mockResolvedValue({ data: "result" });
		const { result } = renderHook(() => useMutation({ mutationFn, onMutate }));

		await act(async () => {
			await result.current.mutateAsync("input");
		});

		expect(onMutate).toHaveBeenCalledWith("input");
	});

	it("should call onSettled after execution", async () => {
		const onSettled = vi.fn();
		const mutationFn = vi.fn().mockResolvedValue({ data: "result" });
		const { result } = renderHook(() => useMutation({ mutationFn, onSettled }));

		await act(async () => {
			await result.current.mutateAsync("input");
		});

		expect(onSettled).toHaveBeenCalledWith({ data: "result" }, null, "input");
	});

	it("should have isPending as true during execution", async () => {
		let resolvePromise: ((value: unknown) => void) | undefined;
		const mutationFn = vi.fn(
			() =>
				new Promise((resolve) => {
					resolvePromise = resolve;
				}),
		);
		const { result } = renderHook(() => useMutation<unknown, string>({ mutationFn }));

		await act(async () => {
			result.current.mutateAsync("input");
		});

		expect(result.current.isPending).toBe(true);

		await act(async () => {
			resolvePromise?.({ data: "result" });
		});

		expect(result.current.isPending).toBe(false);
	});
});
