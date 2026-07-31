import { cn } from "@/common/lib/utils";
import { getAssetUrl } from "@/common/utils";
import type { Region } from "@/data/regionalism";

type Props = {
	isSelected?: boolean;
	region: Region;
	onSelect: () => void;
};

export const RegionalismListItem = ({ isSelected, region, onSelect }: Props) => {
	return (
		<button
			inert={isSelected}
			type="button"
			key={region.abbreviation}
			onClick={onSelect}
			className={cn(
				"flex w-full cursor-pointer items-center justify-between whitespace-nowrap rounded-lg p-1.5 pr-3 transition-[colors] hover:bg-muted",
				isSelected && "order-first",
			)}
		>
			<div className="flex items-center justify-start gap-2 font-semibold mobile:text-xs text-secondary text-sm dark:text-white">
				<img src={getAssetUrl(region.flag)} alt={region.name} className="h-7 mobile:h-6 w-auto rounded-sm border" />
				<span>{region.name}</span>
			</div>
			<input
				inert
				type="radio"
				name={`region-${region.abbreviation}`}
				className="radio mobile:size-4 size-5 border border-primary bg-transparent! p-0.75! text-primary"
				checked={isSelected}
			/>
		</button>
	);
};
