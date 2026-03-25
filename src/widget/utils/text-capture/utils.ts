import { $ } from "@/common/utils/dom";

const $root = Array.from([document.body, ...document.body.children]);
const $guide = $(".vlibras-guide-container");

export const getTextContent = (element: HTMLElement) => {
	if (hasTag(element, ["IMG"])) return (element as HTMLImageElement).alt;
	if (isSubmitInput(element)) return (element as HTMLInputElement).value;
	if (element.dataset.vlibrasGloss) return element.dataset.vlibrasGloss;
	if (element.dataset.vlibrasText) return element.dataset.vlibrasText;
	if (hasTag(element, ["SELECT"])) return $(`[value="${(element as HTMLSelectElement).value}"]`, element)?.innerText;

	return element.innerText.trim() || "";
};

export const findInteractiveElement = (el: HTMLElement) => {
	let currentElement: HTMLElement | null = el;

	while (currentElement) {
		if ($root.includes(currentElement)) break;
		if (isLinkOrButton(currentElement) || (currentElement.onclick && !isSVG(currentElement))) return currentElement;
		currentElement = currentElement.parentNode as HTMLElement | null;
	}
	return null;
};

export const isValidElement = (element: HTMLElement) => {
	if ($guide?.contains(element)) return false;

	return element.matches(".vlibras-links")
		? false
		: hasTextContent(element) ||
				findInteractiveElement(element) ||
				isSubmitInput(element) ||
				isValidImage(element) ||
				isSelect(element);
};

export const hasTag = (el: HTMLElement, tags: string[] | string) => {
	return tags.includes(el.tagName);
};

export const isLinkOrButton = (el: HTMLElement) => {
	return hasTag(el, ["A", "BUTTON"]);
};
export const isSubmitInput = (el: HTMLElement) => {
	return hasTag(el, "INPUT") && (el as HTMLButtonElement).type === "submit";
};
export const isValidImage = (el: HTMLElement) => {
	return hasTag(el, "IMG") && (el as HTMLImageElement).alt && (el as HTMLImageElement).alt.trim();
};

export const isSelect = (el: HTMLElement) => {
	return hasTag(el, "SELECT");
};
export const isSVG = (el: HTMLElement) => {
	return hasTag(el, ["SVG", "PATH"]);
};

export const hasTextContent = (element: HTMLElement) => {
	const check = (item: ChildNode) => item.nodeType === Node.TEXT_NODE && item?.textContent?.trim();
	return Array.from(element.childNodes).some((e) => check(e));
};

export const toggleChecked = (element: HTMLElement) => {
	if (!element.parentElement) return;
	const input = $("input", element.parentElement) as HTMLInputElement;
	if (input && ["radio", "checkbox"].includes(input.type)) input.checked = !input.checked;
};

type WordAtPointResult = {
	word: string;
	node: Text;
	offset: number;
};

export const getWordAtPoint = (x: number, y: number): WordAtPointResult | null => {
	let node: Node | null = null;
	let offset = 0;

	// Chrome, Firefox, etc.
	if (document.caretPositionFromPoint) {
		const pos = document.caretPositionFromPoint(x, y);
		if (!pos || !pos.offsetNode) return null;
		node = pos.offsetNode;
		offset = pos.offset;
	}
	// Safari fallback
	else if (document.caretRangeFromPoint) {
		const range = document.caretRangeFromPoint(x, y);
		if (!range || !range.startContainer) return null;
		node = range.startContainer;
		offset = range.startOffset;
	}

	if (!node || node.nodeType !== Node.TEXT_NODE) return null;

	const text = node.textContent ?? "";
	if (!text.trim()) return null;

	const left = text.slice(0, offset);
	const right = text.slice(offset);

	const leftMatch = left.match(/[\wÀ-ú’-]+$/);
	const rightMatch = right.match(/^[\wÀ-ú’-]+/);

	const word = `${leftMatch?.[0] ?? ""}${rightMatch?.[0] ?? ""}`;
	if (!word) return null;

	const wordStartOffset = offset - (leftMatch?.[0]?.length ?? 0);

	return { word, node: node as Text, offset: wordStartOffset };
};

export const removeClass = (clss: string) => {
	document.querySelectorAll(`span.${clss}`).forEach((span) => {
		const parent = span.parentNode;
		if (!parent) return;
		const textNode = document.createTextNode(span.textContent || "");
		parent.replaceChild(textNode, span);
		parent.normalize();
	});
};

export const removeAllClasses = (clss: string) => {
	document.querySelectorAll(`.${clss}`).forEach((el) => el.classList.remove(clss));
};

export const markWord = () => {};
