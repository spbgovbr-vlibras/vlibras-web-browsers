import { useEffect } from "preact/hooks";
import { useMobile, usePick } from "@/common/hooks";
import { posthogg } from "@/common/lib/posthog";
import { MaskIcon } from "@/common/utils/mask-icon";
import { createStyle } from "@/core/dom";
import { Button } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";
import collapseIcon from "@/widget/icons/collapse.webp";
import expandIcon from "@/widget/icons/expand.webp";
import { rootStore } from "@/widget/stores/use-root.store";
import { useWidgetStore, widgetStore } from "@/widget/stores/use-widget.store";
import css from "@/widget/styles/expanded-mode.css?inline";

export const ExpandOption = () => {
	const isMobile = useMobile();
	const { isOpen, isExpanded } = useWidgetStore(usePick("isOpen", "isExpanded"));

	useEffect(() => {
		const { root } = rootStore.get();
		if (!root || isOpen) return;

		delete root.dataset.expanded;
		delete document.body.dataset.vlibrasExpanded;
	}, [isOpen]);

	const toggleExpand = () => {
		createStyle(css, "@expanded-mode.style");

		const { root } = rootStore.get();
		const { isExpanded } = widgetStore.get();
		const nextState = !isExpanded;

		if (!root) return;

		widgetStore.set({ isExpanded: nextState });

		if (!nextState) {
			delete root.dataset.expanded;
			delete document.body.dataset.vlibrasExpanded;
			return;
		}

		root.dataset.expanded = "true";
		document.body.dataset.vlibrasExpanded = "true";
		posthogg.trackEvent("expanded");
	};

	const label = isExpanded ? "Diminuir" : "Expandir";
	const icon = isExpanded ? collapseIcon : expandIcon;

	return (
		<Tooltip
			className="whitespace-nowrap"
			offset={2}
			content={label}
			placement="bottom"
			align="end"
			arrow={{ position: "top-right" }}
		>
			<Button
				onClick={toggleExpand}
				className="z-1"
				aria-label={label}
				size={isMobile ? "icon-sm" : "icon"}
				variant="default"
			>
				<MaskIcon src={icon} className="bg-white" />
			</Button>
		</Tooltip>
	);
};
