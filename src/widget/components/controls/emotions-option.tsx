import { Button } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";
import { EmotionsIcon } from "@/widget/icons";

export const EmotionsOption = () => {
	return (
		<Tooltip className="text-xs" offset={8} content="Emoções" placement="top" arrow={{ position: "bottom" }}>
			<Button variant="ghost-gov" size="icon">
				<EmotionsIcon />
			</Button>
		</Tooltip>
	);
};
