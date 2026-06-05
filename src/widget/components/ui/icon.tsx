import type { ComponentProps } from "preact";
import { cn } from "@/common/lib/utils";
import type { IconName } from "@/widget/icons/types";

const icons = import.meta.glob("@/widget/icons/**/*.webp", {
	eager: true,
	query: "?inline",
	import: "default",
});

type IconProps = Omit<ComponentProps<"i">, "style"> & {
	name: IconName;
	style?: Record<string, string>;
	colored?: boolean;
};

export const Icon = ({ className, name, colored = false, style, ...props }: IconProps) => {
	const src = icons[`/src/widget/icons/${name}.webp`];

	return (
		<i
			{...props}
			className={cn(
				"inline-block shrink-0 bg-center bg-contain bg-no-repeat",
				!colored && "mask-(--icon) mask-center mask-contain mask-no-repeat bg-current",
				className,
			)}
			style={{
				[colored ? "backgroundImage" : "--icon"]: `url(${src})`,
				...style,
			}}
		/>
	);
};
