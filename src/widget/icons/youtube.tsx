import type { CustomSVGProps } from "./types";

export const YoutubeIcon = ({ size = 24, iconTitle, ...props }: CustomSVGProps) => {
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
			<path d="M23.5 6.2a2.9 2.9 0 00-2.05-2.05C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.45.55A2.9 2.9 0 00.5 6.2 30.7 30.7 0 000 12a30.7 30.7 0 00.5 5.8 2.9 2.9 0 002.05 2.05C4.4 20.4 12 20.4 12 20.4s7.6 0 9.45-.55a2.9 2.9 0 002.05-2.05A30.7 30.7 0 0024 12a30.7 30.7 0 00-.5-5.8zM9.6 15.5v-7l6.2 3.5-6.2 3.5z" />
		</svg>
	);
};
