import type { CustomSVGProps } from "./types";

export const WorldwideIcon = ({ size = 24, iconTitle, ...props }: CustomSVGProps) => {
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
			{/* Círculo sólido do globo */}
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2ZM4.07 11a8.014 8.014 0 0 1 4.686-5.572C8.163 6.757 7.9 8.34 7.8 10H4.07Zm0 2H7.8c.1 1.66.363 3.243.956 4.572A8.014 8.014 0 0 1 4.07 13Zm5.734-3c.09-1.558.35-2.97.78-4.02C11.052 4.672 11.58 4.25 12 4.25s.948.422 1.416 1.73c.43 1.05.69 2.462.78 4.02H9.804Zm0 2c.09 1.558.35 2.97.78 4.02.468 1.308.996 1.73 1.416 1.73s.948-.422 1.416-1.73c.43-1.05.69-2.462.78-4.02H9.804Zm6.396-2c-.1-1.66-.363-3.243-.956-4.572A8.014 8.014 0 0 1 19.93 11H16.2Zm0 2h3.73a8.014 8.014 0 0 1-4.686 5.572C15.837 17.243 16.1 15.66 16.2 13Z"
			/>
			{/* Linha do equador — fina */}
			<line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.25" fill="none" />
			{/* Meridiano central elíptico — fino */}
			<ellipse cx="12" cy="12" rx="3.8" ry="10" fill="none" stroke="currentColor" strokeWidth="1.25" />
		</svg>
	);
};
