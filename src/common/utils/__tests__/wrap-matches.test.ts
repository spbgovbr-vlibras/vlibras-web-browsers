import { h } from "preact";
import { describe, expect, it, vi } from "vitest";
import { wrapMatches } from "@/common/utils/wrap-matches";

const makeRenderFn = () => vi.fn((_text: string, _index: number) => h("span", {}, "rendered"));

describe("wrapMatches", () => {
	it("deve retornar array de VNodes quando não há matches", () => {
		const result = wrapMatches("hello world", []);
		expect(result).toHaveLength(1);
		expect(typeof result[0]).toBe("object");
	});

	it("deve envolver o texto correspondente com a função render", () => {
		const renderFn = makeRenderFn();
		const result = wrapMatches("hello world", [{ part: "world", render: renderFn }]);
		expect(result.length).toBe(3);
		expect(renderFn).toHaveBeenCalledWith("world", expect.any(Number));
	});

	it("deve escapar caracteres especiais de regex", () => {
		const renderFn = makeRenderFn();
		const result = wrapMatches("test (1+2)", [{ part: "(1+2)", render: renderFn }]);
		expect(result.length).toBeGreaterThan(0);
	});

	it("deve dividir o texto em partes baseadas nos matches", () => {
		const renderFn = makeRenderFn();
		const result = wrapMatches("abc", [{ part: "b", render: renderFn }]);
		expect(result.length).toBe(3);
	});

	it("deve renderizar cada ocorrência do match quando option once não é definido", () => {
		const renderFn = makeRenderFn();
		const result = wrapMatches("test test", [{ part: "test", render: renderFn }]);
		expect(result.length).toBe(5);
		expect(renderFn).toHaveBeenCalledTimes(2);
	});
});
