import { cva, type VariantProps } from "class-variance-authority";

export const appVariants = cva("fixed", {
	variants: {
		isDragging: { true: "", false: "transition-all" },
		isOpen: { true: "", false: "opacity-0" },
		hasMoved: { true: "top-0 left-0", false: "" },
		isExpanded: { true: "", false: "" },
		position: { left: "", right: "" },
	},
	compoundVariants: [
		{
			hasMoved: false,
			position: "left",
			class: "top-1/2 left-2 -translate-y-1/2 animate-move-left",
		},
		{
			hasMoved: false,
			position: "right",
			class: "top-1/2 right-2 -translate-y-1/2 animate-move-right",
		},
		{
			isOpen: false,
			position: "left",
			class: "top-1/2 left-2 -translate-y-1/2 animate-move-left -left-200",
		},
		{
			isOpen: false,
			position: "right",
			class: "top-1/2 right-2 -translate-y-1/2 animate-move-right -right-200",
		},

		{
			isExpanded: true,
			isOpen: true,
			class: [
				"w-dvw max-w-dvw sm:h-auto sm:w-xl sm:[--player-height:800px]",
				"max-sm:translate-none! max-sm:transform-none! [--player-height:calc(100dvh-54px)] max-sm:inset-0 max-sm:rounded-none! max-sm:border-none!",
			],
		},
	],
	defaultVariants: {
		isDragging: false,
		isOpen: true,
		hasMoved: false,
		isExpanded: false,
	},
});

export type AppVariantsProps = VariantProps<typeof appVariants>;
