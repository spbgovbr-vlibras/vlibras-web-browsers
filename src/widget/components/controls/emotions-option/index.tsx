import { useMobile } from "@/common/hooks";
import { Button } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";
import { EmotionsIcon } from "@/widget/icons";

export const EmotionsOption = () => {
	const isMobile = useMobile();
	return (
		<Tooltip className="text-xs" offset={8} content="Emoções" placement="top" arrow={{ position: "bottom" }}>
			<Button variant="ghost-gov" size={isMobile ? "icon-sm" : "icon"}>
				<EmotionsIcon />
			</Button>
		</Tooltip>
	);
};
