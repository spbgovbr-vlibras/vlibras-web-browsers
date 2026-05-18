export type GuideElement = {
	selector: string;
	text: string;
	gloss: string;
	guideClx: string;
	action?: () => void;
};

export const guideElements: GuideElement[] = [
	{
		selector: "#header-menu-button",
		text: "Clique no Menu para acessar o Tradutor, o Dicionário ou saber mais sobre o VLibras.",
		gloss: "CLIQUE MENU ACESSAR TRADUTOR DICIONÁRIO SABER MAIS&QUANTIDADE SOBRE&ASSUNTO VLIBRAS",
		guideClx: "top-0! bottom-auto!",
	},

	{
		selector: "#header-actions",
		text: "Aqui você pode aumentar o tamanho da janela e fechar a aplicação.",
		gloss: "AQUI VOCÊ PODER&POSSIBILIDADE AUMENTAR&TAMANHO JANELA FECHAR&INFORMÁTICA APLICAÇÃO",
		guideClx: "top-0! bottom-auto!",
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
