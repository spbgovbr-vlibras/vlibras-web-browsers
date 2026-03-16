import type { CustomSVGProps } from "./types";

export const SubtitleIcon = ({ size = 24, iconTitle, ...props }: CustomSVGProps) => {
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
			<path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM5 12H7C7.55 12 8 12.45 8 13C8 13.55 7.55 14 7 14H5C4.45 14 4 13.55 4 13C4 12.45 4.45 12 5 12ZM13 18H5C4.45 18 4 17.55 4 17C4 16.45 4.45 16 5 16H13C13.55 16 14 16.45 14 17C14 17.55 13.55 18 13 18ZM19 18H17C16.45 18 16 17.55 16 17C16 16.45 16.45 16 17 16H19C19.55 16 20 16.45 20 17C20 17.55 19.55 18 19 18ZM19 14H11C10.45 14 10 13.55 10 13C10 12.45 10.45 12 11 12H19C19.55 12 20 12.45 20 13C20 13.55 19.55 14 19 14Z" />
		</svg>
	);
};
