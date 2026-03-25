import type { CustomSVGProps } from "./types";

export const PauseIcon = ({ size = 24, iconTitle, ...props }: CustomSVGProps) => {
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
			<path d="M6.875 3C5.83984 3 5 3.86384 5 4.92857V19.0714C5 20.1362 5.83984 21 6.875 21H9.375C10.4102 21 11.25 20.1362 11.25 19.0714V4.92857C11.25 3.86384 10.4102 3 9.375 3H6.875ZM15.625 3C14.5898 3 13.75 3.86384 13.75 4.92857V19.0714C13.75 20.1362 14.5898 21 15.625 21H18.125C19.1602 21 20 20.1362 20 19.0714V4.92857C20 3.86384 19.1602 3 18.125 3H15.625Z" />{" "}
		</svg>
	);
};
