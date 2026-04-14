import type { DictionaryData } from "./types";

const genders = ["masculino", "feminino", "neutro"];

function extractDefinitionData(html: string, word: string): Omit<DictionaryData, "title"> {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");

	const gender = doc.querySelector("tbody")?.innerHTML.match(new RegExp(`title='(?<gender>${genders.join("|")})'`))
		?.groups?.gender;
	const definitions = Array.from(doc.querySelectorAll("ol > li"))
		.map((el) => {
			const spans = el?.querySelectorAll("span.mw-cite-backlink");
			spans?.forEach((span) => span.remove());

			let definitionText = el?.textContent?.trim() || "";

			const subdefinitions = el?.querySelectorAll("ul > li") || el?.querySelectorAll("ol > li");
			if (subdefinitions?.length) {
				const subdefTexts = Array.from(subdefinitions)
					.map((subdef) => subdef.textContent?.trim())
					.filter(Boolean);

				if (subdefTexts.length) {
					definitionText = `${definitionText} §${subdefTexts.join("§")}`;
				}
			}

			return definitionText;
		})
		.filter((d) => d !== word)
		.filter((d, i, list) => list.indexOf(d) === i)
		.filter(Boolean) as string[];

	const wordClass = doc.querySelector("h2")?.textContent?.trim();

	const pronunciationEl = Array.from(doc.querySelectorAll("b")).find(
		(el) => el.innerHTML.includes("<u>") || el.innerHTML.includes("."),
	);
	const pronunciation = pronunciationEl?.textContent?.trim();

	const etymology = extractEtymology(doc);

	const translations: Record<string, string[]> = {};
	const translationsTable = doc.querySelector("table.traduções");
	if (translationsTable) {
		const rows = translationsTable.querySelectorAll("tr");
		rows.forEach((row) => {
			const langCell = row.querySelector("td");
			const words = row.querySelectorAll("td ~ td a");
			if (langCell && words.length > 0) {
				const lang = langCell.textContent?.trim().toLowerCase();
				const terms = Array.from(words)
					.map((a) => a.textContent?.trim())
					.filter(Boolean) as string[];
				if (lang) {
					translations[lang] = terms;
				}
			}
		});
	}

	const imgUrl = doc.querySelector("img")?.getAttribute("src") || undefined;
	const formattedTranslations = Object.keys(translations).length > 0 ? translations : undefined;

	return {
		wordClass,
		pronunciation,
		definitions,
		etymology,
		gender,
		imgUrl,
		translations: formattedTranslations,
	};
}

function extractEtymology(doc: Document): string | undefined {
	let etymology: string | undefined;

	const etymologyHeader = Array.from(doc.querySelectorAll("h2, h3")).find((el) =>
		el.textContent?.toLowerCase().includes("etimologia"),
	);

	if (etymologyHeader) {
		const node = etymologyHeader.parentElement?.nextElementSibling;
		etymology = node?.firstChild?.textContent?.trim();
	}

	return etymology;
}

async function fetchWiktionaryPageHTML(word: string): Promise<string | null> {
	const processedWord = word.toLowerCase().replace(/_/g, " ");
	const url = `https://pt.wiktionary.org/w/api.php?action=parse&redirects=1&
				 format=json&origin=*&page=${encodeURIComponent(processedWord)}&prop=text&formatversion=2`;
	try {
		const res = await fetch(url);
		if (!res.ok) return null;
		const data = await res.json();
		return data?.parse?.text || null;
	} catch (e) {
		console.error(e);
		return null;
	}
}

async function fetchSuggestedWord(word: string): Promise<string | null> {
	const processedWord = word.toLowerCase().replace(/_/g, " ");
	const searchUrl = `https://pt.wiktionary.org/w/rest.php/v1/search/title?
					   q=${encodeURIComponent(processedWord)}&limit=1`;
	try {
		const res = await fetch(searchUrl);
		if (!res.ok) return null;
		const json = await res.json();
		return json.pages?.[0]?.key || null;
	} catch (e) {
		console.error(e);
		return null;
	}
}

export async function getDictionaryData(word: string): Promise<Partial<DictionaryData> | null> {
	let html = await fetchWiktionaryPageHTML(word);
	let data = html ? extractDefinitionData(html, word) : null;

	if (!data?.definitions?.length) {
		const suggested = await fetchSuggestedWord(word);
		if (suggested && suggested !== word) {
			html = await fetchWiktionaryPageHTML(suggested);
			data = html ? extractDefinitionData(html, word) : null;
		}
	}

	return data;
}
