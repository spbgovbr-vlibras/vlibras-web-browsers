import type { ComponentProps, CSSProperties } from "preact";
import { cn } from "@/common/lib/utils";
import { getAssetUrl } from "@/common/utils";
import type { IconName } from "@/widget/icons/types";

type IconProps = Omit<ComponentProps<"i">, "style"> & {
	name: IconName;
	style?: Omit<CSSProperties, "backgroundImage">;
	colored?: boolean;
};

const TINT_SHIFT_PX = 256;

export const Icon = ({ className, name, colored = false, style, ...props }: IconProps) => {
	const src = getAssetUrl(`icons/${name}.webp`);
	const urlString = `url(${src})`;

	if (colored) {
		return (
			<i
				aria-hidden="true"
				className={cn("inline-block shrink-0 bg-center bg-contain bg-no-repeat", className)}
				style={{ backgroundImage: urlString, ...style }}
				{...props}
			/>
		);
	}

	return (
		<i aria-hidden="true" className={cn("inline-block shrink-0 overflow-hidden", className)} {...props}>
			<i
				aria-hidden="true"
				className="block h-full w-full bg-center bg-contain bg-no-repeat"
				style={{
					backgroundImage: urlString,
					filter: `drop-shadow(0 ${TINT_SHIFT_PX}px 0 currentColor)`,
					transform: `translateY(${-TINT_SHIFT_PX}px)`,
					...style,
				}}
			/>
		</i>
	);
};
