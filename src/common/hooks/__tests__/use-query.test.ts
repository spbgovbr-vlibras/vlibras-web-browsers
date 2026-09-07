import { renderHook, waitFor } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { useQuery } from "@/common/hooks/use-query";

describe("useQuery", () => {
	it("should return data after the query is resolved", async () => {
		const queryFn = vi.fn().mockResolvedValue({ data: "test" });
		const { result } = renderHook(() => useQuery({ queryKey: ["test-unique-a"], queryFn }));

		await waitFor(() => expect(result.current.data).toEqual({ data: "test" }));

		expect(result.current.data).toEqual({ data: "test" });
		expect(result.current.isLoading).toBe(false);
		expect(queryFn).toHaveBeenCalled();
	});

	it("should return an error when the query fails", async () => {
		const queryFn = vi.fn().mockRejectedValue(new Error("erro"));
		const { result } = renderHook(() => useQuery({ queryKey: ["test-unique-b"], queryFn }));

		await waitFor(() => expect(result.current.error).toBeInstanceOf(Error));

		expect(result.current.error?.message).toBe("erro");
	});

	it("should return selected data when select is provided", async () => {
		const queryFn = vi.fn().mockResolvedValue({ items: [1, 2, 3] });
		const select = vi.fn((data: { items: number[] }) => data.items.length);
		const { result } = renderHook(() => useQuery({ queryKey: ["test-unique-c"], queryFn, select }));

		await waitFor(() => expect(result.current.data).toBe(3));

		expect(select).toHaveBeenCalledWith({ items: [1, 2, 3] });
	});

	it("should respect enabled: false", () => {
		const queryFn = vi.fn();
		const { result } = renderHook(() => useQuery({ queryKey: ["test-unique-d"], queryFn, enabled: false }));

		expect(result.current.isLoading).toBe(false);
		expect(queryFn).not.toHaveBeenCalled();
		expect(result.current.data).toBeUndefined();
	});

	it("should refetch when the query key changes", async () => {
		const queryFn = vi.fn().mockResolvedValueOnce({ data: "first" }).mockResolvedValueOnce({ data: "second" });

		const { result, rerender } = renderHook(({ key }) => useQuery({ queryKey: [key], queryFn }), {
			initialProps: { key: "test-key-change-1" },
		});

		await waitFor(() => expect(result.current.data).toEqual({ data: "first" }));

		rerender({ key: "test-key-change-2" });

		await waitFor(() => expect(result.current.data).toEqual({ data: "second" }));
		expect(queryFn).toHaveBeenCalledTimes(2);
	});
});
