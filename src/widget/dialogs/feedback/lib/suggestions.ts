type CaretCoordinates = {
	top: number;
	left: number;
};

export function getCurrentWord(text: string, cursor: number) {
	const start = text.slice(0, cursor).lastIndexOf(" ");

	const end = text.indexOf(" ", cursor);

	return text.slice(start + 1, end === -1 ? text.length : end);
}

export function applySuggestion(text: string, cursor: number, suggestion: string) {
	const before = text.slice(0, cursor);

	const after = text.slice(cursor);

	const newBefore = before.replace(/\S+$/, `${suggestion} `);

	return `${newBefore}${after.trimStart()}`;
}

export function getCaretCoordinates(el: HTMLTextAreaElement, cursorPos: number): CaretCoordinates {
	const style = window.getComputedStyle(el);

	const mirror = document.createElement("div");

	mirror.style.position = "absolute";
	mirror.style.visibility = "hidden";
	mirror.style.whiteSpace = "pre-wrap";
	mirror.style.wordWrap = "break-word";

	mirror.style.width = `${el.clientWidth}px`;

	mirror.style.font = style.font;
	mirror.style.padding = style.padding;
	mirror.style.lineHeight = style.lineHeight;
	mirror.style.letterSpacing = style.letterSpacing;

	const textBeforeCursor = el.value.slice(0, cursorPos);

	mirror.textContent = textBeforeCursor;

	const span = document.createElement("span");

	span.textContent = "|";

	mirror.appendChild(span);

	document.body.appendChild(mirror);

	const popupWidth = 160;

	const containerWidth = el.parentElement?.clientWidth ?? el.clientWidth;

	let left = span.offsetLeft + 15;

	if (left + popupWidth > containerWidth) {
		left = span.offsetLeft - popupWidth;
	}

	left = Math.max(0, left);

	const coords = {
		top: span.offsetTop + Number.parseInt(style.lineHeight || "20", 10),

		left,
	};

	document.body.removeChild(mirror);

	return coords;
}
