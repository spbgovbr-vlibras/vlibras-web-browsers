import type { ComponentProps, CSSProperties } from "preact";
import { cn } from "@/common/lib/utils";
import type { StrictOmit } from "@/common/types";
import { getAssetUrl } from "@/common/utils";
import type { IconName } from "@/widget/icons/types";

type IconProps = Omit<ComponentProps<"i">, "style"> & {
	name: IconName;
	style?: StrictOmit<CSSProperties, "filter" | "transform">;
	colored?: boolean;
};

const TINT_SHIFT_PX = 256;

const imgProps = { draggable: false, decoding: "sync" } as const;

export const Icon = ({ className, name, colored = false, style, ...props }: IconProps) => {
	const src = getAssetUrl(`icons/${name}.webp`);

	return (
		<i aria-hidden="true" className={cn("inline-block shrink-0", !colored && "overflow-hidden", className)} {...props}>
			<img
				alt=""
				{...imgProps}
				src={src}
				className="block size-full object-contain object-center"
				style={
					colored
						? style
						: {
								...style,
								filter: `drop-shadow(0 ${TINT_SHIFT_PX}px 0 currentColor)`,
								transform: `translateY(${-TINT_SHIFT_PX}px)`,
							}
				}
			/>
		</i>
	);
};
