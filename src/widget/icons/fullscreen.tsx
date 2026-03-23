import type { CustomSVGProps } from "./types";

export const FullscreenIcon = ({ size = 24, iconTitle, ...props }: CustomSVGProps) => {
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
			<path d="M20 9.27944V4.94444C20 4.425 19.575 4 19.0556 4H14.7206C13.88 4 13.455 5.02 14.05 5.615L15.5517 7.11667L6.10722 16.5611L4.60556 15.0594C4.02 14.4644 3 14.88 3 15.7206V20.0556C3 20.575 3.425 21 3.94444 21H8.27944C9.12 21 9.545 19.98 8.95 19.385L7.44833 17.8833L16.8928 8.43889L18.3944 9.94056C18.98 10.5356 20 10.12 20 9.27944Z" />
		</svg>
	);
};
