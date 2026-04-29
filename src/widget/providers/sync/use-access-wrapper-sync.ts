import { useEffect, useRef } from "preact/hooks";
import { $ } from "@/common/utils/dom";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

export const useAccessWrapperSync = () => {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const isOpen = useWidgetStore((s) => s.isOpen);

	useEffect(() => {
		const shadowRoot = $("#vlibras-access-wrapper")?.shadowRoot;
		const wrapper = shadowRoot ? $<HTMLDivElement>("#vlibras-access", shadowRoot) : null;
		if (wrapper) wrapperRef.current = wrapper;
	}, []);

	useEffect(() => {
		if (!wrapperRef.current) return;
		wrapperRef.current.style.display = isOpen ? "none" : "flex";
	}, [isOpen]);

	return null;
};
