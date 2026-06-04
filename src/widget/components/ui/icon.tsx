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
};

export const Icon = ({ className, name, style, ...props }: IconProps) => {
	const src = icons[`/src/widget/icons/${name}.webp`];

	return (
		<i
			{...props}
			className={cn("mask-(--icon) mask-center mask-contain mask-no-repeat shrink-0 bg-current", className)}
			style={{ "--icon": `url(${src})`, ...style }}
		/>
	);
};
