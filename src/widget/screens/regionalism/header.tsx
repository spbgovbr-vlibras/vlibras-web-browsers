import { useMobile } from "@/common/hooks";
import { Button } from "@/widget/components/ui/button";
import { ArrowLeftIcon } from "@/widget/icons";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { ScreenHeader, ScreenTitle } from "../components";

export const RegionalismHeader = () => {
	const isMobile = useMobile();
	const open = useScreensStore((s) => s.open);

	return (
		<ScreenHeader>
			<Button
				onClick={() => open("settings")}
				variant="outline"
				size={isMobile ? "icon-sm" : "icon"}
				className="rounded-full"
			>
				<ArrowLeftIcon />
			</Button>

			<ScreenTitle>Regionalismo</ScreenTitle>
		</ScreenHeader>
	);
};
