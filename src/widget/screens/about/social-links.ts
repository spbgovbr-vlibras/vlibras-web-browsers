import type { IconName } from "@/widget/icons/types";

type SocialLink = {
	href: string;
	name: string;
	iconName: IconName;
};

export const socialLinks: SocialLink[] = [
	{
		href: "https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/vlibras",
		name: "Site VLibras",
		iconName: "worldwide",
	},
	{ href: "https://www.facebook.com/vlibras", name: "Facebook", iconName: "facebook" },
	{ href: "https://www.instagram.com/vlibrasoficial", name: "Instagram", iconName: "instagram" },
	{ href: "https://x.com/VLibrasoficial", name: "Twitter", iconName: "twitter" },
	{ href: "https://www.youtube.com/@vlibras-lavid3180", name: "YouTube", iconName: "youtube" },
];
