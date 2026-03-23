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
			<path d="M6 5.29602V18.704C6 19.7264 7.11483 20.3476 7.97339 19.7911L18.4041 13.0871C19.1986 12.5824 19.1986 11.4176 18.4041 10.8999L7.97339 4.20889C7.11483 3.65238 6 4.2736 6 5.29602Z" />
		</svg>
	);
};
