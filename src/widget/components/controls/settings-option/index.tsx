import { useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useMobile } from "@/common/hooks";
import { Button } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";
import { SettingsDialog } from "@/widget/dialogs/settings";
import { SettingsIcon } from "@/widget/icons";

export const SettingsOption = () => {
	const isMobile = useMobile();
	const [open, setOpen] = useState(false);

	return (
		<Fragment>
			<Tooltip
				className="whitespace-nowrap text-xs"
				offset={8}
				align="end"
				content="Configurações"
				placement="top"
				arrow={{ position: "bottom-right" }}
			>
				<Button onClick={() => setOpen(true)} variant="ghost-gov" size={isMobile ? "icon-sm" : "icon"}>
					<SettingsIcon />
				</Button>
			</Tooltip>

			<SettingsDialog open={open} onOpenChange={setOpen} />
		</Fragment>
	);
};
