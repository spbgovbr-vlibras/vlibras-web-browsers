import { Fragment } from "preact/jsx-runtime";
import { posthogg } from "@/common/lib/posthog";
import { cn } from "@/common/lib/utils";
import { getAssetUrl } from "@/common/utils";
import { type Region, regions } from "@/data/regionalism";
import { playerStore, usePlayerStore } from "@/player/use-player.store";
import { InlineTranslatorButton } from "@/widget/components/inline-translator-button";
import { buttonVariants } from "@/widget/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/widget/components/ui/dialog";
import { useSettingsCtx } from "./context";
import { RegionalismListItem } from "./regionalism-list-item";

export const SettingsRegionalismField = () => {
	const currentRegion = usePlayerStore((s) => s.region);
	const onOpen = useSettingsCtx((s) => s.onOpen);

	const handleRegionChange = (region: Region) => {
		playerStore.set({ region });
		posthogg.trackEvent("change_region", { region: `${region.name} (${region.abbreviation})` });
	};

	return (
		<div className="flex w-full items-center justify-between">
			<p className="mobile:text-sm text-base">
				Regionalismo
				<InlineTranslatorButton gloss="REGIÃO" onFinish={onOpen} />
			</p>

			<Dialog nested>
				<DialogTrigger className={cn(buttonVariants({ variant: "ghost" }), "h-auto border p-1")}>
					<span className="ml-1 font-semibold mobile:text-xs text-sm">{currentRegion.abbreviation}</span>
					<img
						className="h-6 mobile:h-6 rounded-sm border"
						src={getAssetUrl(currentRegion.flag)}
						alt={currentRegion.name}
					/>
				</DialogTrigger>

				<DialogContent className="max-h-[70%]">
					{({ onOpenChange }) => {
						return (
							<Fragment>
								<DialogHeader>
									<DialogTitle>Regionalismo</DialogTitle>
								</DialogHeader>
								<div className="flex flex-col overflow-y-auto p-1">
									{regions.map((region) => {
										const isSelected = region === currentRegion;

										return (
											<RegionalismListItem
												onSelect={() => {
													handleRegionChange(region);
													onOpenChange(false);
												}}
												isSelected={isSelected}
												region={region}
											/>
										);
									})}
								</div>
							</Fragment>
						);
					}}
				</DialogContent>
			</Dialog>
		</div>
	);
};
