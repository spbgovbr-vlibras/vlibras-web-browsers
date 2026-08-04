export type GuideElement = {
	selector: string;
	text: string;
	gloss: string;
	guideClx: string;
	guideClxExpanded?: string;
	action?: () => void;
	focus?: boolean;
};

export const guideElements: GuideElement[] = [
	{
		selector: "#header-menu-button",
		text: "Clique no Menu para acessar o Tradutor, o Dicionário ou saber mais sobre o VLibras.",
		gloss: "CLIQUE MENU ACESSAR TRADUTOR DICIONÁRIO SABER MAIS&QUANTIDADE SOBRE&ASSUNTO VLIBRAS",
		guideClx: "top-0! bottom-auto!",
		focus: true,
	},

	{
		selector: "#header-actions",
		text: "Aqui você pode aumentar o tamanho da janela e fechar a aplicação.",
		gloss: "AQUI VOCÊ PODER&POSSIBILIDADE AUMENTAR&TAMANHO JANELA FECHAR&INFORMÁTICA APLICAÇÃO",
		guideClx: "top-0! bottom-auto!",
	},

	{
		selector: "#toggle-avatar-button",
		text: "Aqui você pode alterar o avatar. Você pode escolher entre Ícaro, Hosana e Guga.",
		gloss:
			"AQUI VOCÊ PODER&POSSIBILIDADE TROCAR AVATAR [PONTO] VOCÊ PODER&POSSIBILIDADE ESCOLHER ENTRE [WLCM]ICARO_SINAL [WLCM]HOZANA_SINAL [WLCM]GUGA_SINAL ",
		guideClx: "top-auto! bottom-6.5!",
		guideClxExpanded: "mr-12!",
		focus: true,
	},

	{
		selector: "#main-action-speed-options",
		text: "Aqui você pode pausar, retomar, reiniciar ou alterar a velocidade da animação.",
		gloss: "AQUI VOCÊ PODER&POSSIBILIDADE RETOMAR RETOMAR REINICIAR OU ALTERAR VELOCIDADE ANIMAR",
		guideClx: "top-auto! bottom-0!",
	},

	{
		selector: "#emotions-subtitles-options",
		text: "Estas opções permitem alterar a emoção do avatar e ativar ou desativar as legendas.",
		gloss: "OPÇÃO PERMITIR&LIBERAR ALTERAR EMOÇÃO AVATAR ATIVAR OU DESATIVAR LEGENDA",
		guideClx: "top-auto! bottom-0!",
	},

	{
		selector: "#settings-option",
		text: "Opção para acessar as configurações do VLibras. Aqui você pode alterar o tema, regionalismo e transparência do fundo do avatar.",
		gloss:
			"OPÇÃO ACESSAR CONFIGURAÇÃO [PONTO] AQUI VOCÊ PODER&POSSIBILIDADE ALTERAR TEMA&ASSUNTO ALTERAR REGIONAL ALTERAR TRANSPARÊNCIA&NITIDEZ ALTERAR FUNDO&ATRÁS AVATAR",
		guideClx: "top-auto! bottom-0!",
	},
];
