import type { CustomSVGProps } from "./types";

export const CommentIcon = ({ size = 24, iconTitle, ...props }: CustomSVGProps) => {
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
			<path d="M22 11.3742C22 16.5496 17.5234 20.7485 12 20.7485C10.5508 20.7485 9.17578 20.4594 7.93359 19.94L3.30859 21.9242C2.94141 22.0804 2.51953 21.9906 2.25 21.6976C1.98047 21.4047 1.92188 20.975 2.10938 20.6235L4.01562 17.0222C2.75 15.4481 2 13.4952 2 11.3742C2 6.19888 6.47656 2 12 2C17.5234 2 22 6.19888 22 11.3742Z" />
		</svg>
	);
};
