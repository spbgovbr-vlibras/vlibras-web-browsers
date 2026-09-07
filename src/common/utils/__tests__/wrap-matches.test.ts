import { h } from "preact";
import { describe, expect, it, vi } from "vitest";
import { wrapMatches } from "@/common/utils/wrap-matches";

const makeRenderFn = () => vi.fn((_text: string, _index: number) => h("span", {}, "rendered"));

describe("wrapMatches", () => {
	it("should return an array of VNodes when there are no matches", () => {
		const result = wrapMatches("hello world", []);
		expect(result).toHaveLength(1);
		expect(typeof result[0]).toBe("object");
	});

	it("should wrap the matching text with the render function", () => {
		const renderFn = makeRenderFn();
		const result = wrapMatches("hello world", [{ part: "world", render: renderFn }]);
		expect(result.length).toBe(3);
		expect(renderFn).toHaveBeenCalledWith("world", expect.any(Number));
	});

	it("should escape regex special characters", () => {
		const renderFn = makeRenderFn();
		const result = wrapMatches("test (1+2)", [{ part: "(1+2)", render: renderFn }]);
		expect(result.length).toBeGreaterThan(0);
	});

	it("should split the text into parts based on the matches", () => {
		const renderFn = makeRenderFn();
		const result = wrapMatches("abc", [{ part: "b", render: renderFn }]);
		expect(result.length).toBe(3);
	});

	it("should render each occurrence of the match when once is not set", () => {
		const renderFn = makeRenderFn();
		const result = wrapMatches("test test", [{ part: "test", render: renderFn }]);
		expect(result.length).toBe(5);
		expect(renderFn).toHaveBeenCalledTimes(2);
	});
});
