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
			<path d="M7.33333 20C8.61667 20 9.66667 18.9714 9.66667 17.7143V6.28571C9.66667 5.02857 8.61667 4 7.33333 4C6.05 4 5 5.02857 5 6.28571V17.7143C5 18.9714 6.05 20 7.33333 20ZM14.3333 6.28571V17.7143C14.3333 18.9714 15.3833 20 16.6667 20C17.95 20 19 18.9714 19 17.7143V6.28571C19 5.02857 17.95 4 16.6667 4C15.3833 4 14.3333 5.02857 14.3333 6.28571Z" />{" "}
		</svg>
	);
};
