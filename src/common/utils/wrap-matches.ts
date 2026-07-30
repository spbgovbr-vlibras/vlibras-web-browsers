import { Fragment, h } from "preact";

type MatchConfig = {
	part: string;
	render: (matchedText: string, index: number) => preact.VNode;
};

type WrapMatchesOptions = {
	once?: boolean;
};

export const wrapMatches = (text: string, matches: MatchConfig[], options?: WrapMatchesOptions): preact.VNode[] => {
	if (!matches || matches.length === 0) return [h(Fragment, {}, text)];

	const sortedMatches = [...matches].sort((a, b) => b.part.length - a.part.length);

	const partsToMatch = sortedMatches.map((m) => escapeRegExp(m.part));
	const pattern = new RegExp(`(${partsToMatch.join("|")})`, "g");
	const splitParts = text.split(pattern);

	const matchCounts: Record<string, number> = {};

	return splitParts.map((part, index) => {
		const match = sortedMatches.find((m) => m.part === part);
		if (match) {
			const count = matchCounts[match.part] || 0;
			const shouldRender = !options?.once || count === 0;

			matchCounts[match.part] = count + 1;

			if (shouldRender) {
				return match.render(part, index);
			}
		}

		return h(Fragment, { key: `text-${index}` }, part);
	});
};

const escapeRegExp = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
