import { useMobile } from "@/common/hooks";
import { posthogg } from "@/common/lib/posthog";
import { createStyle } from "@/core/dom";
import { Button } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";
import { CollapseIcon, ExpandIcon } from "@/widget/icons";
import { useRootStore } from "@/widget/stores/use-root.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import css from "@/widget/styles/expanded-mode.css?inline";

export const ExpandOption = () => {
	const isMobile = useMobile();
	const isExpanded = useWidgetStore((s) => s.isExpanded);

	const toggleExpand = () => {
		createStyle(css, "@expanded-mode.style");

		const { root } = useRootStore.getState();
		const { isExpanded } = useWidgetStore.getState();
		const nextState = !isExpanded;

		if (!root) return;

		useWidgetStore.setState({ isExpanded: nextState });

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
	const Icon = isExpanded ? CollapseIcon : ExpandIcon;

	return (
		<Tooltip
			className="whitespace-nowrap text-xs"
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
				<Icon />
			</Button>
		</Tooltip>
	);
};
