import { act, renderHook } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { useQuery } from "@/common/hooks/use-query";

describe("useQuery", () => {
	it("deve retornar data após a query ser resolvida", async () => {
		const queryFn = vi.fn().mockResolvedValue({ data: "test" });
		const { result } = renderHook(() => useQuery({ queryKey: ["test-unique-a"], queryFn }));

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		expect(result.current.data).toEqual({ data: "test" });
		expect(result.current.isLoading).toBe(false);
		expect(queryFn).toHaveBeenCalled();
	});

	it("deve retornar error quando a query falha", async () => {
		const queryFn = vi.fn().mockRejectedValue(new Error("erro"));
		const { result } = renderHook(() => useQuery({ queryKey: ["test-unique-b"], queryFn }));

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		expect(result.current.error).toBeInstanceOf(Error);
		expect(result.current.error?.message).toBe("erro");
	});

	it("deve retornar data selecionada quando select é fornecido", async () => {
		const queryFn = vi.fn().mockResolvedValue({ items: [1, 2, 3] });
		const select = vi.fn((data: { items: number[] }) => data.items.length);
		const { result } = renderHook(() => useQuery({ queryKey: ["test-unique-c"], queryFn, select }));

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		expect(result.current.data).toBe(3);
		expect(select).toHaveBeenCalledWith({ items: [1, 2, 3] });
	});

	it("deve respeitar enabled: false", () => {
		const queryFn = vi.fn();
		const { result } = renderHook(() => useQuery({ queryKey: ["test-unique-d"], queryFn, enabled: false }));

		expect(result.current.isLoading).toBe(false);
		expect(queryFn).not.toHaveBeenCalled();
		expect(result.current.data).toBeUndefined();
	});

	it("deve retornar data nova em query com key diferente", async () => {
		const queryFn = vi.fn().mockResolvedValue({ data: "v2" });
		const { result } = renderHook(() => useQuery({ queryKey: ["test-unique-e-v2"], queryFn }));

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		expect(result.current.data).toEqual({ data: "v2" });
		expect(queryFn).toHaveBeenCalled();
	});
});
