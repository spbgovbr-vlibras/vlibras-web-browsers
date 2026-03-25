import type { CustomSVGProps } from "./types";

export const XIcon = ({ size = 24, iconTitle, ...props }: CustomSVGProps) => {
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
			<path d="M6.27724 4.39464C5.75661 3.87401 4.9111 3.87401 4.39047 4.39464C3.86984 4.91527 3.86984 5.76077 4.39047 6.2814L10.1132 12L4.39464 17.7228C3.87401 18.2434 3.87401 19.0889 4.39464 19.6095C4.91527 20.1302 5.76077 20.1302 6.2814 19.6095L12 13.8868L17.7228 19.6054C18.2434 20.126 19.0889 20.126 19.6095 19.6054C20.1302 19.0847 20.1302 18.2392 19.6095 17.7186L13.8868 12L19.6054 6.27724C20.126 5.75661 20.126 4.9111 19.6054 4.39047C19.0847 3.86984 18.2392 3.86984 17.7186 4.39047L12 10.1132L6.27724 4.39464Z" />
		</svg>
	);
};
