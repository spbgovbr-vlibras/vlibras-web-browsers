import { useEffect } from "preact/hooks";
import { useMobile, usePick } from "@/common/hooks";
import { posthogg } from "@/common/lib/posthog";
import { createStyle } from "@/core/dom";
import { Button } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";
import { Tooltip } from "@/widget/components/ui/tooltip";
import type { IconName } from "@/widget/icons/types";
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

		if (!root) return;

		const newExpanded = !isExpanded;
		widgetStore.set({ isExpanded: newExpanded });
		if (newExpanded) posthogg.trackEvent("expanded");
	};

	const label = isExpanded ? "Diminuir" : "Expandir";
	const iconName: IconName = isExpanded ? "collapse" : "expand";

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
				<Icon name={iconName} aria-hidden="true" />
			</Button>
		</Tooltip>
	);
};
