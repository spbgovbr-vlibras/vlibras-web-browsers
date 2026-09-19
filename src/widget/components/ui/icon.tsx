import type { ComponentProps } from "preact";
import { cn } from "@/common/lib/utils";
import { getAssetUrl } from "@/common/utils";
import type { IconName } from "@/widget/icons/types";

type IconProps = Omit<ComponentProps<"i">, "style"> & {
	name: IconName;
	style?: Record<string, string>;
	colored?: boolean;
};

export const Icon = ({ className, name, colored = false, style, ...props }: IconProps) => {
	const src = getAssetUrl(`icons/${name}.webp`);
	const urlString = `url(${src})`;

	return (
		<i
			aria-hidden="true"
			className={cn(
				"inline-block shrink-0 bg-center bg-contain bg-no-repeat",
				!colored && "mask-center mask-contain mask-no-repeat transform-gpu bg-current",
				className,
			)}
			style={{
				...(colored
					? { backgroundImage: urlString }
					: {
							maskImage: urlString,
							WebkitMaskImage: urlString,
							willChange: "transform, mask-image",
						}),
				...style,
			}}
			{...props}
		/>
	);
};
