import { startTransition } from "preact/compat";
import { $ } from "@/common/utils/dom";
import { useTooltipStore } from "@/widget/stores/use-tooltip.store";
import {
	findInteractiveElement,
	getTextContent,
	getWordAtPoint,
	hasTag,
	isSubmitInput,
	isValidElement,
	removeAllClasses,
	removeClass,
	toggleChecked,
} from "./utils";

type CallbackProps = {
	text: string;
	element: HTMLElement;
	isGloss?: boolean;
};

type TextCaptureProps = {
	callback?: (props: CallbackProps) => void;
	hoverClss?: string;
	activeClass?: string;
	isWordByWord?: boolean;
};

export const textCapture = ({ callback, isWordByWord, hoverClss, activeClass }: TextCaptureProps) => {
	const handleMouseOver = (event: MouseEvent) => {
		if (!hoverClss) return;
		const element = event.target as HTMLElement;
		if (isValidElement(element) && isWordByWord ? !hasTag(element, "IMG") : true) element.classList.add(hoverClss);
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (!isWordByWord || !hoverClss) return;

		startTransition(() => {
			const element = event.target as HTMLElement;
			if (!isValidElement(element)) return;

			removeClass(hoverClss);

			const { word, node, offset } = getWordAtPoint(event.clientX, event.clientY) || {};
			if (word && node && typeof offset === "number") {
				const range = document.createRange();
				range.setStart(node, offset);
				range.setEnd(node, offset + word.length);

				const span = document.createElement("span");
				span.className = hoverClss;
				span.textContent = word;

				range.deleteContents();
				range.insertNode(span);
			}
		});
	};

	const handleClick = (event: MouseEvent) => {
		const element = event.target as HTMLElement;
		const selection = window.getSelection();
		const selectedText = selection?.toString().trim();

		useTooltipStore.setState({ isActive: false });

		if (activeClass) removeAllClasses(activeClass);
		if (activeClass && !selectedText) element.classList.add(activeClass);

		if (!isValidElement(element)) return;
		if (selectedText && !isWordByWord) return callback?.({ text: selectedText, element });

		event.preventDefault();
		event.stopPropagation();

		if (isWordByWord && hoverClss) {
			const element = $(`.${hoverClss}`);
			const word = element?.textContent?.trim();

			if (word) callback?.({ text: word, element });
		} else {
			const isGloss = Boolean(element.dataset.vlibrasGloss?.trim());
			const textContent = getTextContent(element)?.trim();
			if (textContent) callback?.({ text: textContent, element, isGloss });
		}

		const interactiveElement = element.tagName === "A" ? element : findInteractiveElement(element);

		if (interactiveElement) showTooltip(interactiveElement, event);
		if (hasTag(element, "LABEL")) toggleChecked(element);
		else if (hasTag(element, "BUTTON") || isSubmitInput(element)) showTooltip(element, event);
	};

	const handleMouseOut = (event: MouseEvent) => {
		if (!hoverClss) return;
		const target = event.target as HTMLElement;
		target.classList.remove(hoverClss);
	};

	const showTooltip = (element: HTMLElement, event: MouseEvent) => {
		useTooltipStore.setState({
			isActive: true,
			event: event as MouseEvent,
			type: element.tagName.toLowerCase() === "a" ? "link" : "button",
			onClick: () => {
				element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
				useTooltipStore.setState({ isActive: false });
			},
		});
	};

	const cleanup = () => {
		document.body.removeEventListener("mousemove", handleMouseMove);
		document.body.removeEventListener("mouseover", handleMouseOver);
		document.body.removeEventListener("mouseout", handleMouseOut);
		document.body.removeEventListener("click", handleClick, true);
	};

	if (isWordByWord) {
		document.body.addEventListener("mousemove", handleMouseMove);
	} else {
		document.body.addEventListener("mouseover", handleMouseOver);
		document.body.addEventListener("mouseout", handleMouseOut);
	}

	document.body.addEventListener("click", handleClick, true);

	return cleanup;
};
