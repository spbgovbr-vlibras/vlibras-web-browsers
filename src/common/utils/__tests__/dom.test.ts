import { beforeEach, describe, expect, it } from "vitest";
import { $, $$ } from "@/common/utils/dom";

beforeEach(() => {
	document.body.innerHTML = "";
});

describe("$", () => {
	it("deve encontrar o elemento pelo seletor", () => {
		document.body.innerHTML = '<div id="alvo">oi</div>';

		expect($<HTMLDivElement>("#alvo")?.textContent).toBe("oi");
	});

	it("deve retornar nulo quando não encontra", () => {
		expect($<HTMLDivElement>("#ausente")).toBeNull();
	});

	it("deve buscar dentro do escopo informado", () => {
		document.body.innerHTML =
			'<div id="fora"><span class="x">fora</span></div><div id="dentro"><span class="x">dentro</span></div>';
		const scope = document.querySelector("#dentro") as HTMLElement;

		expect($<HTMLSpanElement>(".x", scope)?.textContent).toBe("dentro");
	});
});

describe("$$", () => {
	it("deve retornar todos os elementos correspondentes", () => {
		document.body.innerHTML = '<p class="item">a</p><p class="item">b</p>';

		expect($$<HTMLParagraphElement>(".item")?.map((el) => el.textContent)).toEqual(["a", "b"]);
	});

	it("deve retornar lista vazia quando não encontra", () => {
		expect($$<HTMLParagraphElement>(".ausente")).toEqual([]);
	});

	it("deve buscar dentro do escopo informado", () => {
		document.body.innerHTML =
			'<div id="a"><i class="y">1</i></div><div id="b"><i class="y">2</i><i class="y">3</i></div>';
		const scope = document.querySelector("#b") as HTMLElement;

		expect($$<HTMLElement>(".y", scope)).toHaveLength(2);
	});
});
