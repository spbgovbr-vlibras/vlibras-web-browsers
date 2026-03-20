import type { CustomSVGProps } from "./types";

export const ArrowLeftIcon = ({ size = 24, iconTitle, ...props }: CustomSVGProps) => {
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
			<path d="M14.71 6.71C14.6175 6.6173 14.5076 6.54375 14.3866 6.49357C14.2656 6.44339 14.1359 6.41756 14.005 6.41756C13.874 6.41756 13.7443 6.44339 13.6234 6.49357C13.5024 6.54375 13.3925 6.6173 13.3 6.71L8.70998 11.3C8.31998 11.69 8.31998 12.32 8.70998 12.71L13.3 17.3C13.69 17.69 14.32 17.69 14.71 17.3C15.1 16.91 15.1 16.28 14.71 15.89L10.83 12L14.71 8.12C15.1 7.73 15.09 7.09 14.71 6.71Z" />{" "}
		</svg>
	);
};
