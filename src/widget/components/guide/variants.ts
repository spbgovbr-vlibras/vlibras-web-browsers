import { cva } from "class-variance-authority";

export const guideVariants = cva("absolute flex flex-col gap-4 z-50 rounded-xl bg-primary p-4 transition-position", {
	variants: {
		isMobile: { true: "", false: "" },
		isLeft: { true: "", false: "" },
		isTop: { true: "", false: "" },
		isExpanded: { true: "", false: "" },
	},
	compoundVariants: [
		{
			isExpanded: false,
			class: "w-screen max-w-xs",
		},
		{
			isMobile: false,
			isExpanded: false,
			isLeft: true,
			class: "top-0 -right-3 translate-x-full",
		},
		{
			isMobile: false,
			isExpanded: false,
			isLeft: false,
			class: "top-0 -left-3 -translate-x-full",
		},
		{
			isMobile: true,
			isExpanded: false,
			isTop: true,
			class: "inset-x-0 -bottom-2 left-1/2 min-w-xs -translate-x-1/2 translate-y-full",
		},
		{
			isMobile: true,
			isExpanded: false,
			isTop: false,
			class: "inset-x-0 -top-2 left-1/2 min-w-xs -translate-x-1/2 -translate-y-full",
		},
		{
			isExpanded: true,
			class: "z-2147483647 inset-x-4 bottom-16",
		},
	],
	defaultVariants: {
		isMobile: false,
		isExpanded: false,
		isLeft: false,
		isTop: false,
	},
});
