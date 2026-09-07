import { act, renderHook } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { create } from "zustand";
import { useOmit, usePick } from "@/common/hooks/use-shallow";

type Sample = { a: number; b: number; c: number };

const useSample = create<Sample>()(() => ({ a: 1, b: 2, c: 3 }));

describe("usePick", () => {
	it("should select only the specified keys", () => {
		const { result } = renderHook(() => useSample(usePick<Sample, "a" | "c">("a", "c")));

		expect(result.current).toEqual({ a: 1, c: 3 });
	});

	it("should keep the selection stable when an unrelated field changes", () => {
		const { result } = renderHook(() => useSample(usePick<Sample, "a">("a")));
		const first = result.current;

		act(() => {
			useSample.setState({ b: 99 });
		});

		expect(result.current).toBe(first);
		expect(result.current).toEqual({ a: 1 });
	});
});

describe("useOmit", () => {
	it("should remove only the specified keys", () => {
		const { result } = renderHook(() => useSample(useOmit<Sample, "b">("b")));

		expect(result.current).toEqual({ a: 1, c: 3 });
	});
});
