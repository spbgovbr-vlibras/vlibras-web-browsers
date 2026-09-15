import { useId } from "preact/hooks";
import type { Region } from "@/common/data/regionalism";
import { cn } from "@/common/lib/utils";
import { getAssetUrl } from "@/common/utils";

type Props = {
	isSelected?: boolean;
	region: Region;
	onSelect: () => void;
};

export const RegionalismListItem = ({ isSelected, region, onSelect }: Props) => {
	const id = useId();

	return (
		<label
			htmlFor={id}
			className={cn(
				"flex w-full cursor-pointer items-center justify-between whitespace-nowrap rounded-lg p-1.5 pr-3 transition-[colors] hover:bg-muted",
				isSelected && "bg-muted",
			)}
		>
			<div className="flex items-center justify-start gap-2 font-semibold mobile:text-xs text-secondary text-sm dark:text-white">
				<img src={getAssetUrl(region.flag)} alt="" className="h-7 mobile:h-6 w-auto rounded-sm border" />
				<span>{region.name}</span>
			</div>
			<input
				id={id}
				type="radio"
				name="region"
				checked={isSelected}
				onChange={onSelect}
				className="radio mobile:size-4 size-5 border border-primary bg-transparent! p-0.75! text-primary"
			/>
		</label>
	);
};
