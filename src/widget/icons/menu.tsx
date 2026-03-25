import type { CustomSVGProps } from "./types";

export const MenuIcon = ({ size = 24, iconTitle, ...props }: CustomSVGProps) => {
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
			<path d="M3 6.25C3 5.55859 3.57455 5 4.28571 5H19.7143C20.4254 5 21 5.55859 21 6.25C21 6.94141 20.4254 7.5 19.7143 7.5H4.28571C3.57455 7.5 3 6.94141 3 6.25ZM3 12.5C3 11.8086 3.57455 11.25 4.28571 11.25H19.7143C20.4254 11.25 21 11.8086 21 12.5C21 13.1914 20.4254 13.75 19.7143 13.75H4.28571C3.57455 13.75 3 13.1914 3 12.5ZM21 18.75C21 19.4414 20.4254 20 19.7143 20H4.28571C3.57455 20 3 19.4414 3 18.75C3 18.0586 3.57455 17.5 4.28571 17.5H19.7143C20.4254 17.5 21 18.0586 21 18.75Z" />{" "}
		</svg>
	);
};
