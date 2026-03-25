import type { CustomSVGProps } from "./types";

export const PlayIcon = ({ size = 24, iconTitle, ...props }: CustomSVGProps) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
			aria-hidden={iconTitle ? "false" : "true"}
		>
			<title>{iconTitle}</title>
			<path d="M5.70385 2.21234C5.1375 1.90878 4.4524 1.92217 3.89519 2.24359C3.33798 2.56501 3 3.14982 3 3.77926V20.2073C3 20.8368 3.34255 21.4216 3.89519 21.743C4.44784 22.0644 5.1375 22.0778 5.70385 21.7743L21.05 13.5602C21.6346 13.2477 22 12.6451 22 11.9933C22 11.3415 21.6346 10.7389 21.05 10.4264L5.70385 2.21234Z" />
		</svg>
	);
};
