import type { CustomSVGProps } from "./types";

export const SkipIcon = ({ size = 24, iconTitle, ...props }: CustomSVGProps) => {
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
			<path d="M5.58749 3.77999C6.07124 3.51749 6.66374 3.54374 7.12499 3.84749L16.8 10.2037V4.79999C16.8 4.13624 17.3362 3.59999 18 3.59999C18.6637 3.59999 19.2 4.13624 19.2 4.79999V19.2C19.2 19.8637 18.6637 20.4 18 20.4C17.3362 20.4 16.8 19.8637 16.8 19.2V13.7962L7.12499 20.1562C6.66374 20.46 6.07499 20.4862 5.58749 20.2237C5.09999 19.9612 4.79999 19.4512 4.79999 18.9V5.09999C4.79999 4.54874 5.10374 4.04249 5.58749 3.77999Z" />
		</svg>
	);
};
