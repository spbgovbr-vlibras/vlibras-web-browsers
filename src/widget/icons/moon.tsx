import type { CustomSVGProps } from "./types";

export const MoonIcon = ({ size = 24, iconTitle, ...props }: CustomSVGProps) => {
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
			<path d="M11.01 3.05001C6.51 3.54001 3 7.36001 3 12C3 16.97 7.03 21 12 21C16.63 21 20.45 17.5 20.95 13C21.04 12.21 20.17 11.58 19.41 12.05C18.57 12.59 17.57 12.9 16.5 12.9C13.52 12.9 11.1 10.48 11.1 7.50001C11.1 6.44001 11.41 5.44001 11.94 4.61001C12.39 3.94001 11.9 2.98001 11.01 3.05001Z" />{" "}
		</svg>
	);
};
