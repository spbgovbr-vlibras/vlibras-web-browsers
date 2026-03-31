import type { CustomSVGProps } from "./types";

export const TrashIcon = ({ size = 24, iconTitle, ...props }: CustomSVGProps) => {
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
			<path d="M8.72626 2.62125L8.40001 3.6H4.80001C4.13626 3.6 3.60001 4.13625 3.60001 4.8C3.60001 5.46375 4.13626 6 4.80001 6H19.2C19.8638 6 20.4 5.46375 20.4 4.8C20.4 4.13625 19.8638 3.6 19.2 3.6H15.6L15.2738 2.62125C15.1088 2.13 14.6513 1.8 14.1338 1.8H9.86626C9.34876 1.8 8.89126 2.13 8.72626 2.62125ZM19.2 7.8H4.80001L5.59126 19.9162C5.65126 20.865 6.43876 21.6 7.38751 21.6H16.6125C17.5613 21.6 18.3488 20.865 18.4088 19.9162L19.2 7.8Z" />
		</svg>
	);
};
