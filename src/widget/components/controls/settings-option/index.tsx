import { useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useMobile } from "@/common/hooks";
import { MaskIcon } from "@/common/utils/mask-icon";
import { Button } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";
import { SettingsDialog } from "@/widget/dialogs/settings";
import settingsIcon from "@/widget/icons/settings.webp";

export const SettingsOption = () => {
	const isMobile = useMobile();
	const [open, setOpen] = useState(false);

	return (
		<Fragment>
			<Tooltip
				className="whitespace-nowrap"
				offset={8}
				align="end"
				content="Configurações"
				placement="top"
				arrow={{ position: "bottom-right" }}
			>
				<Button onClick={() => setOpen(true)} variant="ghost-gov" size={isMobile ? "icon-sm" : "icon"}>
					<MaskIcon src={settingsIcon} />
				</Button>
			</Tooltip>

			<SettingsDialog open={open} onOpenChange={setOpen} />
		</Fragment>
	);
};
