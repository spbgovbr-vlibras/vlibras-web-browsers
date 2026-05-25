import { conjugationOrder, prefixMap, suffixMap, verbRegex } from "./constants";
import type { VerbGroup } from "./types";

export type SignGroup = {
	base: string;
	variants: string[];
	hasBase: boolean;
};

export function groupByBase(signs: string[]): SignGroup[] {
	const map = new Map<string, SignGroup>();

	for (const sign of signs) {
		const base = sign.includes("&") ? sign.split("&", 1)[0] : sign;

		if (!map.has(base)) {
			map.set(base, { base, variants: [], hasBase: false });
		}

		const group = map.get(base)!;
		if (sign.includes("&")) {
			group.variants.push(sign);
		} else {
			group.hasBase = true;
		}
	}

	return Array.from(map.values());
}

export function groupVerbs(signs: string[]): Record<string, VerbGroup> {
	const acc: Record<string, VerbGroup> = {};

	for (const sign of signs) {
		const baseVerb = sign.includes("&") ? sign.split("&", 1)[0] : (sign.match(verbRegex)?.[2] ?? sign);
		acc[baseVerb] ??= { conjugation: [], desambiguation: [] };

		if (sign.includes("&")) {
			acc[baseVerb].desambiguation.push(sign);
		} else {
			const match = sign.match(verbRegex);
			if (match) {
				const prefix = match[1] ?? "";
				const verb = match[2];
				const suffix = match[3] ?? "";
				const prefixText = prefixMap[prefix] ?? "";
				const suffixText = suffixMap[suffix] ?? "";

				if (prefixText && suffixText) {
					acc[verb].conjugation.push({
						original: sign,
						transformed: `${prefixText} PARA ${suffixText}`,
						prefix: prefixText,
						suffix: suffixText,
					});
				} else {
					// infinitivo ou forma sem conjugação vai para o início
					acc[verb].conjugation.unshift({
						original: sign,
						transformed: sign,
						prefix: prefixText,
						suffix: suffixText,
					});
				}
			}
		}
	}

	for (const verb in acc) {
		acc[verb].conjugation.sort(
			(a, b) => conjugationOrder.indexOf(a.transformed) - conjugationOrder.indexOf(b.transformed),
		);
	}

	return Object.fromEntries(Object.entries(acc).sort(([a], [b]) => a.localeCompare(b)));
}
