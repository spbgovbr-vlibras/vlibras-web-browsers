import { afterEach, describe, expect, it, vi } from "vitest";
import {
	extractDefinitionData,
	extractMainLiText,
	getDictionaryData,
	sanitizeWikiText,
} from "@/widget/screens/dictionary/lib/wiktionary";

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe("sanitizeWikiText", () => {
	it("should return an empty string for empty input", () => {
		expect(sanitizeWikiText("")).toBe("");
	});

	it("should remove HTML tags and style/script blocks", () => {
		expect(sanitizeWikiText("<style>.a{color:red}</style><b>casa</b><script>evil()</script>")).toBe("casa");
	});

	it("should remove citation markers like [1]", () => {
		expect(sanitizeWikiText("moradia [1] [carece de fontes]")).toBe("moradia");
	});

	it("should normalize whitespace", () => {
		expect(sanitizeWikiText("  casa\n\tgrande  ")).toBe("casa grande");
	});

	it("should decode HTML entities", () => {
		expect(sanitizeWikiText("p&atilde;o")).toBe("pão");
	});
});

describe("extractMainLiText", () => {
	it("should remove nested subdefinitions from the text", () => {
		document.body.innerHTML = "<ol><li>moradia<ul><li>casebre</li></ul></li></ol>";
		const li = document.querySelector("li") as Element;

		expect(extractMainLiText(li)).toBe("moradia");
	});

	it("should remove references and inline style blocks", () => {
		document.body.innerHTML = '<ol><li>moradia<style>.x{}</style><sup class="reference">[1]</sup></li></ol>';
		const li = document.querySelector("li") as Element;

		expect(extractMainLiText(li)).toBe("moradia");
	});
});

describe("extractDefinitionData", () => {
	const html = `
		<html><body>
			<h2>Substantivo</h2>
			<ol>
				<li>moradia</li>
				<li>lar<ul><li>residência</li></ul></li>
				<li>casa</li>
			</ol>
			<table class="traduções">
				<tr><td>Espanhol</td><td><a>casa</a></td></tr>
			</table>
			<img src="https://exemplo.com/casa.png" />
		</body></html>
	`;

	it("should extract unique definitions without repeating the entry", () => {
		const data = extractDefinitionData(html, "casa");

		expect(data.definitions).toEqual(["moradia", "lar §residência"]);
	});

	it("should extract word class, translations, and image", () => {
		const data = extractDefinitionData(html, "casa");

		expect(data.wordClass).toBe("Substantivo");
		expect(data.translations).toEqual({ espanhol: ["casa"] });
		expect(data.imgUrl).toBe("https://exemplo.com/casa.png");
	});

	it("should return an empty definitions array when the HTML has no list", () => {
		const data = extractDefinitionData("<html><body><h2>X</h2></body></html>", "casa");

		expect(data.definitions).toEqual([]);
	});
});

describe("getDictionaryData", () => {
	it("should return the data when the page exists", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({ parse: { text: "<html><body><ol><li>moradia</li></ol></body></html>" } }),
			}),
		);

		const data = await getDictionaryData("casa");

		expect(data?.definitions).toEqual(["moradia"]);
	});

	it("should try the suggested word when there are no definitions", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce({ ok: true, json: async () => ({ parse: { text: "<html></html>" } }) })
			.mockResolvedValueOnce({ ok: true, json: async () => ({ pages: [{ key: "casar" }] }) })
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ parse: { text: "<html><body><ol><li>unir</li></ol></body></html>" } }),
			});
		vi.stubGlobal("fetch", fetchMock);

		const data = await getDictionaryData("caza");

		expect(data?.definitions).toEqual(["unir"]);
		expect(fetchMock).toHaveBeenCalledTimes(3);
	});

	it("should return null when the API fails", async () => {
		vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("rede")));
		vi.spyOn(console, "error").mockImplementation(() => {});

		await expect(getDictionaryData("casa")).resolves.toBeNull();
	});
});
