import { describe, expect, it } from "vitest";
import { capitalize, delay, omit, pick, randomStr, sanitizeUrl } from "@/common/utils";

describe("omit", () => {
	it("deve remover as chaves especificadas do objeto", () => {
		const obj = { a: 1, b: 2, c: 3 };
		expect(omit(obj, "a", "c")).toEqual({ b: 2 });
	});

	it("deve retornar uma cópia sem modificar o original", () => {
		const obj = { a: 1, b: 2 };
		omit(obj, "a");
		expect(obj).toEqual({ a: 1, b: 2 });
	});

	it("deve retornar o objeto vazio quando todas as chaves são removidas", () => {
		const obj = { a: 1 };
		expect(omit(obj, "a")).toEqual({});
	});

	it("deve retornar o objeto original quando nenhuma chave é especificada", () => {
		const obj = { a: 1, b: 2 };
		expect(omit(obj)).toEqual({ a: 1, b: 2 });
	});
});

describe("pick", () => {
	it("deve selecionar apenas as chaves especificadas do objeto", () => {
		const obj = { a: 1, b: 2, c: 3 };
		expect(pick(obj, "a", "c")).toEqual({ a: 1, c: 3 });
	});

	it("deve retornar um objeto vazio quando nenhuma chave é especificada", () => {
		const obj = { a: 1 };
		expect(pick(obj)).toEqual({});
	});
});

describe("capitalize", () => {
	it("deve capitalizar a primeira letra de cada palavra", () => {
		expect(capitalize("hello world")).toBe("Hello World");
	});

	it("deve funcionar com uma única palavra", () => {
		expect(capitalize("hello")).toBe("Hello");
	});

	it("deve lidar com strings vazias", () => {
		expect(capitalize("")).toBe("");
	});

	it("deve capitalizar palavras já capitalizadas sem quebrar", () => {
		expect(capitalize("Hello World")).toBe("Hello World");
	});
});

describe("delay", () => {
	it("deve resolver após o tempo especificado", async () => {
		const start = Date.now();
		await delay(50);
		const elapsed = Date.now() - start;
		expect(elapsed).toBeGreaterThanOrEqual(45);
	});
});

describe("sanitizeUrl", () => {
	it("deve normalizar URLs com protocolo removendo barras duplicadas", () => {
		expect(sanitizeUrl("https://example.com/path//to//file")).toBe("https://example.com/path/to/file");
	});

	it("deve retornar a mesma string quando não há protocolo", () => {
		expect(sanitizeUrl("example.com")).toBe("example.com");
	});

	it("deve retornar string vazia para entrada vazia", () => {
		expect(sanitizeUrl("")).toBe("");
	});
});

describe("randomStr", () => {
	it("deve gerar uma string com pelo menos 6 caracteres", () => {
		const result = randomStr();
		expect(result.length).toBeGreaterThanOrEqual(6);
	});

	it("deve gerar strings diferentes em chamadas distintas", () => {
		const results = new Set([randomStr(), randomStr(), randomStr()]);
		expect(results.size).toBeGreaterThan(1);
	});
});
