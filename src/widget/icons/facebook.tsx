import type { CustomSVGProps } from "./types";

export const FacebookIcon = ({ size = 24, iconTitle, ...props }: CustomSVGProps) => {
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
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 4.991-3.657 9.128-8.438 9.879V14.89h2.648l.504-3.288H13.56V9.515c0-.899.44-1.776 1.853-1.776h1.433V4.942s-1.3-.222-2.543-.222c-2.596 0-4.293 1.573-4.293 4.422v2.46H7.398V14.89H10.01v7.01C5.168 21.201 2 17.02 2 12Z"
			/>
		</svg>
	);
};
